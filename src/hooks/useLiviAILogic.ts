
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useLiviAISessions } from '@/hooks/useLiviAISessions';
import { toast } from 'sonner';
import { getWebhookUrl } from '@/utils/webhookConfig';

export const useLiviAILogic = () => {
  const { user } = useAuth();
  const { creditStatus, consumeCredits } = useCredits();
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
      toast.error("Encerre a sessão atual antes de iniciar uma nova.");
      return;
    }

    if (!hasCredits()) {
      toast.error("Você precisa de créditos para usar o Livi AI. Adquira mais créditos para continuar.");
      return;
    }

    const defaultMessage = "Nova conversa com Livi AI";
    const session = await createSession(defaultMessage);
    
    if (session) {
      toast.success("Nova sessão do Livi AI iniciada com sucesso!");
    }
  };

  // Encerrar sessão atual
  const handleEndSession = async () => {
    if (!currentSession) return;

    await endSession(currentSession.id);
    toast.success("Sessão do Livi AI encerrada com sucesso!");
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    if (!hasCredits()) {
      toast.error("Você precisa de créditos para enviar mensagens. Adquira mais créditos para continuar.");
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
      console.log('🚀 Iniciando processo de envio de mensagem...');
      console.log('📤 Mensagem do usuário:', userMessage);
      console.log('🔑 ID da sessão:', session.id);
      console.log('👤 ID do usuário:', user.id);

      const creditConsumed = await consumeCredits(1, 'Mensagem Livi AI');
      
      if (!creditConsumed) {
        toast.error("Não foi possível consumir os créditos necessários.");
        return;
      }

      console.log('✅ Créditos consumidos com sucesso');

      await saveMessage(session.id, userMessage, undefined, 1);
      console.log('💾 Mensagem salva no banco de dados');

      const webhookUrl = getWebhookUrl();
      console.log('🔗 URL do webhook:', webhookUrl);

      const requestPayload = {
        mensagem: userMessage,
        userId: user.id,
        sessionId: session.id
      };
      console.log('📦 Payload da requisição:', requestPayload);

      toast.info(`Debug: Enviando para webhook ${webhookUrl.substring(0, 50)}...`);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('📊 Status da resposta:', response.status);
      console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log('⏱️ Tempo de resposta:', responseTime, 'ms');

      if (!response.ok) {
        console.error('❌ Erro HTTP:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('📝 Tipo de conteúdo:', contentType);

      let aiResponse;
      try {
        if (contentType && contentType.includes('application/json')) {
          const jsonResponse = await response.json();
          console.log('📄 Resposta JSON completa:', jsonResponse);
          aiResponse = jsonResponse.response || jsonResponse.message || jsonResponse.reply || JSON.stringify(jsonResponse);
        } else {
          aiResponse = await response.text();
          console.log('📄 Resposta em texto:', aiResponse);
        }
      } catch (parseError) {
        console.error('❌ Erro ao processar resposta:', parseError);
        const rawText = await response.text();
        console.log('📄 Texto bruto da resposta:', rawText);
        aiResponse = rawText || 'Resposta recebida mas não foi possível processar o conteúdo.';
      }

      if (!aiResponse || aiResponse.trim() === '') {
        console.warn('⚠️ Resposta vazia do webhook');
        aiResponse = 'Mensagem processada, mas resposta vazia recebida do servidor.';
      }

      console.log('✅ Resposta final da IA:', aiResponse);

      await saveMessage(session.id, userMessage, aiResponse, 1, responseTime);

      toast.success("Resposta recebida com sucesso!");

    } catch (error) {
      console.error('❌ Erro detalhado:', error);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let errorMessage = 'Erro desconhecido ao processar mensagem.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Erro de conectividade. Verifique sua conexão com a internet.';
      } else if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
      }

      console.log('💾 Salvando mensagem com erro:', errorMessage);
      
      await saveMessage(
        session.id, 
        userMessage, 
        undefined, 
        1, 
        responseTime, 
        errorMessage
      );

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Processo de envio finalizado');
    }
  };

  return {
    // Estados
    sessions,
    currentSession,
    sessionMessages,
    message,
    setMessage,
    isLoading,
    sessionsLoading,
    messagesLoading,
    
    // Funções
    startSession,
    handleEndSession,
    sendMessage,
    selectSession,
    deleteSession,
    renameSession,
    hasCredits: hasCredits()
  };
};
