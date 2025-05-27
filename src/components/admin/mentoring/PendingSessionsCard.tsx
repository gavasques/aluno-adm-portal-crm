
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, ExternalLink, Clock, Lock, Settings, Plus } from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { CalendlyWidget } from '@/components/calendly/CalendlyWidget';
import CreatePendingSessionForm from './CreatePendingSessionForm';
import { CalendlyIndicator } from './CalendlyIndicator';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { SessionCard } from './sessions/SessionCard';
import { SessionsInfoCard } from './sessions/SessionsInfoCard';
import { usePendingSessionsLogic } from './sessions/usePendingSessionsLogic';

interface PendingSessionsCardProps {
  enrollment: StudentMentoringEnrollment;
  pendingSessions: MentoringSession[];
  onCreateSession: (data: any) => void;
  onSessionScheduled: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  isLoading?: boolean;
  allSessions?: MentoringSession[];
  onSessionUpdated?: () => void;
}

const PendingSessionsCard = ({ 
  enrollment, 
  pendingSessions, 
  onCreateSession, 
  onSessionScheduled,
  onDeleteSession,
  isLoading,
  allSessions = [],
  onSessionUpdated
}: PendingSessionsCardProps) => {
  const { students } = useStudentsForEnrollment();
  const { mentors } = useMentorsForEnrollment();

  const {
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
  } = usePendingSessionsLogic({ enrollment, allSessions, onSessionUpdated });

  // Buscar informações do estudante e mentor
  const student = students?.find(s => s.id === enrollment.studentId);
  const studentName = student?.name || student?.email || 'Aluno';

  const mentor = mentors?.find(m => m.id === enrollment.responsibleMentor);
  const mentorName = mentor?.name || 'Mentor não encontrado';
  const mentorId = mentor?.id || enrollment.responsibleMentor;

  const sortedPendingSessions = [...pendingSessions].sort((a, b) => a.sessionNumber - b.sessionNumber);

  const handleCreateSessionSubmit = (data: any) => {
    const sessionData = handleCreateSession(data);
    onCreateSession(sessionData);
    setShowCreateForm(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Info sobre limite de sessões */}
        <SessionsInfoCard
          totalSessions={enrollment.totalSessions}
          totalSessionsCreated={totalSessionsCreated}
          canCreateMoreSessions={canCreateMoreSessions}
          nextSessionNumber={nextSessionNumber}
          onCreateSession={() => setShowCreateForm(true)}
        />

        {/* Info do mentor e Calendly */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <span className="font-medium text-amber-900">Mentor: {mentorName}</span>
                <div className="mt-1">
                  <CalendlyIndicator 
                    mentorId={mentorId}
                    showConfigButton={false}
                  />
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-100 rounded-lg"
              onClick={() => window.open('/admin/calendly-config', '_blank')}
            >
              <Settings className="h-3 w-3 mr-1" />
              Configurar
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Aviso sobre agendamento sequencial */}
        {sortedPendingSessions.length > 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Lock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-900 text-sm">Agendamento Sequencial</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  As sessões devem ser agendadas em ordem. Você só pode agendar uma sessão se todas as anteriores já estiverem agendadas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de sessões */}
        {sortedPendingSessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-3">Nenhuma sessão aguardando agendamento</p>
            {canCreateMoreSessions && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(true)}
                className="rounded-lg border-gray-300 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Sessão
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPendingSessions.map((session) => {
              const canSchedule = canScheduleSession(session.sessionNumber);
              const hasUnscheduledPrevious = hasUnscheduledPreviousSession(session.sessionNumber);
              const isScheduled = session.status === 'agendada';
              
              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  canSchedule={canSchedule}
                  isScheduled={isScheduled}
                  hasUnscheduledPrevious={hasUnscheduledPrevious}
                  onSchedule={() => {
                    // O CalendlyWidget será renderizado via SessionCard
                  }}
                  onComplete={handleCompleteSession}
                  onDelete={onDeleteSession ? (session) => handleDeleteSession(session, onDeleteSession) : undefined}
                />
              );
            })}
            
            {canCreateMoreSessions && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(true)}
                className="w-full mt-4 rounded-lg border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Mais Sessões ({totalSessionsCreated}/{enrollment.totalSessions})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog para criar nova sessão */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Nova Sessão Pendente</DialogTitle>
            <p className="text-sm text-gray-600">
              Sessão {nextSessionNumber} de {enrollment.totalSessions}
            </p>
          </DialogHeader>
          <CreatePendingSessionForm
            enrollment={enrollment}
            onSubmit={handleCreateSessionSubmit}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isLoading}
            sessionNumber={nextSessionNumber}
          />
        </DialogContent>
      </Dialog>

      {/* CalendlyWidget para cada sessão que pode ser agendada */}
      {sortedPendingSessions
        .filter(session => canScheduleSession(session.sessionNumber) && session.status !== 'agendada')
        .map(session => (
          <CalendlyWidget
            key={`calendly-${session.id}`}
            mentorId={mentorId}
            open={false}
            onOpenChange={() => {}}
            onEventScheduled={handleCalendlyScheduled}
            sessionId={session.id}
            studentName={studentName}
            sessionInfo={{
              sessionNumber: session.sessionNumber,
              totalSessions: enrollment.totalSessions
            }}
            onSessionUpdated={onSessionUpdated}
          />
        ))}
    </>
  );
};

export default PendingSessionsCard;
