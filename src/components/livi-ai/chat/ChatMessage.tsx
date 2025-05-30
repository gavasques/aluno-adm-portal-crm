
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiviAIMessage } from '@/hooks/useLiviAISessions';

interface ChatMessageProps {
  message: LiviAIMessage;
  onCopyMessage: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onCopyMessage,
  copiedMessageId
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para tratar respostas que podem vir em formato JSON
  const formatAIResponse = (response: string) => {
    try {
      const parsed = JSON.parse(response);
      if (parsed.data && typeof parsed.data === 'string') {
        return parsed.data;
      }
      return response;
    } catch {
      return response;
    }
  };

  const formattedAIResponse = message.ai_response ? formatAIResponse(message.ai_response) : null;

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      {/* User Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 sm:gap-3 justify-end w-full"
      >
        <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm p-2 sm:p-3 max-w-[85%] sm:max-w-[75%] lg:max-w-md xl:max-w-lg break-words overflow-wrap-anywhere">
          <p className="leading-relaxed text-xs sm:text-sm break-words">{message.message_text}</p>
          <div className="text-xs text-blue-100 mt-1 sm:mt-1.5 flex items-center gap-2 flex-wrap">
            <span>{formatTime(message.created_at)}</span>
            {message.response_time_ms && (
              <span>• {message.response_time_ms}ms</span>
            )}
          </div>
        </div>
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center flex-shrink-0">
          <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
        </div>
      </motion.div>

      {/* AI Response */}
      {formattedAIResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 sm:gap-3 w-full"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-2 sm:p-3 flex-1 group max-w-[85%] sm:max-w-[75%] lg:max-w-none overflow-hidden">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap m-0 text-xs sm:text-sm break-words overflow-wrap-anywhere">
                {formattedAIResponse}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-200 dark:border-gray-700 flex-wrap gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                <span>{formatTime(message.created_at)}</span>
                {message.response_time_ms && (
                  <span className="text-green-600 dark:text-green-400">• {message.response_time_ms}ms</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => onCopyMessage(formattedAIResponse, message.id)}
              >
                {copiedMessageId === message.id ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {message.error_message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 sm:gap-3 w-full"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-sm p-2 sm:p-3 flex-1 max-w-[85%] sm:max-w-[75%] lg:max-w-none overflow-hidden">
            <div className="flex items-start gap-2">
              <div className="flex-1 break-words overflow-wrap-anywhere">
                <p className="text-red-800 dark:text-red-300 font-medium mb-1 text-xs sm:text-sm">Erro no processamento</p>
                <p className="text-xs text-red-700 dark:text-red-400 break-words">{message.error_message}</p>
              </div>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1.5">
              {formatTime(message.created_at)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
