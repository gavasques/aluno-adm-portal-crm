
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Video, CheckCircle, XCircle } from 'lucide-react';
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
      // Simular algumas sessões já agendadas/concluídas
      let status: 'pendente' | 'agendada' | 'concluida' | 'cancelada' = 'pendente';
      let scheduledDate: string | undefined;
      let meetingLink: string | undefined;

      if (i <= enrollment.sessionsUsed) {
        status = 'concluida';
        scheduledDate = new Date(Date.now() - (enrollment.sessionsUsed - i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (i === enrollment.sessionsUsed + 1) {
        // Próxima sessão pode estar agendada
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
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Concluída</Badge>;
      case 'agendada':
        return <Badge className="bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" />Agendada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Cancelada</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
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

  const pendingSessions = sessions.filter(s => s.status === 'pendente').length;
  const scheduledSessions = sessions.filter(s => s.status === 'agendada').length;
  const completedSessions = sessions.filter(s => s.status === 'concluida').length;

  return (
    <div className="space-y-6">
      {/* Estatísticas das Sessões */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{enrollment.totalSessions}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedSessions}</div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{scheduledSessions}</div>
            <div className="text-sm text-gray-600">Agendadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingSessions}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Sessões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Todas as Sessões ({enrollment.totalSessions})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Título da Sessão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Agendada</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.sessionNumber}
                    </TableCell>
                    <TableCell>{session.title}</TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>
                      {session.scheduledDate ? (
                        <div className="text-sm">
                          {new Date(session.scheduledDate).toLocaleDateString('pt-BR')}
                          <br />
                          <span className="text-gray-500">
                            {new Date(session.scheduledDate).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Não agendada</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {session.status === 'pendente' && (
                          <Button
                            size="sm"
                            onClick={() => handleScheduleSession(session)}
                            className="flex items-center gap-1"
                          >
                            <Calendar className="h-3 w-3" />
                            Agendar
                          </Button>
                        )}
                        {session.status === 'agendada' && session.meetingLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(session.meetingLink, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <Video className="h-3 w-3" />
                            Reunião
                          </Button>
                        )}
                        {session.status === 'agendada' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScheduleSession(session)}
                            className="flex items-center gap-1"
                          >
                            <Calendar className="h-3 w-3" />
                            Reagendar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Widget do Calendly */}
      <CalendlyWidget
        mentorId={enrollment.responsibleMentor} // Usando o nome do mentor como ID temporariamente
        open={showCalendly}
        onOpenChange={setShowCalendly}
        onEventScheduled={handleCalendlyEventScheduled}
      />
    </div>
  );
};
