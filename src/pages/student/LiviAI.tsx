
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar do Histórico */}
      <SessionHistorySidebar
        sessions={sessions}
        currentSession={currentSession}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        loading={sessionsLoading}
      />

      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Livi AI</h2>
              <p className="text-gray-500 text-sm">
                {currentSession?.is_active ? 'Sessão ativa' : 'Nenhuma sessão ativa'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              hasCredits() ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              <CreditCard className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {creditsLoading ? '...' : creditStatus?.credits?.current || 0} créditos
              </span>
              <Button
                onClick={refreshCredits}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-2"
                disabled={creditsLoading}
              >
                <RefreshCw className={`h-3 w-3 ${creditsLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <Button 
              onClick={startSession} 
              disabled={currentSession?.is_active || !hasCredits()}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center whitespace-nowrap"
            >
              <Play className="h-5 w-5 mr-2" />
              Iniciar Sessão
            </Button>
            <Button 
              onClick={handleEndSession} 
              disabled={!currentSession?.is_active}
              variant="destructive"
              className="bg-red-200 text-red-600 px-6 py-2 rounded-lg flex items-center whitespace-nowrap hover:bg-red-300"
            >
              <Square className="h-5 w-5 mr-2" />
              Encerrar Sessão
            </Button>
          </div>
        </div>

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
