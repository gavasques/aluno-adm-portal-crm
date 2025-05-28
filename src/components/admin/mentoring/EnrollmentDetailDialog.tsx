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
  CheckCircle,
  Video,
  Trash2
} from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';
import PendingSessionsCard from './PendingSessionsCard';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
}

export const EnrollmentDetailDialog = ({ open, onOpenChange, enrollment }: EnrollmentDetailDialogProps) => {
  const { sessions, createSession, refreshSessions, deleteSession } = useSupabaseMentoring();
  const { students } = useActiveStudentsForMentoring();
  const { toast } = useToast();
  const [enrollmentSessions, setEnrollmentSessions] = useState<MentoringSession[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (enrollment && sessions) {
      const filtered = sessions.filter(session => session.enrollmentId === enrollment.id);
      console.log('📊 Total de sessões para esta inscrição:', filtered.length);
      console.log('📋 Sessões encontradas:', filtered);
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

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'aguardando_agendamento': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSessionStatusLabel = (status: string) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'agendada': return 'Agendada';
      case 'cancelada': return 'Cancelada';
      case 'aguardando_agendamento': return 'Aguardando';
      default: return status;
    }
  };

  // Organizar sessões por status
  const pendingSessions = enrollmentSessions.filter(s => s.status === 'aguardando_agendamento');
  const scheduledSessions = enrollmentSessions.filter(s => s.status === 'agendada');
  const completedSessions = enrollmentSessions.filter(s => s.status === 'concluida');
  const canceledSessions = enrollmentSessions.filter(s => s.status === 'cancelada');

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
        const success = await deleteSession(sessionId);
        if (success) {
          await refreshSessions();
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSessionScheduled = (sessionId: string) => {
    console.log('Session scheduled:', sessionId);
    refreshSessions();
  };

  const SessionCard = ({ session }: { session: MentoringSession }) => (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${
            session.status === 'concluida' ? 'bg-emerald-100 group-hover:bg-emerald-200' :
            session.status === 'agendada' ? 'bg-blue-100 group-hover:bg-blue-200' :
            session.status === 'cancelada' ? 'bg-red-100 group-hover:bg-red-200' :
            'bg-amber-100 group-hover:bg-amber-200'
          }`}>
            {session.status === 'concluida' ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : session.status === 'agendada' ? (
              <Calendar className="h-4 w-4 text-blue-600" />
            ) : session.status === 'cancelada' ? (
              <X className="h-4 w-4 text-red-600" />
            ) : (
              <Clock className="h-4 w-4 text-amber-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{session.title}</h4>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span>Sessão {session.sessionNumber}</span>
              {session.scheduledDate && (
                <span>
                  {format(new Date(session.scheduledDate), 'dd/MM/yyyy', { locale: ptBR })} às{' '}
                  {format(new Date(session.scheduledDate), 'HH:mm', { locale: ptBR })}
                </span>
              )}
              <span>{session.durationMinutes} min</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs px-2 py-0.5 ${getSessionStatusColor(session.status)}`}>
            {getSessionStatusLabel(session.status)}
          </Badge>
          {session.status === 'agendada' && session.meetingLink && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(session.meetingLink, '_blank')}
              className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg px-3 py-1.5 text-xs"
            >
              <Video className="h-3 w-3 mr-1" />
              Reunião
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteSession(session.id)}
            className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-2 py-1.5"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

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
            <div className="space-y-6">
              {/* Estatísticas das Sessões */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-all">
                  <div className="p-2 bg-gray-100 rounded-lg w-fit mx-auto mb-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{enrollmentSessions.length}</div>
                  <div className="text-xs text-gray-600 font-medium">Total</div>
                </div>
                <div className="bg-white border border-emerald-200 rounded-xl p-4 text-center hover:shadow-md transition-all">
                  <div className="p-2 bg-emerald-100 rounded-lg w-fit mx-auto mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">{completedSessions.length}</div>
                  <div className="text-xs text-emerald-700 font-medium">Concluídas</div>
                </div>
                <div className="bg-white border border-blue-200 rounded-xl p-4 text-center hover:shadow-md transition-all">
                  <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{scheduledSessions.length}</div>
                  <div className="text-xs text-blue-700 font-medium">Agendadas</div>
                </div>
                <div className="bg-white border border-amber-200 rounded-xl p-4 text-center hover:shadow-md transition-all">
                  <div className="p-2 bg-amber-100 rounded-lg w-fit mx-auto mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600">{pendingSessions.length}</div>
                  <div className="text-xs text-amber-700 font-medium">Pendentes</div>
                </div>
              </div>

              {/* Sessões Pendentes */}
              {pendingSessions.length > 0 && (
                <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-amber-900 mb-4">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Pendentes de Agendar ({pendingSessions.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sessões Agendadas */}
              {scheduledSessions.length > 0 && (
                <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-blue-900 mb-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Agendadas ({scheduledSessions.length})
                  </h3>
                  <div className="space-y-3">
                    {scheduledSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sessões Realizadas */}
              {completedSessions.length > 0 && (
                <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-emerald-900 mb-4">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Realizadas ({completedSessions.length})
                  </h3>
                  <div className="space-y-3">
                    {completedSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sessões Canceladas */}
              {canceledSessions.length > 0 && (
                <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-red-900 mb-4">
                    <X className="h-5 w-5 text-red-600" />
                    Canceladas ({canceledSessions.length})
                  </h3>
                  <div className="space-y-3">
                    {canceledSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                </div>
              )}

              {/* Estado vazio */}
              {enrollmentSessions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Nenhuma sessão criada ainda</p>
                  <p className="text-sm text-gray-400 mt-1">Vá para a aba "Pendentes" para criar sessões</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="max-h-[60vh] overflow-y-auto mt-6">
            <PendingSessionsCard
              mentoringSessions={enrollmentSessions}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
