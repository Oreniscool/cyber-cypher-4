import os
import wave
import re
import logging
import pyaudio
import whisper
import threading
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from transformers import MarianMTModel, MarianTokenizer 
from gtts import gTTS
from werkzeug.utils import secure_filename
import tempfile
import cv2
from deepface import DeepFace
import matplotlib.pyplot as plt
import numpy as np
from flask import Flask, jsonify
import threading
from groq import Groq
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication


whisper_model = whisper.load_model("base")
GROQ_API_KEY = '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'
client = Groq(api_key=GROQ_API_KEY)
# Ensure audio directory exists
AUDIO_DIR = "recordings"
os.makedirs(AUDIO_DIR, exist_ok=True)

# PyAudio Configuration
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024

audio = pyaudio.PyAudio()
recording = False
frames = []
recording_thread = None
audio_file_path = os.path.join(AUDIO_DIR, "recorded_audio.wav")
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
def start_recording():
    """Start recording audio from the microphone."""
    global recording, frames
    recording = True
    frames = []

    stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    while recording:
        data = stream.read(CHUNK)
        frames.append(data)

    stream.stop_stream()
    stream.close()

    # Save recorded audio to a file
    with wave.open(audio_file_path, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b"".join(frames))


@app.route("/start_recording", methods=["POST"])
def start_recording_api():
    """API endpoint to start recording audio."""
    global recording_thread
    if recording:
        return jsonify({"message": "Recording already in progress", "status": "error"}), 400

    recording_thread = threading.Thread(target=start_recording)
    recording_thread.start()
    return jsonify({"message": "Recording started", "status": "success"}), 200


@app.route("/stop_recording", methods=["POST"])
def stop_recording_api():
    """API endpoint to stop recording and save the audio file."""
    global recording
    recording = False
    recording_thread.join()

    return jsonify({"message": "Recording stopped", "file": audio_file_path, "status": "success"}), 200


def transcribe_audio(filepath):
    """Transcribe audio to text using Whisper."""
    try:
        result = whisper_model.transcribe(filepath)
        return result["text"]
    except Exception as e:
        return f"Transcription Error: {e}"


def translate_text(text, src_lang, tgt_lang):
    """Translate text using MarianMT."""
    try:
        model_name = f"Helsinki-NLP/opus-mt-{src_lang}-{tgt_lang}"
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        

        tokens = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        translated = model.generate(**tokens)
        return tokenizer.decode(translated[0], skip_special_tokens=True)
    except Exception as e:
        return f"Translation Error: {e}"


def text_to_speech(text, language):
    """Convert translated text to speech using gTTS."""
    try:
        output_file = os.path.join(AUDIO_DIR, "translated_audio.mp3")
        tts = gTTS(text=text, lang=language)
        tts.save(output_file)
        return output_file
    except Exception as e:
        return None


@app.route("/process", methods=["POST"])
def process():
    """Process the audio: transcribe, translate, and generate speech."""
    try:
        data = request.get_json()
        src_lang = data.get("src_lang")
        tgt_lang = data.get("tgt_lang")

        # Validate file existence
        if not os.path.exists(audio_file_path):
            return jsonify({"message": "No recorded file found", "status": "error"}), 404

        # Transcribe
        transcript = transcribe_audio(audio_file_path)
        if "Error" in transcript:
            return jsonify({"message": transcript, "status": "error"}), 500
        print(transcript)
        # Translate
        translated_text = translate_text(transcript, src_lang, tgt_lang)
        if "Error" in translated_text:
            return jsonify({"message": translated_text, "status": "error"}), 500
        print(translated_text)
        # Convert to speech
        speech_file = text_to_speech(translated_text, tgt_lang)
        if not speech_file:
            return jsonify({"message": "TTS failed", "status": "error"}), 500

        return jsonify({
            "transcript": transcript,
            "translated_text": translated_text,
            "audio_url": "http://127.0.0.1:5000/get_audio"
        })

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}", "status": "error"}), 500
@app.route("/followup-text", methods=["POST"])
def followup_text():
    """
    Process follow-up text requests using Groq API.
    """
    try:
        # Import Groq library
        from groq import Groq

        # Get JSON data from the request
        data = request.get_json()
        logger.debug(f"Received data: {data}")

        text = data.get("text")
        src_lang = data.get("src_lang", "auto")  # Source language of the input text
        tgt_lang = data.get("tgt_lang", "en")  # Target language for the follow-up response

        # Log input text and languages
        logger.debug(f"Input text: {text}")
        logger.debug(f"Source language: {src_lang}, Target language: {tgt_lang}")

        # If the source language is not English, translate the input text to English
        if src_lang != "en":
            logger.debug("Translating input text to English...")
            translated_text = translate_text(text, src_lang, "en")
            if "Translation Error" in translated_text:
                logger.error(f"Translation failed: {translated_text}")
                return jsonify({"message": translated_text, "status": "error"}), 400
            text = translated_text
            logger.debug(f"Translated text: {text}")

        # Initialize Groq client
        logger.debug("Initializing Groq client...")
       
        # Updated prompt for Groq API
        prompt = f"""
You are a professional real estate assistant. Extract the important information related to the kind of flat the client wants and provide it in the form of pointers. Use the following template:

**Flat Requirements:**
- **Type of Flat**: [e.g., 2BHK, 3BHK, Studio Apartment, etc.]
- **Budget**: [e.g., 1.5 crore, 2 crore, etc.]
- **Location Prefernces**: [e.g., near schools, hospitals, metro stations, etc.]
- **Amenities**: [e.g., gym, swimming pool, parking, etc.]
- **Timeline**: [e.g., ready-to-move, possession in 6 months, etc.]

**Additional Information:**
- **Other Preferences**: [e.g., furnished/unfurnished, floor preference, etc.]
- **Next Steps**: [e.g., share property listings, schedule site visits, etc.]

Client's Input: {text}
"""
        logger.debug(f"Prompt sent to LLM: {prompt}")

        # Generate follow-up text using Groq API with a different model (e.g., Mixtral 8x7b)
        logger.debug("Sending request to Groq API...")
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional real estate assistant. Extract the important information related to the kind of flat the client wants and provide it in the form of pointers."
                },
                {
                    "role": "user",
                    "content": prompt  # Use the updated prompt here
                }
            ],
            model="mixtral-8x7b-32768"  # Change the model here
        )

        # Extract the generated summary
        summary = chat_completion.choices[0].message.content.strip()
        logger.debug(f"Generated summary: {summary}")

        # Remove markdown formatting from the summary
        def remove_markdown(text):
            """
            Remove markdown formatting from text.
            """
            # Remove bold formatting (**)
            text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
            # Remove bullet points and dashes
            text = re.sub(r'-\s*', '', text)
            # Remove extra spaces and newlines
            text = re.sub(r'\s+', ' ', text).strip()
            return text

        plain_summary = remove_markdown(summary)
        logger.debug(f"Plain text summary: {plain_summary}")

        # If the target language is not English, translate the follow-up response
        if tgt_lang != "en":
            logger.debug("Translating summary to target language...")
            translated_summary = translate_text(plain_summary, "en", tgt_lang)
            if "Translation Error" in translated_summary:
                logger.error(f"Translation failed: {translated_summary}")
                return jsonify({"message": translated_summary, "status": "error"}), 400
            plain_summary = translated_summary
            logger.debug(f"Translated summary: {plain_summary}")

        # Return the follow-up response in the desired language as plain text
        return jsonify({"response": plain_summary, "status": "success"}), 200

    except Exception as e:
        logger.error(f"Error in followup_text: {e}", exc_info=True)
        return jsonify({"message": f"Error: {str(e)}", "status": "error"}), 500


@app.route("/get_audio", methods=["GET"])
def get_audio():
    """Serve the generated audio file."""
    speech_file = os.path.join(AUDIO_DIR, "translated_audio.mp3")
    if not os.path.exists(speech_file):
        return jsonify({"message": "Audio file not found", "status": "error"}), 404
    return send_file(speech_file, mimetype="audio/mpeg", as_attachment=False)

sentiment_scores = {}
analysis_thread = None
running = False
lock = threading.Lock()

def analyze_webcam_sentiment(duration=30):
    """
    Analyzes sentiment from webcam in real-time and updates sentiment_scores.
    """
    global sentiment_scores, running
    cap = cv2.VideoCapture(0)  # Open webcam
    frame_count = 0
    running = True

    print("Starting real-time sentiment analysis...")

    while frame_count < duration * 10 and running:  # Capture frames for given duration (approx. 10 FPS)
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        try:
            result = DeepFace.analyze(frame_rgb, actions=['emotion'], enforce_detection=False)
            dominant_emotion = result[0]['dominant_emotion']
            
            with lock:
                sentiment_scores[dominant_emotion] = sentiment_scores.get(dominant_emotion, 0) + 1

            cv2.putText(frame, f"Emotion: {dominant_emotion}", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        except:
            pass  # Skip frames where no face is detected

        cv2.imshow("Webcam Sentiment Analysis", frame)
        frame_count += 1

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    running = False


@app.route('/start_analysis', methods=['GET'])
def start_analysis():
    """Starts the webcam sentiment analysis in a separate thread."""
    global sentiment_scores, analysis_thread, running
    if running:
        return jsonify({"message": "Analysis is already running"})

    sentiment_scores = {}  # Reset scores
    analysis_thread = threading.Thread(target=analyze_webcam_sentiment, args=(30,))
    analysis_thread.start()
    return jsonify({"message": "Sentiment analysis started"})


@app.route('/stop_analysis', methods=['GET'])
def stop_analysis():
    """Stops the webcam sentiment analysis."""
    global running
    if not running:
        return jsonify({"message": "No analysis is running"})

    running = False
    return jsonify({"message": "Sentiment analysis stopped"})


@app.route('/get_results', methods=['GET'])
def get_results():
    """Returns the current sentiment analysis results along with an AI-generated summary."""
    global sentiment_scores

    with lock:
        sentiment_data = sentiment_scores.copy()  # Copy to prevent threading issues

    prompt = f"""
    Analyze the following sentiment data and provide a short summary:
    {sentiment_data}
    """

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "system", "content": "You are an expert sentiment analysis summarizer."},
                  {"role": "user", "content": prompt}]
    )

    summary = response.choices[0].message.content

    return jsonify({"sentiment_scores": sentiment_data, "summary": summary})


@app.route("/translate", methods=["POST"])
def translate():
    """API endpoint to translate text from source language to target language."""
    try:
        data = request.get_json()
        src_lang = data.get("src_lang")
        tgt_lang = data.get("tgt_lang")
        text = data.get("text")
        
        if not src_lang or not tgt_lang or not text:
            return jsonify({"message": "Missing required parameters", "status": "error"}), 400
        
        translated_text = translate_text(text, src_lang, tgt_lang)
        
        if "Error" in translated_text:
            return jsonify({"message": translated_text, "status": "error"}), 500
        
        return jsonify({"translated_text": translated_text, "status": "success"}), 200
    
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}", "status": "error"}), 500


if __name__ == '__main__':
    app.run(debug=True)
