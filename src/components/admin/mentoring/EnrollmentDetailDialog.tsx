
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  Clock, 
  GraduationCap, 
  FileText, 
  Activity,
  Plus,
  X
} from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import PendingSessionsCard from './PendingSessionsCard';

interface EnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
}

export const EnrollmentDetailDialog = ({ open, onOpenChange, enrollment }: EnrollmentDetailDialogProps) => {
  const { sessions, createSession, refreshSessions } = useSupabaseMentoring();
  const [enrollmentSessions, setEnrollmentSessions] = useState<MentoringSession[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (enrollment && sessions) {
      const filtered = sessions.filter(session => session.enrollmentId === enrollment.id);
      setEnrollmentSessions(filtered);
    }
  }, [enrollment, sessions]);

  if (!enrollment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'concluida': return 'Concluída';
      case 'pausada': return 'Pausada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const pendingSessions = enrollmentSessions.filter(session => session.status === 'aguardando_agendamento');
  const scheduledSessions = enrollmentSessions.filter(session => session.status !== 'aguardando_agendamento');

  const handleCreateSession = async (data: any) => {
    setIsCreatingSession(true);
    try {
      await createSession(data);
      await refreshSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSessionScheduled = (sessionId: string) => {
    console.log('Session scheduled:', sessionId);
    refreshSessions();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Detalhes da Inscrição
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Informações</TabsTrigger>
            <TabsTrigger value="sessions">Sessões ({enrollmentSessions.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({pendingSessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aluno</p>
                    <p className="text-gray-900">{enrollment.studentId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mentoria</p>
                    <p className="text-gray-900">{enrollment.mentoring.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mentor Responsável</p>
                    <p className="text-gray-900">{enrollment.responsibleMentor}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge className={getStatusColor(enrollment.status)}>
                      {getStatusLabel(enrollment.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Período</p>
                    <p className="text-gray-900">
                      {format(new Date(enrollment.startDate), 'dd/MM/yyyy', { locale: ptBR })} - {' '}
                      {format(new Date(enrollment.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progresso</p>
                    <p className="text-gray-900">
                      {enrollment.sessionsUsed} de {enrollment.totalSessions} sessões realizadas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {enrollment.observations && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-600">Observações</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">{enrollment.observations}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {scheduledSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma sessão agendada ainda</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {scheduledSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{session.title}</h4>
                        <Badge variant="outline">
                          {session.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.scheduledDate && (
                          <p>
                            {format(new Date(session.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        )}
                        <p>{session.durationMinutes} minutos</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="max-h-[60vh] overflow-y-auto">
            <PendingSessionsCard
              enrollment={enrollment}
              pendingSessions={pendingSessions}
              onCreateSession={handleCreateSession}
              onSessionScheduled={handleSessionScheduled}
              isLoading={isCreatingSession}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
