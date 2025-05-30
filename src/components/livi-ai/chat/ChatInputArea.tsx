
import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  hasCredits: boolean;
  isSessionActive: boolean;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  hasCredits,
  isSessionActive
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  if (!isSessionActive) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasCredits ? "Digite sua pergunta sobre importação ou Amazon..." : "Créditos insuficientes"}
            className={cn(
              "bg-transparent border-0 resize-none shadow-none focus-visible:ring-0 min-h-[24px] max-h-[200px] py-3 px-4 pr-12",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400"
            )}
            disabled={isLoading || !hasCredits}
            rows={1}
          />
          <Button
            onClick={onSendMessage}
            disabled={!message.trim() || isLoading || !hasCredits}
            className={cn(
              "absolute right-2 bottom-2 h-8 w-8 p-0 rounded-lg",
              "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600",
              "transition-all duration-200"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {!hasCredits && (
          <div className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">
            Créditos insuficientes. Adquira mais créditos para continuar.
          </div>
        )}
      </div>
    </div>
  );
};
