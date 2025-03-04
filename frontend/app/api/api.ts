export const processAudio = async (srcLang, tgtLang) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src_lang: srcLang, // e.g., "en"
        tgt_lang: tgtLang, // e.g., "hi"
      }),
    });

    if (!response.ok) throw new Error('Failed to process audio');

    // Create a download link for the translated speech
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated_audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error processing audio:', error);
  }
};

export const stopRecording = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/stop_recording', {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error stopping recording:', error);
  }
};

export const startRecording = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/start_recording', {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error starting recording:', error);
  }
};
