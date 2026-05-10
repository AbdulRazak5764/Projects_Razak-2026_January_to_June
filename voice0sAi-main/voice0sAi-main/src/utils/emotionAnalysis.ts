import { Emotion } from '../types';

const emotionKeywords: Record<Emotion, string[]> = {
  confused: [
    "don't understand",
    "didn't get",
    "confused",
    "what do you mean",
    "unclear",
    "lost",
    "hard to follow",
  ],
  curious: [
    "what is",
    "how does",
    "why",
    "tell me more",
    "interesting",
    "want to know",
    "curious",
  ],
  frustrated: [
    "this is difficult",
    "not working",
    "frustrated",
    "annoying",
    "give up",
    "too hard",
  ],
  happy: [
    "great",
    "awesome",
    "perfect",
    "thanks",
    "thank you",
    "excellent",
    "wonderful",
    "love it",
  ],
  neutral: [],
};

export function detectEmotion(text: string): Emotion {
  const normalizedText = text.toLowerCase().trim();

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (emotion === 'neutral') continue;

    for (const keyword of keywords) {
      if (normalizedText.includes(keyword)) {
        return emotion as Emotion;
      }
    }
  }

  return 'neutral';
}

export function getResponseTone(emotion: Emotion): string {
  switch (emotion) {
    case 'confused':
      return 'Let me explain that more clearly. ';
    case 'curious':
      return 'Great question! ';
    case 'frustrated':
      return "I understand this can be challenging. Let's take it step by step. ";
    case 'happy':
      return "I'm glad to help! ";
    default:
      return '';
  }
}
