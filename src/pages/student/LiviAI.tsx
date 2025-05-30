
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Play, Square, CreditCard, RefreshCw, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useLiviAISessions } from '@/hooks/useLiviAISessions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

    // Criar sessão com uma mensagem padrão
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

    // Verificar créditos antes de enviar
    if (!hasCredits()) {
      toast({
        title: "Créditos insuficientes",
        description: "Você precisa de créditos para enviar mensagens. Adquira mais créditos para continuar.",
        variant: "destructive"
      });
      return;
    }

    let session = currentSession;

    // Criar nova sessão se não houver uma ativa
    if (!session?.is_active) {
      session = await createSession(message);
      if (!session) return;
    }

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Consumir 1 crédito antes de enviar a mensagem
      const creditConsumed = await consumeCredits(1, 'Mensagem Livi AI');
      
      if (!creditConsumed) {
        toast({
          title: "Erro ao consumir créditos",
          description: "Não foi possível consumir os créditos necessários.",
          variant: "destructive"
        });
        return;
      }

      // Salvar mensagem do usuário primeiro
      await saveMessage(session.id, userMessage, undefined, 1);

      // Usar a URL configurada pelo admin
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
        
        // Atualizar a mensagem com a resposta da IA
        await saveMessage(session.id, userMessage, aiResponse || 'Mensagem recebida!', 1, responseTime);
      } else {
        throw new Error('Erro na comunicação com o AI');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Salvar mensagem com erro
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar do Histórico */}
      <motion.div 
        className="w-80 flex-shrink-0"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SessionHistorySidebar
          sessions={sessions}
          currentSession={currentSession}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          loading={sessionsLoading}
        />
      </motion.div>

      {/* Área Principal do Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div 
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-white/20 p-4 flex-shrink-0"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Livi AI</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentSession?.is_active ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Sessão ativa - {currentSession.session_name}
                    </span>
                  ) : (
                    'Nenhuma sessão ativa'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Display de Créditos */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {creditsLoading ? '...' : creditStatus?.credits?.current || 0} créditos
                </span>
                <Button
                  onClick={refreshCredits}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  disabled={creditsLoading}
                >
                  <RefreshCw className={`h-3 w-3 ${creditsLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* Estatísticas da Sessão */}
              {currentSession && (
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <span>Mensagens:</span>
                    <Badge variant="secondary">{currentSession.total_messages}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Créditos:</span>
                    <Badge variant="secondary">{currentSession.credits_consumed}</Badge>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={startSession} 
                  disabled={currentSession?.is_active || !hasCredits()}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600"
                >
                  <Play className="h-4 w-4" />
                  Nova Sessão
                </Button>
                <Button 
                  onClick={handleEndSession} 
                  disabled={!currentSession?.is_active}
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Encerrar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Área do Chat */}
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
