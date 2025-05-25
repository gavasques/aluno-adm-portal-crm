
import { useState, useCallback } from 'react';
import { MentoringSession, CreateSessionData, UpdateSessionData } from '@/types/mentoring.types';
import { MentoringDataService } from '@/services/mentoring/MentoringDataService';
import { useToast } from '@/hooks/use-toast';

const dataService = new MentoringDataService();

export const useMentoringSessions = () => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshSessions = useCallback(() => {
    setSessions([...dataService.getSessions()]);
  }, []);

  const getEnrollmentSessions = useCallback((enrollmentId: string): MentoringSession[] => {
    return dataService.getEnrollmentSessions(enrollmentId);
  }, []);

  const getSessionDetails = useCallback((sessionId: string): MentoringSession | undefined => {
    return dataService.getSessionById(sessionId);
  }, []);

  const getUpcomingSessions = useCallback((studentId: string): MentoringSession[] => {
    return dataService.getUpcomingSessions(studentId);
  }, []);

  const createSession = useCallback(async (data: CreateSessionData): Promise<MentoringSession> => {
    setLoading(true);
    try {
      const newSession = dataService.createSession(data);
      refreshSessions();
      
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

  return {
    sessions,
    loading,
    getEnrollmentSessions,
    getSessionDetails,
    getUpcomingSessions,
    createSession,
    refreshSessions
  };
};
