
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Plus, Video, Settings, AlertTriangle } from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { CalendlyWidget } from '@/components/calendly/CalendlyWidget';
import CreatePendingSessionForm from './CreatePendingSessionForm';
import { useToast } from '@/hooks/use-toast';

interface PendingSessionsCardProps {
  enrollment: StudentMentoringEnrollment;
  pendingSessions: MentoringSession[];
  onCreateSession: (data: any) => void;
  onSessionScheduled: (sessionId: string) => void;
  isLoading?: boolean;
}

const PendingSessionsCard = ({ 
  enrollment, 
  pendingSessions, 
  onCreateSession, 
  onSessionScheduled,
  isLoading 
}: PendingSessionsCardProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null);
  const { toast } = useToast();

  const handleCreateSession = (data: any) => {
    onCreateSession(data);
    setShowCreateForm(false);
  };

  const handleScheduleSession = (session: MentoringSession) => {
    setSelectedSession(session);
    setShowCalendly(true);
  };

  const handleCalendlyScheduled = () => {
    if (selectedSession) {
      onSessionScheduled(selectedSession.id);
      toast({
        title: "Sucesso",
        description: "Sessão agendada via Calendly com sucesso!",
      });
    }
    setShowCalendly(false);
    setSelectedSession(null);
  };

  const handleCalendlyError = () => {
    toast({
      title: "Calendly não configurado",
      description: "Configure o Calendly para este mentor antes de agendar.",
      variant: "destructive",
    });
    setShowCalendly(false);
    setSelectedSession(null);
  };

  const canCreateMoreSessions = enrollment.sessionsUsed + pendingSessions.length < enrollment.totalSessions;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Sessões Aguardando Agendamento
            </div>
            {canCreateMoreSessions && (
              <Button
                size="sm"
                onClick={() => setShowCreateForm(true)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Sessão
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Nenhuma sessão aguardando agendamento</p>
              {canCreateMoreSessions && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Sessão
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Para agendar via Calendly, certifique-se de que o mentor tem uma configuração ativa em{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-medium"
                    onClick={() => window.open('/admin/calendly-config', '_blank')}
                  >
                    Configurações Calendly
                  </Button>
                </AlertDescription>
              </Alert>

              {pendingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Video className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.durationMinutes} min
                        </span>
                        <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                          Aguardando
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleScheduleSession(session)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </div>
              ))}
              
              {canCreateMoreSessions && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                  className="w-full mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Mais Sessões
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar nova sessão */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Sessão Pendente</DialogTitle>
          </DialogHeader>
          <CreatePendingSessionForm
            enrollment={enrollment}
            onSubmit={handleCreateSession}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Widget do Calendly para agendamento */}
      {selectedSession && (
        <CalendlyWidget
          mentorId={enrollment.responsibleMentor}
          open={showCalendly}
          onOpenChange={setShowCalendly}
          onEventScheduled={handleCalendlyScheduled}
        />
      )}
    </>
  );
};

export default PendingSessionsCard;
