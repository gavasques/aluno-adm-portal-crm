
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
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import PendingSessionsCard from './PendingSessionsCard';

interface EnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
}

export const EnrollmentDetailDialog = ({ open, onOpenChange, enrollment }: EnrollmentDetailDialogProps) => {
  const { sessions, createSession, refreshSessions, deleteSession } = useSupabaseMentoring();
  const { students } = useStudentsForEnrollment();
  const [enrollmentSessions, setEnrollmentSessions] = useState<MentoringSession[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (enrollment && sessions) {
      const filtered = sessions.filter(session => session.enrollmentId === enrollment.id);
      setEnrollmentSessions(filtered);
    }
  }, [enrollment, sessions]);

  if (!enrollment) return null;

  // Buscar informações do estudante
  const student = students?.find(s => s.id === enrollment.studentId);
  const studentName = student?.name || student?.email || 'Aluno não encontrado';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
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

  const handleDeleteSession = async (sessionId: string) => {
    try {
      if (deleteSession) {
        await deleteSession(sessionId);
        await refreshSessions();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSessionScheduled = (sessionId: string) => {
    console.log('Session scheduled:', sessionId);
    refreshSessions();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden rounded-xl">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Detalhes da Inscrição
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">{enrollment.mentoring.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="details" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-sm"
            >
              Informações
            </TabsTrigger>
            <TabsTrigger 
              value="sessions" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-sm"
            >
              Sessões ({enrollmentSessions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-sm"
            >
              <span className="flex items-center gap-2">
                Pendentes ({pendingSessions.length})
                {pendingSessions.length > 0 && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                )}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 max-h-[60vh] overflow-y-auto mt-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 text-base mb-4">Informações do Aluno</h3>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aluno</p>
                    <p className="text-gray-900 font-medium">{studentName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mentoria</p>
                    <p className="text-gray-900 font-medium">{enrollment.mentoring.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mentor Responsável</p>
                    <p className="text-gray-900 font-medium">{enrollment.responsibleMentor}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 text-base mb-4">Status e Progresso</h3>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Activity className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge className={`${getStatusColor(enrollment.status)} text-xs font-medium mt-1`}>
                      {getStatusLabel(enrollment.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Período</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {format(new Date(enrollment.startDate), 'dd/MM/yyyy', { locale: ptBR })} - {' '}
                      {format(new Date(enrollment.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Clock className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progresso</p>
                    <p className="text-gray-900 font-medium">
                      {enrollment.sessionsUsed} de {enrollment.totalSessions} sessões realizadas
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${(enrollment.sessionsUsed / enrollment.totalSessions) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {enrollment.observations && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-600">Observações</p>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{enrollment.observations}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="max-h-[60vh] overflow-y-auto mt-6">
            <div className="space-y-4">
              {scheduledSessions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Nenhuma sessão agendada ainda</p>
                  <p className="text-sm text-gray-400 mt-1">As sessões aparecerão aqui após serem agendadas</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {scheduledSessions.map((session) => (
                    <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{session.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {session.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {session.scheduledDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(session.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{session.durationMinutes} minutos</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="max-h-[60vh] overflow-y-auto mt-6">
            <PendingSessionsCard
              enrollment={enrollment}
              pendingSessions={pendingSessions}
              allSessions={enrollmentSessions}
              onCreateSession={handleCreateSession}
              onSessionScheduled={handleSessionScheduled}
              onDeleteSession={handleDeleteSession}
              isLoading={isCreatingSession}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
