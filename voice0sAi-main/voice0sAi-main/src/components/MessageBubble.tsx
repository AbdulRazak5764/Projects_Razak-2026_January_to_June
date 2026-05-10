import { Message } from '../types';
import { Volume2, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.messageType === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-emerald-500'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </div>

      <div className="flex flex-col gap-1 max-w-[70%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-500 text-white rounded-tr-sm'
              : 'bg-gray-200 text-gray-900 rounded-tl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.message}</p>
        </div>

        <div className="flex items-center gap-2 px-2">
          {message.intent && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {message.intent}
            </span>
          )}
          {message.emotion && message.emotion !== 'neutral' && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {message.emotion}
            </span>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
