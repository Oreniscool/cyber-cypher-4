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

export async function fetchEvents(language?: string): Promise<Event[]> {
  try {
    const url = new URL(`http://127.0.0.1:5000/events`);
    if (language) {
      url.searchParams.append('lang', language);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}
export async function createEventFromPrompt(
  prompt: string,
  language: string = 'hi'
): Promise<Event> {
  try {
    const response = await fetch(`http://127.0.0.1:5000/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        lang: language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create event');
    }

    const data = await response.json();
    return {
      id: Date.now(), // Temporary ID generation
      title: data.event.title,
      client: data.event.original_title,
      date: new Date(data.event.start_time),
      location: '',
      language: data.event.original_lang,
      avatar: '/placeholder.svg?height=40&width=40',
      attendees: 1,
      type: 'appointment',
      status: 'pending',
      notes: `Original Language: ${data.event.original_lang}`,
    };
  } catch (error) {
    console.error('Error creating event from prompt:', error);
    throw error;
  }
}
