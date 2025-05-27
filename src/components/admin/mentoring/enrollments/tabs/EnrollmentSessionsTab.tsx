
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { CalendlyWidget } from '@/components/calendly/CalendlyWidget';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentSessionsTabProps {
  enrollment: StudentMentoringEnrollment;
}

interface SessionData {
  id: string;
  sessionNumber: number;
  title: string;
  status: 'pendente' | 'agendada' | 'concluida' | 'cancelada';
  scheduledDate?: string;
  meetingLink?: string;
}

export const EnrollmentSessionsTab: React.FC<EnrollmentSessionsTabProps> = ({
  enrollment
}) => {
  const { toast } = useToast();
  const [showCalendly, setShowCalendly] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

  // Gerar lista de sessões baseado no total de sessões da inscrição
  const sessions = useMemo<SessionData[]>(() => {
    const sessionsList: SessionData[] = [];
    
    for (let i = 1; i <= enrollment.totalSessions; i++) {
      let status: 'pendente' | 'agendada' | 'concluida' | 'cancelada' = 'pendente';
      let scheduledDate: string | undefined;
      let meetingLink: string | undefined;

      if (i <= enrollment.sessionsUsed) {
        status = 'concluida';
        scheduledDate = new Date(Date.now() - (enrollment.sessionsUsed - i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (i === enrollment.sessionsUsed + 1) {
        status = Math.random() > 0.5 ? 'agendada' : 'pendente';
        if (status === 'agendada') {
          scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
          meetingLink = 'https://meet.google.com/exemplo';
        }
      }

      sessionsList.push({
        id: `session-${i}`,
        sessionNumber: i,
        title: `Sessão ${i} - ${enrollment.mentoring.name}`,
        status,
        scheduledDate,
        meetingLink
      });
    }

    return sessionsList;
  }, [enrollment]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluida':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-2 py-0.5">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluída
          </Badge>
        );
      case 'agendada':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5">
            <Calendar className="w-3 h-3 mr-1" />
            Agendada
          </Badge>
        );
      case 'cancelada':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-0.5">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-xs px-2 py-0.5">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  };

  const handleScheduleSession = (session: SessionData) => {
    setSelectedSession(session);
    setShowCalendly(true);
  };

  const handleCalendlyEventScheduled = (eventData: any) => {
    toast({
      title: "Sessão Agendada",
      description: `Sessão ${selectedSession?.sessionNumber} foi agendada com sucesso!`,
    });
    setShowCalendly(false);
    setSelectedSession(null);
  };

  const pendingSessions = sessions.filter(s => s.status === 'pendente');
  const scheduledSessions = sessions.filter(s => s.status === 'agendada');
  const completedSessions = sessions.filter(s => s.status === 'concluida');

  const SessionCard = ({ session }: { session: SessionData }) => (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${
            session.status === 'concluida' ? 'bg-emerald-100 group-hover:bg-emerald-200' :
            session.status === 'agendada' ? 'bg-blue-100 group-hover:bg-blue-200' :
            'bg-amber-100 group-hover:bg-amber-200'
          }`}>
            {session.status === 'concluida' ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : session.status === 'agendada' ? (
              <Calendar className="h-4 w-4 text-blue-600" />
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
                  {new Date(session.scheduledDate).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(session.scheduledDate).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(session.status)}
          {session.status === 'pendente' && (
            <Button
              size="sm"
              onClick={() => handleScheduleSession(session)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm hover:shadow-md transition-all"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
          )}
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
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Estatísticas das Sessões */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-gray-100 rounded-lg w-fit mx-auto mb-2">
              <PlayCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{enrollment.totalSessions}</div>
            <div className="text-xs text-gray-600 font-medium">Total</div>
          </CardContent>
        </Card>
        <Card className="border border-emerald-200 rounded-xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-emerald-100 rounded-lg w-fit mx-auto mb-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">{completedSessions.length}</div>
            <div className="text-xs text-emerald-700 font-medium">Concluídas</div>
          </CardContent>
        </Card>
        <Card className="border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{scheduledSessions.length}</div>
            <div className="text-xs text-blue-700 font-medium">Agendadas</div>
          </CardContent>
        </Card>
        <Card className="border border-amber-200 rounded-xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-amber-100 rounded-lg w-fit mx-auto mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{pendingSessions.length}</div>
            <div className="text-xs text-amber-700 font-medium">Pendentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessões Pendentes */}
      {pendingSessions.length > 0 && (
        <Card className="border border-amber-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-amber-900">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Pendentes de Agendar ({pendingSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sessões Agendadas */}
      {scheduledSessions.length > 0 && (
        <Card className="border border-blue-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-900">
              <Calendar className="h-5 w-5 text-blue-600" />
              Agendadas ({scheduledSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sessões Realizadas */}
      {completedSessions.length > 0 && (
        <Card className="border border-emerald-200 rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-emerald-900">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Realizadas ({completedSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Widget do Calendly */}
      <CalendlyWidget
        mentorId={enrollment.responsibleMentor}
        open={showCalendly}
        onOpenChange={setShowCalendly}
        onEventScheduled={handleCalendlyEventScheduled}
      />
    </div>
  );
};
