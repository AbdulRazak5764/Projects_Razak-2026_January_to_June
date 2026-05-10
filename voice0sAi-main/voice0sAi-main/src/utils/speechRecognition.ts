interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

let recognition: SpeechRecognition | null = null;

export function initializeSpeechRecognition(): SpeechRecognition | null {
  const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) {
    console.error('Speech recognition not supported');
    return null;
  }

  if (!recognition) {
    recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  return recognition;
}

export function startListening(
  onResult: (text: string) => void,
  onError?: (error: string) => void
): void {
  const rec = initializeSpeechRecognition();

  if (!rec) {
    onError?.('Speech recognition not supported in this browser');
    return;
  }

  rec.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    onResult(transcript);
  };

  rec.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    onError?.(event.error);
  };

  rec.onend = () => {
    console.log('Speech recognition ended');
  };

  try {
    rec.start();
  } catch (error) {
    console.error('Error starting recognition:', error);
    onError?.('Failed to start speech recognition');
  }
}

export function stopListening(): void {
  if (recognition) {
    recognition.stop();
  }
}
