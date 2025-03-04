import os
import wave
import pyaudio
import whisper
import threading
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from transformers import MarianMTModel, MarianTokenizer
from gtts import gTTS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load Whisper model for transcription
whisper_model = whisper.load_model("base")

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


@app.route("/get_audio", methods=["GET"])
def get_audio():
    """Serve the generated audio file."""
    speech_file = os.path.join(AUDIO_DIR, "translated_audio.mp3")
    if not os.path.exists(speech_file):
        return jsonify({"message": "Audio file not found", "status": "error"}), 404
    return send_file(speech_file, mimetype="audio/mpeg", as_attachment=False)


if __name__ == "__main__":
    app.run(debug=True)
