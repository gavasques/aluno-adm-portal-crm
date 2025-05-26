
import { useState, useCallback } from 'react';
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  CreateExtensionData,
  CreateSessionData,
  ScheduleSessionData,
  UpdateSessionData 
} from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

// Mock data com sessões
const mockSessions: MentoringSession[] = [
  {
    id: 'session-001',
    enrollmentId: 'enrollment-001',
    sessionNumber: 1,
    type: 'individual',
    title: 'Fundamentos do E-commerce',
    scheduledDate: '2024-02-15T14:00:00.000Z',
    durationMinutes: 60,
    status: 'realizada',
    meetingLink: 'https://meet.google.com/abc-def-ghi',
    recordingLink: 'https://drive.google.com/recording1',
    mentorNotes: 'Ótima participação do aluno. Discutimos os conceitos básicos.',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-02-15T15:00:00.000Z'
  },
  {
    id: 'session-002',
    enrollmentId: 'enrollment-001',
    sessionNumber: 2,
    type: 'individual',
    title: 'Estratégias de Marketing Digital',
    scheduledDate: '2024-02-22T14:00:00.000Z',
    durationMinutes: 60,
    status: 'agendada',
    meetingLink: 'https://meet.google.com/abc-def-ghi',
    calendlyLink: 'https://calendly.com/mentor/session',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'session-003',
    enrollmentId: 'enrollment-001',
    sessionNumber: 3,
    type: 'individual',
    title: 'Análise de Dados e Métricas',
    durationMinutes: 60,
    status: 'aguardando_agendamento',
    calendlyLink: 'https://calendly.com/mentor/session',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'session-004',
    enrollmentId: 'enrollment-001',
    sessionNumber: 4,
    type: 'individual',
    title: 'Otimização de Conversões',
    durationMinutes: 60,
    status: 'aguardando_agendamento',
    calendlyLink: 'https://calendly.com/mentor/session',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'session-005',
    enrollmentId: 'enrollment-002',
    sessionNumber: 1,
    type: 'individual',
    title: 'Introdução ao Dropshipping',
    scheduledDate: '2024-03-01T15:00:00.000Z',
    durationMinutes: 60,
    status: 'agendada',
    meetingLink: 'https://meet.google.com/xyz-123-abc',
    calendlyLink: 'https://calendly.com/mentor/session',
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2024-02-15T10:00:00.000Z'
  }
];

// Mock data existente (catalogs, enrollments)
const mockCatalogs: MentoringCatalog[] = [
  {
    id: 'mentoring-001',
    name: 'E-commerce do Zero ao Pro',
    type: 'Individual',
    instructor: 'João Silva',
    durationWeeks: 12,
    numberOfSessions: 8,
    totalSessions: 8,
    price: 2500,
    description: 'Aprenda a criar e escalar seu e-commerce do zero',
    tags: ['e-commerce', 'vendas', 'marketing'],
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

const mockEnrollments: StudentMentoringEnrollment[] = [
  {
    id: 'enrollment-001',
    studentId: 'student-001',
    mentoringId: 'mentoring-001',
    mentoring: mockCatalogs[0],
    status: 'ativa',
    enrollmentDate: '2024-01-15T00:00:00.000Z',
    startDate: '2024-02-01T00:00:00.000Z',
    endDate: '2024-05-01T00:00:00.000Z',
    sessionsUsed: 1,
    totalSessions: 8,
    responsibleMentor: 'João Silva',
    paymentStatus: 'pago',
    observations: 'Aluno muito dedicado e participativo',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

export const useMentoring = () => {
  const [catalogs] = useState<MentoringCatalog[]>(mockCatalogs);
  const [enrollments] = useState<StudentMentoringEnrollment[]>(mockEnrollments);
  const [sessions, setSessions] = useState<MentoringSession[]>(mockSessions);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Função para criar sessões automaticamente ao criar inscrição
  const createSessionsForEnrollment = useCallback((enrollment: StudentMentoringEnrollment): MentoringSession[] => {
    const newSessions: MentoringSession[] = [];
    
    for (let i = 1; i <= enrollment.totalSessions; i++) {
      const session: MentoringSession = {
        id: `session-${enrollment.id}-${i}`,
        enrollmentId: enrollment.id,
        sessionNumber: i,
        type: enrollment.mentoring.type === 'Individual' ? 'individual' : 'grupo',
        title: `Sessão ${i} - ${enrollment.mentoring.name}`,
        durationMinutes: 60,
        status: 'aguardando_agendamento',
        calendlyLink: 'https://calendly.com/mentor/session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      newSessions.push(session);
    }
    
    return newSessions;
  }, []);

  // Buscar sessões de uma inscrição
  const getEnrollmentSessions = useCallback((enrollmentId: string): MentoringSession[] => {
    return sessions.filter(session => session.enrollmentId === enrollmentId);
  }, [sessions]);

  // Agendar uma sessão
  const scheduleSession = useCallback(async (data: ScheduleSessionData): Promise<boolean> => {
    setLoading(true);
    try {
      setSessions(prev => prev.map(session => 
        session.id === data.sessionId 
          ? {
              ...session,
              scheduledDate: data.scheduledDate,
              meetingLink: data.meetingLink,
              status: 'agendada',
              updatedAt: new Date().toISOString()
            }
          : session
      ));
      
      toast({
        title: "Sucesso",
        description: "Sessão agendada com sucesso!",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao agendar sessão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Atualizar status/dados de uma sessão
  const updateSession = useCallback(async (sessionId: string, data: UpdateSessionData): Promise<boolean> => {
    setLoading(true);
    try {
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...data, updatedAt: new Date().toISOString() }
          : session
      ));
      
      toast({
        title: "Sucesso",
        description: "Sessão atualizada com sucesso!",
      });
      
      return true;
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
  }, [toast]);

  // Criar nova sessão
  const createSession = useCallback(async (data: CreateSessionData): Promise<MentoringSession> => {
    setLoading(true);
    try {
      const newSession: MentoringSession = {
        id: `session-${Date.now()}`,
        enrollmentId: data.enrollmentId,
        sessionNumber: sessions.filter(s => s.enrollmentId === data.enrollmentId).length + 1,
        type: data.type,
        title: data.title,
        scheduledDate: data.scheduledDate,
        durationMinutes: data.durationMinutes,
        status: data.scheduledDate ? 'agendada' : 'aguardando_agendamento',
        meetingLink: data.accessLink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSessions(prev => [...prev, newSession]);
      
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
  }, [sessions, toast]);

  // Progresso de uma inscrição
  const getEnrollmentProgress = useCallback((enrollment: StudentMentoringEnrollment) => {
    const enrollmentSessions = getEnrollmentSessions(enrollment.id);
    const completedSessions = enrollmentSessions.filter(s => s.status === 'realizada').length;
    const totalSessions = enrollmentSessions.length;
    const pendingSessions = enrollmentSessions.filter(s => s.status === 'aguardando_agendamento').length;
    const scheduledSessions = enrollmentSessions.filter(s => s.status === 'agendada').length;
    
    return {
      completedSessions,
      totalSessions,
      pendingSessions,
      scheduledSessions,
      percentage: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
    };
  }, [getEnrollmentSessions]);

  // Extensão de mentoria
  const addExtension = useCallback(async (data: CreateExtensionData): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Adding extension:', data);
      
      toast({
        title: "Sucesso",
        description: "Extensão aplicada com sucesso!",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aplicar extensão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    // Estados
    catalogs,
    enrollments,
    sessions,
    loading,
    
    // Funções de sessões
    getEnrollmentSessions,
    scheduleSession,
    updateSession,
    createSession,
    createSessionsForEnrollment,
    
    // Funções existentes
    getEnrollmentProgress,
    addExtension
  };
};
