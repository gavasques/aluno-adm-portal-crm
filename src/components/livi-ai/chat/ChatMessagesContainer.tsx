
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
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Message */}
        {messages.length === 0 && <ChatWelcomeMessage />}

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

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
