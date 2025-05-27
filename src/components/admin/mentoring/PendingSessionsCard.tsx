
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Plus, Video, Settings, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { CalendlyWidget } from '@/components/calendly/CalendlyWidget';
import CreatePendingSessionForm from './CreatePendingSessionForm';
import { useToast } from '@/hooks/use-toast';
import { useCalendly } from '@/hooks/useCalendly';
import { CalendlyIndicator } from './CalendlyIndicator';
import { useStudents } from '@/hooks/admin/useStudents';

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
  const [calendlyConfigExists, setCalendlyConfigExists] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { getCalendlyConfig } = useCalendly();
  const { students } = useStudents();

  // Buscar informações do estudante
  const student = students?.find(s => s.id === enrollment.studentId);
  const studentName = student?.name || student?.email || 'Aluno';

  const handleCreateSession = (data: any) => {
    onCreateSession(data);
    setShowCreateForm(false);
  };

  const handleScheduleSession = async (session: MentoringSession) => {
    console.log('🔄 Tentando agendar sessão para mentor:', enrollment.responsibleMentor);
    
    // Verificar se existe configuração do Calendly
    const config = await getCalendlyConfig(enrollment.responsibleMentor);
    
    if (!config) {
      setCalendlyConfigExists(false);
      toast({
        title: "Calendly não configurado",
        description: `Configure o Calendly para o mentor "${enrollment.responsibleMentor}" antes de agendar.`,
        variant: "destructive",
      });
      return;
    }

    setCalendlyConfigExists(true);
    console.log('✅ Configuração Calendly encontrada, abrindo widget...');
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
      title: "Erro no Calendly",
      description: `Erro ao carregar Calendly para o mentor "${enrollment.responsibleMentor}". Verifique a configuração.`,
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
            <div className="space-y-4">
              {/* Indicador do Status do Calendly */}
              <Alert>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <div>
                      <span className="font-medium">Mentor: {enrollment.responsibleMentor}</span>
                      <div className="mt-1">
                        <CalendlyIndicator 
                          mentorId={enrollment.responsibleMentor} 
                          showConfigButton={false}
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="link" 
                    size="sm"
                    className="p-0 h-auto font-medium text-blue-600"
                    onClick={() => window.open('/admin/calendly-config', '_blank')}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Configurar
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </Alert>

              {pendingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
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
          studentName={studentName}
          sessionInfo={{
            sessionNumber: selectedSession.sessionNumber,
            totalSessions: enrollment.totalSessions
          }}
        />
      )}
    </>
  );
};

export default PendingSessionsCard;
