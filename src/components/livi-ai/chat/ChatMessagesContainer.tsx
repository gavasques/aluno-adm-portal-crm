
import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { LiviAIMessage } from '@/hooks/useLiviAISessions';
import { ChatWelcomeMessage } from './ChatWelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { ChatLoadingIndicator } from './ChatLoadingIndicator';

interface ChatMessagesContainerProps {
  messages: LiviAIMessage[];
  isLoading: boolean;
  messagesLoading: boolean;
  onCopyMessage: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
}

export const ChatMessagesContainer: React.FC<ChatMessagesContainerProps> = ({
  messages,
  isLoading,
  messagesLoading,
  onCopyMessage,
  copiedMessageId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-2 py-2 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-end">
        {/* Messages Container */}
        <div className="space-y-3 mb-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <ChatWelcomeMessage />
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onCopyMessage={onCopyMessage}
                copiedMessageId={copiedMessageId}
              />
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && <ChatLoadingIndicator />}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
