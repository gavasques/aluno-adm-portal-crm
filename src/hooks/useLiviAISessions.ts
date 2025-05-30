
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface LiviAISession {
  id: string;
  user_id: string;
  session_name: string;
  started_at: string;
  ended_at?: string;
  is_active: boolean;
  total_messages: number;
  credits_consumed: number;
  session_duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface LiviAIMessage {
  id: string;
  session_id: string;
  user_id: string;
  message_text: string;
  ai_response?: string;
  message_order: number;
  credits_used: number;
  response_time_ms?: number;
  error_message?: string;
  created_at: string;
}

export const useLiviAISessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiviAISession[]>([]);
  const [currentSession, setCurrentSession] = useState<LiviAISession | null>(null);
  const [sessionMessages, setSessionMessages] = useState<LiviAIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Carregar sessões do usuário
  const loadSessions = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('livi_ai_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      toast.error('Erro ao carregar histórico de sessões');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova sessão
  const createSession = async (firstMessage: string): Promise<LiviAISession | null> => {
    if (!user?.id) return null;

    try {
      // Encerrar sessão ativa anterior
      if (currentSession?.is_active) {
        await endSession(currentSession.id);
      }

      const sessionName = firstMessage.length > 50 
        ? firstMessage.substring(0, 47) + '...' 
        : firstMessage;

      const { data, error } = await supabase
        .from('livi_ai_sessions')
        .insert({
          user_id: user.id,
          session_name: sessionName,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      const newSession = data as LiviAISession;
      setCurrentSession(newSession);
      setSessions(prev => [newSession, ...prev]);

      // Log da criação da sessão
      await logSessionAction(newSession.id, 'session_started', {
        session_name: sessionName
      });

      return newSession;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      toast.error('Erro ao criar nova sessão');
      return null;
    }
  };

  // Encerrar sessão
  const endSession = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      const startTime = new Date(session.started_at);
      const endTime = new Date();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('livi_ai_sessions')
        .update({
          ended_at: endTime.toISOString(),
          is_active: false,
          session_duration_minutes: durationMinutes
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Atualizar estado local
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, ended_at: endTime.toISOString(), is_active: false, session_duration_minutes: durationMinutes }
          : s
      ));

      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setSessionMessages([]);
      }

      // Log do encerramento
      await logSessionAction(sessionId, 'session_ended', {
        duration_minutes: durationMinutes
      });

    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  // Salvar mensagem no banco
  const saveMessage = async (
    sessionId: string,
    messageText: string,
    aiResponse?: string,
    creditsUsed: number = 1,
    responseTimeMs?: number,
    errorMessage?: string
  ): Promise<LiviAIMessage | null> => {
    if (!user?.id) return null;

    try {
      const messageOrder = sessionMessages.length + 1;

      const { data, error } = await supabase
        .from('livi_ai_messages')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          message_text: messageText,
          ai_response: aiResponse,
          message_order: messageOrder,
          credits_used: creditsUsed,
          response_time_ms: responseTimeMs,
          error_message: errorMessage
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage = data as LiviAIMessage;
      setSessionMessages(prev => [...prev, newMessage]);

      // Atualizar contadores da sessão
      await supabase
        .from('livi_ai_sessions')
        .update({
          total_messages: messageOrder,
          credits_consumed: supabase.sql`credits_consumed + ${creditsUsed}`
        })
        .eq('id', sessionId);

      // Atualizar estado local da sessão
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, total_messages: messageOrder, credits_consumed: s.credits_consumed + creditsUsed }
          : s
      ));

      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? {
          ...prev,
          total_messages: messageOrder,
          credits_consumed: prev.credits_consumed + creditsUsed
        } : null);
      }

      return newMessage;
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      toast.error('Erro ao salvar mensagem');
      return null;
    }
  };

  // Carregar mensagens de uma sessão
  const loadSessionMessages = async (sessionId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('livi_ai_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('message_order', { ascending: true });

      if (error) throw error;
      setSessionMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setMessagesLoading(false);
    }
  };

  // Selecionar sessão
  const selectSession = async (session: LiviAISession) => {
    setCurrentSession(session);
    await loadSessionMessages(session.id);
  };

  // Log de ações da sessão
  const logSessionAction = async (sessionId: string, actionType: string, actionData: any = {}) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('livi_ai_session_logs')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          action_type: actionType,
          action_data: actionData
        });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  };

  // Deletar sessão
  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('livi_ai_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setSessionMessages([]);
      }

      toast.success('Sessão deletada com sucesso');
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      toast.error('Erro ao deletar sessão');
    }
  };

  // Renomear sessão
  const renameSession = async (sessionId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('livi_ai_sessions')
        .update({ session_name: newName })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, session_name: newName } : s
      ));

      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, session_name: newName } : null);
      }

      toast.success('Sessão renomeada com sucesso');
    } catch (error) {
      console.error('Erro ao renomear sessão:', error);
      toast.error('Erro ao renomear sessão');
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user?.id]);

  return {
    sessions,
    currentSession,
    sessionMessages,
    loading,
    messagesLoading,
    createSession,
    endSession,
    saveMessage,
    selectSession,
    deleteSession,
    renameSession,
    loadSessions,
    logSessionAction
  };
};
