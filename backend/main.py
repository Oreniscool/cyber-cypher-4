import os
import whisper
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from transformers import MarianMTModel, MarianTokenizer
from gtts import gTTS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Load Whisper model for transcription
whisper_model = whisper.load_model("base")

# Ensure audio directory exists
AUDIO_DIR = "recordings"
os.makedirs(AUDIO_DIR, exist_ok=True)

def transcribe_audio(filepath):
    """
    Transcribe audio to text using Whisper.
    """
    try:
        result = whisper_model.transcribe(filepath)
        return result["text"]
    except Exception as e:
        return f"Transcription Error: {e}"

def translate_text(text, src_lang, tgt_lang):
    """
    Translate text using free GenAI model (MarianMT).
    """
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
    """
    Convert translated text to speech using gTTS.
    """
    try:
        output_file = os.path.join(AUDIO_DIR, "translated_audio.mp3")
        tts = gTTS(text=text, lang=language)
        tts.save(output_file)
        return output_file
    except Exception as e:
        return None

@app.route("/process", methods=["POST"])
def process():
    """
    Process request: transcribe, translate, generate speech.
    """
    try:
        print("something")
        data = request.get_json()
        filename = data.get("filename")  # Path to audio file
        src_lang = data.get("src_lang")  # Source language
        tgt_lang = data.get("tgt_lang")  # Target language

        print(f"Processing {filename} from {src_lang} to {tgt_lang}")

        # Validate file existence
        if not os.path.exists(filename):
            return jsonify({"message": "File not found", "status": "error"}), 404

        # Transcribe
        transcript = transcribe_audio(filename)
        print(f"Transcription: {transcript}")

        # Translate
        translated_text = translate_text(transcript, src_lang, tgt_lang)
        print(f"Translation: {translated_text}")

        # Convert to speech
        speech_file = text_to_speech(translated_text, tgt_lang)
        if not speech_file:
            return jsonify({"message": "TTS failed", "status": "error"}), 500

        return jsonify({
            "status": "success",
            "transcription": transcript,
            "translated_text": translated_text,
            "speech_url": f"http://127.0.0.1:5000/get_audio"
        })

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}", "status": "error"}), 500

@app.route("/get_audio", methods=["GET"])
def get_audio():
    """
    Serve the translated speech audio.
    """
    return send_file(os.path.join(AUDIO_DIR, "translated_audio.mp3"))

if __name__ == "__main__":
    app.run(debug=True)
