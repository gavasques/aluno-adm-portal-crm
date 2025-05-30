
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LiviAIMessage } from '@/hooks/useLiviAISessions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

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
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 max-w-3xl"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 flex-1">
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                  Olá! Eu sou o Livi AI, seu assistente especializado em importação e Amazon. 
                  Como posso ajudar você hoje?
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-4">
                {/* User Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 justify-end"
                >
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm p-4 max-w-xs sm:max-w-md lg:max-w-2xl">
                    <p className="leading-relaxed">{msg.message_text}</p>
                    <div className="text-xs text-blue-100 mt-2 flex items-center gap-2">
                      {formatTime(msg.created_at)}
                      {msg.response_time_ms && (
                        <span>• {msg.response_time_ms}ms</span>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </motion.div>

                {/* AI Response */}
                {msg.ai_response && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4 max-w-3xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 flex-1 group">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap m-0">
                          {msg.ai_response}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          {formatTime(msg.created_at)}
                          {msg.response_time_ms && (
                            <span className="text-green-600 dark:text-green-400">• {msg.response_time_ms}ms</span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(msg.ai_response!, msg.id)}
                        >
                          {copiedMessageId === msg.id ? (
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
                {msg.error_message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4 max-w-3xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-sm p-4 flex-1">
                      <div className="flex items-start gap-2">
                        <div>
                          <p className="text-red-800 dark:text-red-300 font-medium mb-1">Erro no processamento</p>
                          <p className="text-sm text-red-700 dark:text-red-400">{msg.error_message}</p>
                        </div>
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 max-w-3xl"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Livi AI está pensando...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {isSessionActive && (
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
      )}
    </div>
  );
};
