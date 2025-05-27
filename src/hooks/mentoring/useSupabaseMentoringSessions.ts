import { useState, useCallback } from 'react';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { MentoringSession, CreateSessionData, UpdateSessionData } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseMentoringSessions = () => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const repository = new SupabaseMentoringRepository();

  const refreshSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error refreshing sessions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar sessões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getEnrollmentSessions = useCallback(async (enrollmentId: string): Promise<MentoringSession[]> => {
    try {
      return await repository.getEnrollmentSessions(enrollmentId);
    } catch (error) {
      console.error('Error getting enrollment sessions:', error);
      return [];
    }
  }, []);

  const createSession = useCallback(async (data: CreateSessionData): Promise<MentoringSession> => {
    try {
      setLoading(true);
      const newSession = await repository.createSession(data);
      await refreshSessions();
      toast({
        title: "Sucesso",
        description: "Sessão criada com sucesso!",
      });
      return newSession;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar sessão. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshSessions, toast]);

  const updateSession = useCallback(async (sessionId: string, data: UpdateSessionData): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await repository.updateSession(sessionId, data);
      if (success) {
        await refreshSessions();
        toast({
          title: "Sucesso",
          description: "Sessão atualizada com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar sessão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSessions, toast]);

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await repository.deleteSession(sessionId);
      if (success) {
        await refreshSessions();
        toast({
          title: "Sucesso",
          description: "Sessão removida com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover sessão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSessions, toast]);

  const getSessionsByEnrollment = useCallback((enrollmentId: string): MentoringSession[] => {
    return sessions.filter(session => session.enrollmentId === enrollmentId);
  }, [sessions]);

  return {
    sessions,
    loading,
    getEnrollmentSessions,
    createSession,
    updateSession,
    deleteSession,
    getSessionsByEnrollment,
    refreshSessions,
    repository
  };
};
