
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Play, Square, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useLiviAISessions } from '@/hooks/useLiviAISessions';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getWebhookUrl } from '@/utils/webhookConfig';
import { SessionHistorySidebar } from '@/components/livi-ai/SessionHistorySidebar';
import { LiviAIChatArea } from '@/components/livi-ai/LiviAIChatArea';

const LiviAI = () => {
  const { user } = useAuth();
  const { creditStatus, consumeCredits, isLoading: creditsLoading, refreshCredits } = useCredits();
  const {
    sessions,
    currentSession,
    sessionMessages,
    loading: sessionsLoading,
    messagesLoading,
    createSession,
    endSession,
    saveMessage,
    selectSession,
    deleteSession,
    renameSession
  } = useLiviAISessions();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se tem créditos suficientes
  const hasCredits = () => {
    return creditStatus?.credits?.current && creditStatus.credits.current > 0;
  };

  // Iniciar nova sessão
  const startSession = async () => {
    if (currentSession?.is_active) {
      toast({
        title: "Sessão ativa",
        description: "Encerre a sessão atual antes de iniciar uma nova.",
        variant: "destructive"
      });
      return;
    }

    if (!hasCredits()) {
      toast({
        title: "Créditos insuficientes",
        description: "Você precisa de créditos para usar o Livi AI. Adquira mais créditos para continuar.",
        variant: "destructive"
      });
      return;
    }

    const defaultMessage = "Nova conversa com Livi AI";
    const session = await createSession(defaultMessage);
    
    if (session) {
      toast({
        title: "Sessão iniciada",
        description: "Nova sessão do Livi AI iniciada com sucesso!"
      });
    }
  };

  // Encerrar sessão atual
  const handleEndSession = async () => {
    if (!currentSession) return;

    await endSession(currentSession.id);
    toast({
      title: "Sessão encerrada",
      description: "Sessão do Livi AI encerrada com sucesso!"
    });
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    if (!hasCredits()) {
      toast({
        title: "Créditos insuficientes",
        description: "Você precisa de créditos para enviar mensagens. Adquira mais créditos para continuar.",
        variant: "destructive"
      });
      return;
    }

    let session = currentSession;

    if (!session?.is_active) {
      session = await createSession(message);
      if (!session) return;
    }

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const creditConsumed = await consumeCredits(1, 'Mensagem Livi AI');
      
      if (!creditConsumed) {
        toast({
          title: "Erro ao consumir créditos",
          description: "Não foi possível consumir os créditos necessários.",
          variant: "destructive"
        });
        return;
      }

      await saveMessage(session.id, userMessage, undefined, 1);

      const webhookUrl = getWebhookUrl();
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensagem: userMessage,
          userId: user.id,
          sessionId: session.id
        })
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        const aiResponse = await response.text();
        await saveMessage(session.id, userMessage, aiResponse || 'Mensagem recebida!', 1, responseTime);
      } else {
        throw new Error('Erro na comunicação com o AI');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      await saveMessage(
        session.id, 
        userMessage, 
        undefined, 
        1, 
        responseTime, 
        'Erro ao processar mensagem. Tente novamente.'
      );

      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar - Responsivo */}
      <div className="hidden lg:block lg:w-80 xl:w-96">
        <SessionHistorySidebar
          sessions={sessions}
          currentSession={currentSession}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          loading={sessionsLoading}
        />
      </div>

      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Responsivo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/20 shadow-sm"
        >
          <div className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Logo e Status */}
              <div className="flex items-center space-x-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <Bot className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Livi AI
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentSession?.is_active ? 'Sessão ativa' : 'Nenhuma sessão ativa'}
                  </p>
                </div>
              </div>

              {/* Créditos e Ações */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center px-4 py-2 rounded-lg shadow-sm ${
                    hasCredits() 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200'
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">
                    {creditsLoading ? '...' : creditStatus?.credits?.current || 0} créditos
                  </span>
                  <Button
                    onClick={refreshCredits}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2 hover:bg-transparent"
                    disabled={creditsLoading}
                  >
                    <RefreshCw className={`h-3 w-3 ${creditsLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </motion.div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={startSession} 
                    disabled={currentSession?.is_active || !hasCredits()}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-none"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Iniciar Sessão</span>
                    <span className="sm:hidden">Iniciar</span>
                  </Button>
                  <Button 
                    onClick={handleEndSession} 
                    disabled={!currentSession?.is_active}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm flex-1 sm:flex-none"
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Encerrar</span>
                    <span className="sm:hidden">Parar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <LiviAIChatArea
          messages={sessionMessages}
          message={message}
          setMessage={setMessage}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          hasCredits={hasCredits()}
          isSessionActive={currentSession?.is_active || false}
          messagesLoading={messagesLoading}
        />
      </div>
    </div>
  );
};

export default LiviAI;
