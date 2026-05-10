import { Task } from '../types';
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onCompleteTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks yet. Try saying "Add a task for 6 PM"</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
            task.completed
              ? 'bg-gray-50 border-gray-200 opacity-60'
              : 'bg-white border-gray-300 hover:border-blue-400'
          }`}
        >
          <button
            onClick={() => onCompleteTask(task.id)}
            className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            disabled={task.completed}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  {task.dueDate.toLocaleDateString()} at{' '}
                  {task.dueDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onDeleteTask(task.id)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
