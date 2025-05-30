
import React from 'react';
import { LiviAIMessage } from '@/hooks/useLiviAISessions';
import { toast } from 'sonner';
import { ChatMessagesContainer } from './chat/ChatMessagesContainer';
import { ChatInputArea } from './chat/ChatInputArea';

interface LiviAIChatAreaProps {
  messages: LiviAIMessage[];
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  hasCredits: boolean;
  isSessionActive: boolean;
  messagesLoading: boolean;
}

export const LiviAIChatArea: React.FC<LiviAIChatAreaProps> = ({
  messages,
  message,
  setMessage,
  onSendMessage,
  isLoading,
  hasCredits,
  isSessionActive,
  messagesLoading
}) => {
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast.success('Texto copiado!');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar texto');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Chat Messages Area - flex-1 para ocupar espaço disponível */}
      <div className="flex-1 overflow-hidden">
        <ChatMessagesContainer
          messages={messages}
          isLoading={isLoading}
          messagesLoading={messagesLoading}
          onCopyMessage={copyToClipboard}
          copiedMessageId={copiedMessageId}
        />
      </div>

      {/* Input Area - fixo na parte inferior */}
      <div className="flex-shrink-0">
        <ChatInputArea
          message={message}
          setMessage={setMessage}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          hasCredits={hasCredits}
          isSessionActive={isSessionActive}
        />
      </div>
    </div>
  );
};
