
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
          <p className="text-gray-600 dark:text-gray-400 text-sm">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="w-full min-h-full flex flex-col justify-end">
        {/* Messages Container - Centralized and responsive */}
        <div className="w-full max-w-full px-3 sm:px-4 lg:px-6 py-4 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex justify-center w-full">
              <div className="w-full max-w-2xl">
                <ChatWelcomeMessage />
              </div>
            </div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg) => (
              <div key={msg.id} className="flex justify-center w-full">
                <div className="w-full max-w-3xl">
                  <ChatMessage
                    message={msg}
                    onCopyMessage={onCopyMessage}
                    copiedMessageId={copiedMessageId}
                  />
                </div>
              </div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center w-full">
              <div className="w-full max-w-2xl">
                <ChatLoadingIndicator />
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
