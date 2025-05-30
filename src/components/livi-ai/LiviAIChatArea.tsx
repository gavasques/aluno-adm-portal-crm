
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Clock, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { LiviAIMessage } from '@/hooks/useLiviAISessions';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
      className="space-y-4"
    >
      {/* User Message */}
      <div className="flex justify-end">
        <div className="max-w-[70%] group">
          <div className="bg-violet-500 text-white rounded-2xl px-4 py-3 shadow-lg">
            <p className="text-sm whitespace-pre-wrap">{msg.message_text}</p>
            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(msg.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{msg.credits_used} crédito{msg.credits_used > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Response */}
      {msg.ai_response && (
        <div className="flex justify-start">
          <div className="max-w-[70%] group">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-violet-500 rounded-full mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-white dark:bg-slate-700 rounded-2xl px-4 py-3 shadow-lg border border-gray-200 dark:border-slate-600">
                  <p className="text-sm whitespace-pre-wrap text-gray-900 dark:text-white">
                    {msg.ai_response}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(msg.created_at)}</span>
                      {msg.response_time_ms && (
                        <>
                          <span>•</span>
                          <span>{(msg.response_time_ms / 1000).toFixed(1)}s</span>
                        </>
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
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {msg.error_message && (
        <div className="flex justify-start">
          <div className="max-w-[70%]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500 rounded-full mt-1">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {msg.error_message}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(msg.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.length > 0 ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            <AnimatePresence>
              {messages.map(renderMessage)}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="p-4 bg-violet-100 dark:bg-violet-900/20 rounded-full w-fit mx-auto mb-4">
                <Bot className="h-12 w-12 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Olá! Eu sou a Livi AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isSessionActive 
                  ? "Como posso ajudá-lo hoje? Digite sua mensagem abaixo para começarmos nossa conversa."
                  : "Inicie uma nova sessão para começar nossa conversa."
                }
              </p>
              {!hasCredits && (
                <Badge variant="destructive" className="mb-4">
                  Créditos insuficientes
                </Badge>
              )}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      {isSessionActive && (
        <motion.div 
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-t border-white/20 p-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={hasCredits ? "Digite sua mensagem..." : "Créditos insuficientes"}
                className="pr-12 py-3 text-base rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                disabled={isLoading || !hasCredits}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Button 
                  onClick={onSendMessage} 
                  disabled={!message.trim() || isLoading || !hasCredits}
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg bg-violet-500 hover:bg-violet-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {!hasCredits && (
            <div className="mt-3 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                Créditos insuficientes. Adquira mais créditos para continuar usando a Livi AI.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-500"></div>
              <span>Livi AI está pensando...</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
