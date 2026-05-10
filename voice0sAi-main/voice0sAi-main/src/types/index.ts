export interface Message {
  id: string;
  message: string;
  messageType: 'user' | 'assistant';
  intent?: string;
  emotion?: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface UserContext {
  lastIntent?: string;
  lastTopic?: string;
  conversationContext: Record<string, unknown>;
}

export type Intent =
  | 'productivity'
  | 'learning'
  | 'general'
  | 'task_create'
  | 'task_list'
  | 'task_complete'
  | 'explain'
  | 'clarify';

export type Emotion =
  | 'neutral'
  | 'confused'
  | 'curious'
  | 'frustrated'
  | 'happy';
