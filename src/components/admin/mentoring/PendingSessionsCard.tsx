
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Plus, Video, Settings, AlertTriangle, ExternalLink, CheckCircle, Trash2, Lock } from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { CalendlyWidget } from '@/components/calendly/CalendlyWidget';
import CreatePendingSessionForm from './CreatePendingSessionForm';
import { useToast } from '@/hooks/use-toast';
import { useCalendly } from '@/hooks/useCalendly';
import { CalendlyIndicator } from './CalendlyIndicator';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { CalendlyButton } from '@/components/calendly/CalendlyButton';
import { CalendlyEventPayload } from '@/types/calendly.types';

interface PendingSessionsCardProps {
  enrollment: StudentMentoringEnrollment;
  pendingSessions: MentoringSession[];
  onCreateSession: (data: any) => void;
  onSessionScheduled: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  isLoading?: boolean;
  allSessions?: MentoringSession[];
}

const PendingSessionsCard = ({ 
  enrollment, 
  pendingSessions, 
  onCreateSession, 
  onSessionScheduled,
  onDeleteSession,
  isLoading,
  allSessions = []
}: PendingSessionsCardProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const { students } = useStudentsForEnrollment();

  // Buscar informações do estudante
  const student = students?.find(s => s.id === enrollment.studentId);
  const studentName = student?.name || student?.email || 'Aluno';

  // Calcular o total de sessões já criadas (todas as sessões da inscrição)
  const totalSessionsCreated = allSessions.filter(session => session.enrollmentId === enrollment.id).length;
  
  // Verificar se pode criar mais sessões
  const canCreateMoreSessions = totalSessionsCreated < enrollment.totalSessions;
  
  // Calcular o próximo número de sessão
  const nextSessionNumber = totalSessionsCreated + 1;

  // Verificar se uma sessão pode ser agendada (lógica sequencial)
  const canScheduleSession = (sessionNumber: number): boolean => {
    // Sempre pode agendar a primeira sessão
    if (sessionNumber === 1) return true;
    
    // Para outras sessões, verificar se todas as anteriores estão agendadas ou concluídas
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

  // Verificar se existe uma sessão não agendada anterior
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

  const handleCreateSession = (data: any) => {
    // Adicionar o número da sessão correto aos dados
    const sessionData = {
      ...data,
      sessionNumber: nextSessionNumber,
      title: `Sessão ${nextSessionNumber} - ${enrollment.mentoring.name}`
    };
    
    onCreateSession(sessionData);
    setShowCreateForm(false);
  };

  const handleDeleteSession = (session: MentoringSession) => {
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

  // Ordenar sessões pendentes por número
  const sortedPendingSessions = [...pendingSessions].sort((a, b) => a.sessionNumber - b.sessionNumber);

  return (
    <>
      <div className="space-y-4">
        {/* Info sobre limite de sessões */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800 font-medium">
              Sessões criadas: {totalSessionsCreated} de {enrollment.totalSessions}
            </span>
            {!canCreateMoreSessions ? (
              <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                Limite atingido
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 text-xs font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="h-3 w-3 mr-1" />
                Nova Sessão
              </Button>
            )}
          </div>
          {canCreateMoreSessions && (
            <p className="text-xs text-blue-600 mt-2 font-medium">
              Próxima sessão será: Sessão {nextSessionNumber}
            </p>
          )}
        </div>

        {/* Indicador do Status do Calendly */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <span className="font-medium text-amber-900">Mentor: {enrollment.responsibleMentor}</span>
                <div className="mt-1">
                  <CalendlyIndicator 
                    mentorId={enrollment.responsibleMentor} 
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
              
              return (
                <div
                  key={session.id}
                  className={`group bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
                    canSchedule 
                      ? 'border-amber-200 hover:border-amber-300' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        canSchedule 
                          ? 'bg-amber-100 group-hover:bg-amber-200' 
                          : 'bg-gray-100'
                      }`}>
                        {canSchedule ? (
                          <Video className="h-4 w-4 text-amber-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-medium text-sm ${
                          canSchedule ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {session.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className={`flex items-center gap-1 ${
                            canSchedule ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            <Clock className="h-3 w-3" />
                            {session.durationMinutes} min
                          </span>
                          <Badge variant="outline" className={`text-xs px-2 py-0 ${
                            canSchedule 
                              ? 'text-amber-700 border-amber-300 bg-amber-50' 
                              : 'text-gray-500 border-gray-300 bg-gray-50'
                          }`}>
                            {canSchedule ? 'Aguardando' : 'Bloqueada'}
                          </Badge>
                          {hasUnscheduledPrevious && (
                            <span className="text-xs text-red-600 font-medium">
                              Aguarde sessão anterior
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canSchedule && (
                        <CalendlyButton
                          mentorId={enrollment.responsibleMentor}
                          sessionId={session.id}
                          onEventScheduled={handleCalendlyScheduled}
                          variant="default"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm hover:shadow-md"
                          studentName={studentName}
                          sessionInfo={{
                            sessionNumber: session.sessionNumber,
                            totalSessions: enrollment.totalSessions
                          }}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Agendar Sessão
                        </CalendlyButton>
                      )}
                      
                      {!canSchedule && (
                        <Button
                          size="sm"
                          disabled
                          className="bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg px-3 py-1.5 text-xs font-medium"
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          Bloqueada
                        </Button>
                      )}
                      
                      {onDeleteSession && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSession(session)}
                          className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-2 py-1.5"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
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
            onSubmit={handleCreateSession}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isLoading}
            sessionNumber={nextSessionNumber}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingSessionsCard;
