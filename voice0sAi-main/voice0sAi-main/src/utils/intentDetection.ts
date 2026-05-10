import { Intent } from '../types';

const intentPatterns: Record<Intent, RegExp[]> = {
  task_create: [
    /\b(add|create|make|set)\s+(a\s+)?(task|reminder|todo|meeting|appointment)\b/i,
    /\b(remind|schedule|plan)\s+me\b/i,
    /\b(add|create)\s+.*\s+(at|on|for|by)\s+\d/i,
  ],
  task_list: [
    /\b(what|show|list|tell|read)\s+(are\s+)?(my\s+)?(tasks|todos|reminders|meetings|schedule)\b/i,
    /\b(what\s+do\s+i\s+have|what's\s+on\s+my\s+schedule)\b/i,
  ],
  task_complete: [
    /\b(complete|done|finish|mark)\s+(the\s+)?(task|todo|reminder)\b/i,
    /\b(completed|finished)\s+.*\b/i,
  ],
  explain: [
    /\b(explain|what\s+is|define|describe|tell\s+me\s+about)\b/i,
    /\b(how\s+does|how\s+do)\b/i,
    /\b(teach|learn|study)\b/i,
  ],
  clarify: [
    /\b(didn't\s+understand|don't\s+get\s+it|confused|what\s+do\s+you\s+mean)\b/i,
    /\b(simplify|simpler|easier|break\s+it\s+down)\b/i,
    /\b(can\s+you\s+explain\s+again|repeat|say\s+that\s+again)\b/i,
  ],
  learning: [
    /\b(explain|teach|learn|study|understand|concept)\b/i,
    /\b(what\s+is|how\s+does|why\s+does)\b/i,
  ],
  productivity: [
    /\b(task|todo|reminder|schedule|meeting|plan|organize)\b/i,
  ],
  general: [],
};

export function detectIntent(text: string): Intent {
  const normalizedText = text.toLowerCase().trim();

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (intent === 'general') continue;

    for (const pattern of patterns) {
      if (pattern.test(normalizedText)) {
        return intent as Intent;
      }
    }
  }

  return 'general';
}

export function getIntentCategory(intent: Intent): 'productivity' | 'learning' | 'general' {
  if (['task_create', 'task_list', 'task_complete'].includes(intent)) {
    return 'productivity';
  }
  if (['explain', 'clarify'].includes(intent)) {
    return 'learning';
  }
  return 'general';
}
