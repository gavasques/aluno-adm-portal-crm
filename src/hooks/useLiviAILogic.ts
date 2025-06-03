
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

  // Função para processar e formatar a resposta da IA
  const processAIResponse = (rawResponse: string): string => {
    try {
      // Tenta fazer parse como JSON
      const parsed = JSON.parse(rawResponse);
      
      // Se for um array, pega o primeiro item
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstItem = parsed[0];
        if (firstItem.resposta) {
          return firstItem.resposta;
        }
        if (typeof firstItem === 'string') {
          return firstItem;
        }
        return JSON.stringify(firstItem);
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
      
      // Se for um objeto, converte para string formatada
      return JSON.stringify(parsed, null, 2);
    } catch {
      // Se não for JSON válido, retorna como está
      return rawResponse;
    }
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

      const webhookUrl = getWebhookUrl();
      console.log('🔗 URL do webhook:', webhookUrl);

      const requestPayload = {
        mensagem: userMessage,
        userId: user.id,
        sessionId: session.id
      };
      console.log('📦 Payload da requisição:', requestPayload);

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

      let rawResponse;
      try {
        if (contentType && contentType.includes('application/json')) {
          const jsonResponse = await response.json();
          console.log('📄 Resposta JSON completa:', jsonResponse);
          rawResponse = JSON.stringify(jsonResponse);
        } else {
          rawResponse = await response.text();
          console.log('📄 Resposta em texto:', rawResponse);
        }
      } catch (parseError) {
        console.error('❌ Erro ao processar resposta:', parseError);
        const rawText = await response.text();
        console.log('📄 Texto bruto da resposta:', rawText);
        rawResponse = rawText || 'Resposta recebida mas não foi possível processar o conteúdo.';
      }

      if (!rawResponse || rawResponse.trim() === '') {
        console.warn('⚠️ Resposta vazia do webhook');
        rawResponse = 'Mensagem processada, mas resposta vazia recebida do servidor.';
      }

      // Processar a resposta para extrair o conteúdo formatado
      const aiResponse = processAIResponse(rawResponse);
      console.log('✅ Resposta processada da IA:', aiResponse);

      // Salvar apenas UMA vez - a conversa completa (pergunta + resposta)
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
