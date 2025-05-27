
import { useState } from 'react';
import { MentoringSession, StudentMentoringEnrollment } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';
import { CalendlyEventPayload } from '@/types/calendly.types';

interface UsePendingSessionsLogicProps {
  enrollment: StudentMentoringEnrollment;
  allSessions: MentoringSession[];
  onSessionUpdated?: () => void;
}

export const usePendingSessionsLogic = ({ 
  enrollment, 
  allSessions, 
  onSessionUpdated 
}: UsePendingSessionsLogicProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  // Calcular métricas
  const totalSessionsCreated = allSessions.filter(session => session.enrollmentId === enrollment.id).length;
  const canCreateMoreSessions = totalSessionsCreated < enrollment.totalSessions;
  const nextSessionNumber = totalSessionsCreated + 1;

  // Lógica de validação de agendamento
  const canScheduleSession = (sessionNumber: number): boolean => {
    if (sessionNumber === 1) return true;
    
    for (let i = 1; i < sessionNumber; i++) {
      const previousSession = allSessions.find(s => 
        s.enrollmentId === enrollment.id && 
        s.sessionNumber === i
      );
      
      if (!previousSession || 
          (previousSession.status !== 'agendada' && 
           previousSession.status !== 'concluida' && 
           previousSession.status !== 'reagendada')) {
        return false;
      }
    }
    
    return true;
  };

  const hasUnscheduledPreviousSession = (sessionNumber: number): boolean => {
    for (let i = 1; i < sessionNumber; i++) {
      const previousSession = allSessions.find(s => 
        s.enrollmentId === enrollment.id && 
        s.sessionNumber === i
      );
      
      if (!previousSession || previousSession.status === 'aguardando_agendamento') {
        return true;
      }
    }
    return false;
  };

  // Handlers
  const handleCreateSession = (data: any) => {
    const sessionData = {
      ...data,
      sessionNumber: nextSessionNumber,
      title: `Sessão ${nextSessionNumber} - ${enrollment.mentoring.name}`
    };
    
    return sessionData;
  };

  const handleDeleteSession = async (session: MentoringSession, onDeleteSession?: (sessionId: string) => void) => {
    if (onDeleteSession) {
      onDeleteSession(session.id);
      toast({
        title: "Sucesso",
        description: "Sessão removida com sucesso!",
      });
    }
  };

  const handleCalendlyScheduled = (eventData: CalendlyEventPayload) => {
    console.log('📅 Sessão agendada via Calendly:', eventData);
    toast({
      title: "Sucesso",
      description: "Sessão agendada via Calendly com sucesso!",
    });
  };

  const handleCompleteSession = async (session: MentoringSession) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('mentoring_sessions')
        .update({ 
          status: 'concluida',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) {
        console.error('❌ Erro ao concluir sessão:', error);
        toast({
          title: "Erro",
          description: "Erro ao concluir sessão. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Sessão marcada como concluída!",
      });
      
      if (onSessionUpdated) {
        onSessionUpdated();
      }
    } catch (error) {
      console.error('❌ Erro ao concluir sessão:', error);
      toast({
        title: "Erro",
        description: "Erro ao concluir sessão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    showCreateForm,
    setShowCreateForm,
    totalSessionsCreated,
    canCreateMoreSessions,
    nextSessionNumber,
    canScheduleSession,
    hasUnscheduledPreviousSession,
    handleCreateSession,
    handleDeleteSession,
    handleCalendlyScheduled,
    handleCompleteSession
  };
};
