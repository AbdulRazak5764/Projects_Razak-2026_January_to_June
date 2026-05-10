import { Intent, Emotion, UserContext } from '../types';
import { getResponseTone } from './emotionAnalysis';
import OpenAI from 'openai';
import { extractTaskFromText } from '../services/taskService';

export async function generateResponse(
  userInput: string,
  intent: Intent,
  emotion: Emotion,
  context: UserContext
): Promise<string> {
  const tone = getResponseTone(emotion);

  switch (intent) {
    case 'task_create':
      return tone + handleTaskCreation(userInput);
    case 'task_list':
      return tone + 'Let me get your tasks for you.';
    case 'task_complete':
      return tone + 'I will mark that task as completed.';
    case 'explain':
      return tone + await handleExplanation(userInput, emotion);
    case 'clarify':
      return tone + await handleClarification(context);
    default:
      return tone + await handleGeneralQuery(userInput);
  }
}

function handleTaskCreation(input: string): string {
  const extracted = extractTaskFromText(input);
  const timeMatch = input.match(/\d{1,2}\s*(am|pm|AM|PM)/);
  const dateMatch = input.match(/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);

  let response = `I have created the task "${extracted.title}"`;

  if (timeMatch) {
    response += ` for ${timeMatch[0]}`;
  }

  if (dateMatch) {
    response += ` on ${dateMatch[0]}`;
  }

  return response + '.';
}

async function handleExplanation(input: string, emotion: Emotion): Promise<string> {
  const topic = extractTopic(input);
  const prompt = `Explain ${topic || input} in a way that relates to someone feeling ${emotion}. Keep it short, conversational and under 2-3 sentences. You are a voice assistant, do not use asterisks or markdown formatting.`;
  return await fetchAIResponse(prompt);
}

async function handleClarification(context: UserContext): Promise<string> {
  const prompt = `Clarify the topic "${context.lastTopic || 'that we were just discussing'}". Explain it simpler in a conversational, friendly voice under 2 sentences. You are a voice assistant, do not use asterisks or markdown formatting.`;
  return await fetchAIResponse(prompt);
}

async function handleGeneralQuery(input: string): Promise<string> {
  const prompt = `Respond concisely and conversationally to: "${input}". Keep it under 2-3 sentences. You are a voice assistant, do not use asterisks or markdown formatting. Answer the user perfectly.`;
  return await fetchAIResponse(prompt);
}

async function fetchAIResponse(prompt: string): Promise<string> {
  try {
    // Attempt to use Groq API first
    if (import.meta.env.VITE_GROQ_API_KEY && import.meta.env.VITE_GROQ_API_KEY !== 'your_groq_api_key_here') {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a helpful, conversational voice assistant that gives perfect, accurate, and concise answers without markdown.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const text = completion.choices[0]?.message?.content || '';
      return text.replace(/[*_#"`]/g, '').trim();
    }
    
    // Attempt to use OpenAI if Groq key isn't available
    if (import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful, conversational voice assistant that gives perfect, accurate, and concise answers without markdown.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const text = completion.choices[0]?.message?.content || '';
      return text.replace(/[*_#"`]/g, '').trim();
    }

    // Fallback to the original free pollinations prompt proxy
    const response = await fetch('/api/ai/' + encodeURIComponent(prompt));
    
    if (!response.ok) {
      throw new Error(`Proxy fetch failed: ${response.statusText}`);
    }
    
    const text = await response.text();
    // remove markdown characters for voice TTS readability
    return text.replace(/[*_#"`]/g, '').trim(); 
  } catch (error: unknown) {
    console.error('AI API error:', error);
    return `I am having trouble connecting to my brain right now. Please try again in a moment.`;
  }
}

function extractTopic(input: string): string {
  const patterns = [
    /(?:what\s+is|explain|define|describe|tell\s+me\s+about)\s+(\w+)/i,
    /(\w+)\s+(?:concept|algorithm|principle)/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
}
