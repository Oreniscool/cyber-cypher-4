export const processAudioFile = async (srcLang, tgtLang) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ src_lang: srcLang, tgt_lang: tgtLang }),
    });

    if (!response.ok) throw new Error('Failed to process audio');

    const data = await response.json();

    if (!data.audio_url) throw new Error('No audio URL returned');

    return {
      transcript: data.transcript,
      translated: data.translated_text,
      audioUrl: data.audio_url,
    };
  } catch (error) {
    console.error('Error processing audio:', error);
    return null;
  }
};

export const stopAudioRecording = async () => {
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

export const startAudioRecording = async () => {
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
