
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Clock, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      minute: '2-digit',
      second: '2-digit'
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
      <div className="flex items-start space-x-4 justify-end">
        <div className="flex-1 text-right">
          <div className="bg-primary text-white rounded-lg p-4 shadow-sm inline-block max-w-md">
            <p className="text-sm">{msg.message_text}</p>
          </div>
          <div className="mt-1 text-xs text-gray-400">{formatTime(msg.created_at)}</div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* AI Response */}
      {msg.ai_response && (
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex-shrink-0 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 group">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {msg.ai_response}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-400">{formatTime(msg.created_at)}</div>
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
      )}

      {/* Error Message */}
      {msg.error_message && (
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex-shrink-0 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{msg.error_message}</p>
              <div className="text-xs text-red-600 mt-1">{formatTime(msg.created_at)}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-blue-50/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Container */}
      <div className="flex-1 bg-blue-50/50 p-6 overflow-y-auto chat-container">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length > 0 ? (
            <AnimatePresence>
              {messages.map(renderMessage)}
            </AnimatePresence>
          ) : (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex-shrink-0 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700">
                    Olá! Eu sou o Livi AI, seu assistente especializado em importação e Amazon. Como posso ajudar você hoje?
                  </p>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      {isSessionActive && (
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 flex items-center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={hasCredits ? "Digite sua pergunta sobre importação ou Amazon..." : "Créditos insuficientes"}
                className="bg-transparent border-none outline-none shadow-none focus-visible:ring-0 text-gray-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                disabled={isLoading || !hasCredits}
              />
            </div>
            <Button 
              onClick={onSendMessage} 
              disabled={!message.trim() || isLoading || !hasCredits}
              className="ml-3 bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          {isLoading && (
            <div className="text-xs text-gray-500 mt-2 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              <span>Livi AI está processando sua pergunta...</span>
            </div>
          )}

          {!hasCredits && (
            <div className="text-xs text-red-600 mt-2">
              Créditos insuficientes. Adquira mais créditos para continuar.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
