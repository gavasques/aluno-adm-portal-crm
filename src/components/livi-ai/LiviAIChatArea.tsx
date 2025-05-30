import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Clock, AlertCircle, Copy, CheckCircle, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LiviAIMessage } from '@/hooks/useLiviAISessions';
import { toast } from 'sonner';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast.success('Texto copiado para a área de transferência');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar texto');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (msg: LiviAIMessage) => (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2 px-3 lg:px-4"
    >
      {/* User Message */}
      <div className="flex items-start space-x-2 justify-end">
        <div className="flex-1 text-right">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md p-2.5 shadow-lg inline-block max-w-xs sm:max-w-md lg:max-w-lg"
          >
            <p className="text-sm leading-relaxed">{msg.message_text}</p>
          </motion.div>
          <div className="mt-1 text-xs text-gray-400 flex items-center justify-end gap-1">
            {formatTime(msg.created_at)}
            {msg.response_time_ms && (
              <span className="text-blue-500">• {msg.response_time_ms}ms</span>
            )}
          </div>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-md"
        >
          <User className="h-3 w-3 text-white" />
        </motion.div>
      </div>

      {/* AI Response */}
      {msg.ai_response && (
        <div className="flex items-start space-x-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex-shrink-0 flex items-center justify-center shadow-md"
          >
            <Bot className="h-3 w-3 text-white" />
          </motion.div>
          <div className="flex-1">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl rounded-tl-md p-2.5 shadow-lg border border-white/20 dark:border-slate-700/20 group max-w-xs sm:max-w-md lg:max-w-lg"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {msg.ai_response}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  {formatTime(msg.created_at)}
                  {msg.response_time_ms && (
                    <span className="text-green-500">• {msg.response_time_ms}ms</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={() => copyToClipboard(msg.ai_response!, msg.id)}
                >
                  {copiedMessageId === msg.id ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {msg.error_message && (
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center shadow-md">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-md p-2.5 max-w-xs sm:max-w-md lg:max-w-lg">
              <div className="flex items-start gap-2">
                <Bug className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-1">Erro no processamento</p>
                  <p className="text-xs text-red-700 dark:text-red-400">{msg.error_message}</p>
                </div>
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1">
                {formatTime(msg.created_at)}
                {msg.response_time_ms && (
                  <span>• {msg.response_time_ms}ms</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (messagesLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Carregando mensagens...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-h-full">
      {/* Chat Container - Flex-1 para ocupar espaço disponível com scroll */}
      <div className="flex-1 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-slate-800/30 dark:to-slate-900/30 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-3 space-y-3">
          {messages.length > 0 ? (
            <AnimatePresence>
              {messages.map(renderMessage)}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-2 px-3 lg:px-4"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex-shrink-0 flex items-center justify-center shadow-md">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl rounded-tl-md p-2.5 shadow-lg border border-white/20 dark:border-slate-700/20 max-w-xs sm:max-w-md lg:max-w-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Olá! Eu sou o Livi AI, seu assistente especializado em importação e Amazon. Como posso ajudar você hoje?
                  </p>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Altura reduzida e mais compacta */}
      {isSessionActive && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-white/20 dark:border-slate-700/20 p-2 flex-shrink-0"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-600/20 shadow-sm">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={hasCredits ? "Digite sua pergunta sobre importação ou Amazon..." : "Créditos insuficientes"}
                  className="bg-transparent border-none outline-none shadow-none focus-visible:ring-0 text-gray-700 dark:text-gray-300 p-2.5 text-sm rounded-xl resize-none min-h-[36px] max-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSendMessage();
                    }
                  }}
                  disabled={isLoading || !hasCredits}
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={onSendMessage} 
                  disabled={!message.trim() || isLoading || !hasCredits}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[36px] h-[36px]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center"
              >
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent mr-2"></div>
                <span>Livi AI está processando sua pergunta...</span>
              </motion.div>
            )}

            {!hasCredits && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-600 dark:text-red-400 mt-1.5"
              >
                Créditos insuficientes. Adquira mais créditos para continuar.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
