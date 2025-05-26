
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Link2, Edit, Check, X, AlertCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MentoringSession, StudentMentoringEnrollment } from '@/types/mentoring.types';
import { SessionScheduleDialog } from './SessionScheduleDialog';
import { SessionStatusDialog } from './SessionStatusDialog';

interface SessionManagementTabProps {
  enrollment: StudentMentoringEnrollment;
  sessions: MentoringSession[];
  onUpdateSession: (sessionId: string, data: any) => void;
  onScheduleSession: (sessionId: string, data: any) => void;
}

export const SessionManagementTab: React.FC<SessionManagementTabProps> = ({
  enrollment,
  sessions,
  onUpdateSession,
  onScheduleSession
}) => {
  const [scheduleDialog, setScheduleDialog] = useState<{ open: boolean; session?: MentoringSession }>({ open: false });
  const [statusDialog, setStatusDialog] = useState<{ open: boolean; session?: MentoringSession }>({ open: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluida': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no_show_aluno': return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return 'Aguardando Agendamento';
      case 'agendada': return 'Agendada';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      case 'reagendada': return 'Reagendada';
      case 'no_show_aluno': return 'No-show Aluno';
      case 'no_show_mentor': return 'No-show Mentor';
      default: return status;
    }
  };

  const getSessionProgress = () => {
    const completed = sessions.filter(s => s.status === 'concluida').length;
    const total = sessions.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const handleScheduleSession = (data: { scheduledDate: string; meetingLink?: string; notes?: string }) => {
    if (scheduleDialog.session) {
      onScheduleSession(scheduleDialog.session.id, data);
      setScheduleDialog({ open: false });
    }
  };

  const progress = getSessionProgress();

  return (
    <div className="space-y-6">
      {/* Progresso das Sessões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Progresso das Sessões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sessões Concluídas</span>
              <span className="text-sm text-gray-600">{progress.completed}/{progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {sessions.filter(s => s.status === 'aguardando_agendamento').length}
                </div>
                <div className="text-xs text-gray-500">Aguardando</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {sessions.filter(s => s.status === 'agendada').length}
                </div>
                <div className="text-xs text-gray-500">Agendadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.status === 'concluida').length}
                </div>
                <div className="text-xs text-gray-500">Concluídas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {sessions.filter(s => ['cancelada', 'no_show_aluno', 'no_show_mentor'].includes(s.status)).length}
                </div>
                <div className="text-xs text-gray-500">Problemas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Sessões */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sessões da Mentoria</h3>
        
        {sessions.map((session) => (
          <Card key={session.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header da Sessão */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {session.sessionNumber}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-gray-500">
                          Sessão {session.sessionNumber} de {enrollment.totalSessions}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(session.status)} ml-auto`}>
                      {getStatusLabel(session.status)}
                    </Badge>
                  </div>

                  {/* Informações da Sessão */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      {session.scheduledDate ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(session.scheduledDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{format(new Date(session.scheduledDate), 'HH:mm', { locale: ptBR })}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <AlertCircle className="h-4 w-4" />
                          <span>Data não agendada</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{session.durationMinutes} minutos</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {session.calendlyLink && (
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-gray-400" />
                          <a 
                            href={session.calendlyLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Link Calendly
                            <ExternalLink className="h-3 w-3 inline ml-1" />
                          </a>
                        </div>
                      )}
                      
                      {session.meetingLink && (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-gray-400" />
                          <a 
                            href={session.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Link da Reunião
                            <ExternalLink className="h-3 w-3 inline ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notas */}
                  {(session.mentorNotes || session.studentNotes) && (
                    <div className="border-t pt-3 space-y-2">
                      {session.mentorNotes && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Notas do Mentor:</span>
                          <p className="text-sm text-gray-700">{session.mentorNotes}</p>
                        </div>
                      )}
                      {session.studentNotes && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Notas do Aluno:</span>
                          <p className="text-sm text-gray-700">{session.studentNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2 ml-4">
                  {session.status === 'aguardando_agendamento' && (
                    <Button
                      size="sm"
                      onClick={() => setScheduleDialog({ open: true, session })}
                      className="text-xs"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Agendar
                    </Button>
                  )}
                  
                  {session.status === 'agendada' && session.meetingLink && (
                    <Button
                      size="sm"
                      onClick={() => window.open(session.meetingLink, '_blank')}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Entrar
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusDialog({ open: true, session })}
                    className="text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diálogos */}
      <SessionScheduleDialog
        open={scheduleDialog.open}
        onOpenChange={(open) => setScheduleDialog({ open })}
        session={scheduleDialog.session}
        onSchedule={handleScheduleSession}
      />

      <SessionStatusDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({ open })}
        session={statusDialog.session}
        onUpdate={onUpdateSession}
      />
    </div>
  );
};
