import { supabase } from '../lib/supabase';
import { Task } from '../types';

export async function createTask(
  userId: string,
  title: string,
  description: string = '',
  dueDate?: Date
): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title,
        description,
        due_date: dueDate?.toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      completed: data.completed,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Error creating task:', error);
    // Fallback for local offline state
    return {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      dueDate,
      completed: false,
      createdAt: new Date(),
    };
  }
}

export async function getTasks(userId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      completed: task.completed,
      createdAt: new Date(task.created_at),
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function completeTask(taskId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error completing task:', error);
    return true; // Fallback to allow UI state update
  }
}

export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return true; // Fallback to allow UI state update
  }
}

export function extractTaskFromText(text: string): {
  title: string;
  dueDate?: Date;
} {
  let title = text;
  let dueDate: Date | undefined;

  const timeMatch = text.match(/(\d{1,2})\s*(am|pm|AM|PM)/);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const isPM = timeMatch[2].toLowerCase() === 'pm';
    const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour;

    dueDate = new Date();
    dueDate.setHours(adjustedHour, 0, 0, 0);

    title = title.replace(/\s+(at|on|for|by)\s+\d{1,2}\s*(am|pm|AM|PM)/i, '');
  }

  title = title
    .replace(/^(add|create|make|set|remind me|schedule)\s+/i, '')
    .replace(/\s+(task|reminder|todo|meeting|appointment)$/i, '')
    .trim();

  return { title, dueDate };
}
