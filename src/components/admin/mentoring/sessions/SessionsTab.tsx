
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Video, 
  FileText, 
  MessageSquare,
  Upload,
  Eye,
  Edit
} from 'lucide-react';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SessionDetailDialog from './SessionDetailDialog';
import SessionForm from '../SessionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SessionsTabProps {
  enrollment: StudentMentoringEnrollment;
  onCreateSession?: (data: any) => void;
  onUpdateSession?: (sessionId: string, data: any) => void;
  onScheduleSession?: (sessionId: string, data: any) => void;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({
  enrollment,
  onCreateSession,
  onUpdateSession,
  onScheduleSession
}) => {
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null);
  const [showSessionDetail, setShowSessionDetail] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [editingSession, setEditingSession] = useState<MentoringSession | null>(null);

  // Mock sessions data - em uma implementação real, seria obtido do backend
  const mockSessions: MentoringSession[] = [
    {
      id: 'session-1',
      enrollmentId: enrollment.id,
      sessionNumber: 1,
      type: 'individual',
      title: 'Sessão Inicial - Diagnóstico',
      scheduledDate: '2025-01-30T14:00:00Z',
      durationMinutes: 60,
      status: 'realizada',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      recordingLink: 'https://drive.google.com/recording1',
      mentorNotes: 'Aluno demonstrou interesse em e-commerce. Definimos objetivos iniciais.',
      studentNotes: 'Primeira sessão muito produtiva!',
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-30T15:00:00Z'
    },
    {
      id: 'session-2', 
      enrollmentId: enrollment.id,
      sessionNumber: 2,
      type: 'individual',
      title: 'Planejamento Estratégico',
      scheduledDate: '2025-02-06T14:00:00Z',
      durationMinutes: 60,
      status: 'agendada',
      meetingLink: 'https://meet.google.com/xyz-abc-def',
      createdAt: '2025-01-25T10:00:00Z',
      updatedAt: '2025-01-25T10:00:00Z'
    },
    {
      id: 'session-3',
      enrollmentId: enrollment.id,
      sessionNumber: 3,
      type: 'individual',
      title: 'Sessão 3 - A definir',
      durationMinutes: 60,
      status: 'aguardando_agendamento',
      createdAt: '2025-01-25T10:00:00Z',
      updatedAt: '2025-01-25T10:00:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no_show_aluno': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no_show_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return 'Aguardando Agendamento';
      case 'agendada': return 'Agendada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'reagendada': return 'Reagendada';
      case 'no_show_aluno': return 'Faltou Aluno';
      case 'no_show_mentor': return 'Faltou Mentor';
      default: return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não agendada';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const upcomingSessions = mockSessions.filter(s => 
    s.status === 'agendada' && 
    s.scheduledDate && 
    new Date(s.scheduledDate) > new Date()
  ).sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());

  const completedSessions = mockSessions.filter(s => s.status === 'realizada');
  const pendingSessions = mockSessions.filter(s => s.status === 'aguardando_agendamento');

  const handleViewSession = (session: MentoringSession) => {
    setSelectedSession(session);
    setShowSessionDetail(true);
  };

  const handleEditSession = (session: MentoringSession) => {
    setEditingSession(session);
  };

  const handleCreateSession = (data: any) => {
    console.log('Criando nova sessão:', data);
    if (onCreateSession) {
      onCreateSession({ ...data, enrollmentId: enrollment.id });
    }
    setShowCreateSession(false);
  };

  const SessionCard = ({ session }: { session: MentoringSession }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{session.title}</h4>
            <p className="text-sm text-gray-600">Sessão #{session.sessionNumber}</p>
          </div>
          <Badge className={`${getStatusColor(session.status)} text-xs`}>
            {getStatusLabel(session.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(session.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{session.durationMinutes} min</span>
          </div>
        </div>

        {session.meetingLink && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Video className="h-4 w-4 text-blue-500" />
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
              Link da reunião
            </a>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleViewSession(session)}
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver Detalhes
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditSession(session)}
            className="text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header com botão de criar sessão */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Sessões da Mentoria</h3>
            <p className="text-sm text-gray-600">
              {completedSessions.length} de {mockSessions.length} sessões realizadas
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateSession(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Sessão
          </Button>
        </div>

        {/* Progresso das sessões */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso das Sessões</span>
              <span>{completedSessions.length}/{mockSessions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(completedSessions.length / mockSessions.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Abas de sessões */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Próximas ({upcomingSessions.length})</TabsTrigger>
            <TabsTrigger value="completed">Realizadas ({completedSessions.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({pendingSessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma sessão agendada
                  </h3>
                  <p className="text-gray-500">
                    Agende as próximas sessões para continuar a mentoria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length > 0 ? (
              completedSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma sessão realizada
                  </h3>
                  <p className="text-gray-500">
                    As sessões realizadas aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingSessions.length > 0 ? (
              pendingSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma sessão pendente
                  </h3>
                  <p className="text-gray-500">
                    Todas as sessões estão agendadas ou realizadas.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de detalhes da sessão */}
      <SessionDetailDialog
        open={showSessionDetail}
        onOpenChange={setShowSessionDetail}
        session={selectedSession}
      />

      {/* Dialog de criação de sessão */}
      <Dialog open={showCreateSession} onOpenChange={setShowCreateSession}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Sessão</DialogTitle>
          </DialogHeader>
          <SessionForm
            onSubmit={handleCreateSession}
            onCancel={() => setShowCreateSession(false)}
            initialData={{ enrollmentId: enrollment.id }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionsTab;
