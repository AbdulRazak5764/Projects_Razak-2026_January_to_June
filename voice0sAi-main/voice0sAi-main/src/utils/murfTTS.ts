const MURF_API_KEY = import.meta.env.VITE_MURF_API_KEY;

export async function speakWithMurf(text: string): Promise<void> {
  if (!MURF_API_KEY || MURF_API_KEY === 'your_murf_api_key_here') {
    console.warn('Murf API key not configured, using browser TTS as fallback');
    return speakWithBrowserTTS(text);
  }

  try {
    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': MURF_API_KEY,
      },
      body: JSON.stringify({
        voiceId: 'en-US-falcon',
        text: text,
        style: 'conversational',
        rate: 1.0,
        pitch: 1.0,
        sampleRate: 24000,
        format: 'MP3',
      }),
    });

    if (!response.ok) {
      throw new Error('Murf API request failed');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = reject;
      audio.play();
    });
  } catch (error) {
    console.error('Murf TTS error:', error);
    return speakWithBrowserTTS(text);
  }
}

function speakWithBrowserTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.lang.startsWith('en') && voice.name.includes('Female')
    ) || voices.find((voice) => voice.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  window.speechSynthesis.cancel();
}
