
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
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading && hasCredits && isSessionActive) {
        onSendMessage();
      }
    }
  };

  const canSend = message.trim() && !isLoading && hasCredits && isSessionActive;

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-3 sm:p-4 lg:p-6 overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors shadow-sm overflow-hidden">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !isSessionActive 
                ? "Inicie uma sessão para começar a conversar..."
                : !hasCredits 
                ? "Créditos insuficientes"
                : "Digite sua pergunta sobre importação ou Amazon..."
            }
            className={cn(
              "bg-transparent border-0 resize-none shadow-none focus-visible:ring-0 min-h-[40px] max-h-[100px] py-3 px-4 pr-14 w-full",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base",
              "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
              "break-words overflow-wrap-anywhere"
            )}
            disabled={isLoading || !hasCredits || !isSessionActive}
            rows={1}
          />
          <Button
            onClick={onSendMessage}
            disabled={!canSend}
            className={cn(
              "absolute right-3 bottom-3 h-8 w-8 p-0 rounded-lg flex-shrink-0",
              "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600",
              "transition-all duration-200",
              canSend ? "opacity-100" : "opacity-50"
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
        <div className="mt-3 text-center px-2">
          {!isSessionActive && (
            <div className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 break-words">
              Inicie uma sessão para começar a conversar com o Livi AI
            </div>
          )}
          {isSessionActive && !hasCredits && (
            <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 break-words">
              Créditos insuficientes. Adquira mais créditos para continuar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
