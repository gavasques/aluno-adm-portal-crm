
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

  // Função aprimorada para tratar respostas que podem vir em formato JSON
  const formatAIResponse = (response: string) => {
    try {
      // Primeiro, tenta fazer parse como JSON
      const parsed = JSON.parse(response);
      
      // Se for um array, pega o primeiro item
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstItem = parsed[0];
        if (firstItem.resposta) {
          return firstItem.resposta;
        }
        if (typeof firstItem === 'string') {
          return firstItem;
        }
      }
      
      // Se for um objeto com a propriedade 'resposta'
      if (parsed.resposta) {
        return parsed.resposta;
      }
      
      // Se for um objeto com a propriedade 'data'
      if (parsed.data && typeof parsed.data === 'string') {
        return parsed.data;
      }
      
      // Se for apenas um texto em JSON
      if (typeof parsed === 'string') {
        return parsed;
      }
      
      // Se não conseguir extrair, retorna a resposta original
      return response;
    } catch {
      // Se não for JSON válido, retorna como está
      return response;
    }
  };

  // Função para processar markdown básico e formatação
  const processMarkdown = (text: string) => {
    // Processar **negrito**
    let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Processar *itálico*
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Processar listas com -
    processed = processed.replace(/^- (.*$)/gim, '• $1');
    
    // Processar quebras de linha duplas como parágrafos
    processed = processed.replace(/\n\n/g, '</p><p>');
    processed = `<p>${processed}</p>`;
    
    // Processar quebras de linha simples
    processed = processed.replace(/\n/g, '<br />');
    
    // Limpar parágrafos vazios
    processed = processed.replace(/<p><\/p>/g, '');
    processed = processed.replace(/<p><br \/><\/p>/g, '');
    
    return processed;
  };

  const formattedAIResponse = message.ai_response ? formatAIResponse(message.ai_response) : null;
  const processedAIResponse = formattedAIResponse ? processMarkdown(formattedAIResponse) : null;

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      {/* User Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 sm:gap-3 justify-end w-full"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm p-3 sm:p-4 max-w-[85%] sm:max-w-[75%] lg:max-w-md xl:max-w-lg break-words overflow-wrap-anywhere shadow-lg">
          <p className="leading-relaxed text-sm sm:text-base break-words">{message.message_text}</p>
          <div className="text-xs text-blue-100 mt-2 flex items-center gap-2 flex-wrap">
            <span>{formatTime(message.created_at)}</span>
            {message.response_time_ms && (
              <span>• {message.response_time_ms}ms</span>
            )}
          </div>
        </div>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      </motion.div>

      {/* AI Response */}
      {processedAIResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 sm:gap-3 w-full"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm p-3 sm:p-4 flex-1 group max-w-[85%] sm:max-w-[75%] lg:max-w-none overflow-hidden shadow-lg">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div 
                className="text-gray-900 dark:text-gray-100 leading-relaxed m-0 text-sm sm:text-base break-words overflow-wrap-anywhere"
                dangerouslySetInnerHTML={{ __html: processedAIResponse }}
              />
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex-wrap gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                <span>{formatTime(message.created_at)}</span>
                {message.response_time_ms && (
                  <span className="text-green-600 dark:text-green-400">• {message.response_time_ms}ms</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onCopyMessage(formattedAIResponse || '', message.id)}
              >
                {copiedMessageId === message.id ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-gray-500" />
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
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-sm p-3 sm:p-4 flex-1 max-w-[85%] sm:max-w-[75%] lg:max-w-none overflow-hidden shadow-lg">
            <div className="flex items-start gap-2">
              <div className="flex-1 break-words overflow-wrap-anywhere">
                <p className="text-red-800 dark:text-red-300 font-medium mb-1 text-sm sm:text-base">Erro no processamento</p>
                <p className="text-sm text-red-700 dark:text-red-400 break-words">{message.error_message}</p>
              </div>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-2">
              {formatTime(message.created_at)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
