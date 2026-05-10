import { supabase } from '../lib/supabase';
import { Message, UserContext } from '../types';

export async function saveMessage(
  userId: string,
  message: string,
  messageType: 'user' | 'assistant',
  intent?: string,
  emotion?: string
): Promise<void> {
  try {
    await supabase.from('conversations').insert({
      user_id: userId,
      message,
      message_type: messageType,
      intent,
      emotion,
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

export async function getConversationHistory(
  userId: string,
  limit: number = 20
): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || [])
      .map((msg) => ({
        id: msg.id,
        message: msg.message,
        messageType: msg.message_type,
        intent: msg.intent,
        emotion: msg.emotion,
        timestamp: new Date(msg.timestamp),
      }))
      .reverse();
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
}

export async function updateUserContext(
  userId: string,
  context: Partial<UserContext>
): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from('user_context')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_context')
        .update({
          last_intent: context.lastIntent,
          last_topic: context.lastTopic,
          conversation_context: context.conversationContext || existing.conversation_context,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } else {
      await supabase.from('user_context').insert({
        user_id: userId,
        last_intent: context.lastIntent,
        last_topic: context.lastTopic,
        conversation_context: context.conversationContext || {},
      });
    }
  } catch (error) {
    console.error('Error updating user context:', error);
  }
}

export async function getUserContext(userId: string): Promise<UserContext> {
  try {
    const { data } = await supabase
      .from('user_context')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      return {
        lastIntent: data.last_intent,
        lastTopic: data.last_topic,
        conversationContext: data.conversation_context,
      };
    }
  } catch (error) {
    console.error('Error fetching user context:', error);
  }

  return {
    conversationContext: {},
  };
}
