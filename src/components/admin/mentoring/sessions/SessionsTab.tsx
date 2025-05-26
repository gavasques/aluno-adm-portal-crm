
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';
import SessionForm from '../SessionForm';
import { SessionDetailDialog } from './SessionDetailDialog';

interface SessionsTabProps {
  enrollment: StudentMentoringEnrollment;
  sessions: MentoringSession[];
  onCreateSession: (data: any) => void;
  onUpdateSession: (sessionId: string, data: any) => void;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({
  enrollment,
  sessions,
  onCreateSession,
  onUpdateSession
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingSession, setViewingSession] = useState<MentoringSession | null>(null);

  // Separar sessões por status
  const upcomingSessions = sessions.filter(s => 
    s.status === 'agendada' && 
    s.scheduledDate && 
    new Date(s.scheduledDate) > new Date()
  );
  
  const completedSessions = sessions.filter(s => s.status === 'realizada');
  const pendingSessions = sessions.filter(s => 
    s.status === 'aguardando_agendamento' || 
    !s.scheduledDate
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800';
      case 'realizada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'aguardando_agendamento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'aguardando_agendamento': return 'Aguardando Agendamento';
      default: return status;
    }
  };

  const formatSafeDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const renderSessionCard = (session: MentoringSession) => (
    <Card 
      key={session.id} 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setViewingSession(session)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">{session.title}</span>
          </div>
          <Badge className={getStatusColor(session.status)}>
            {getStatusLabel(session.status)}
          </Badge>
        </div>
        
        {session.scheduledDate && (
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatSafeDate(session.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{session.durationMinutes} min</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {session.status === 'agendada' && session.meetingLink && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(session.meetingLink, '_blank');
              }}
            >
              <Play className="h-3 w-3 mr-1" />
              Entrar
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setViewingSession(session);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Progresso das Sessões */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Progresso das Sessões</CardTitle>
            <Button onClick={() => setShowCreateForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {enrollment.sessionsUsed} de {enrollment.totalSessions} sessões realizadas
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((enrollment.sessionsUsed / enrollment.totalSessions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(enrollment.sessionsUsed / enrollment.totalSessions) * 100}%` 
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessões */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Próximas ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Realizadas ({completedSessions.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Pendentes ({pendingSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length > 0 ? (
            <div className="grid gap-4">
              {upcomingSessions.map(renderSessionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma sessão próxima
                </h3>
                <p className="text-gray-600">
                  Não há sessões agendadas para os próximos dias.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSessions.length > 0 ? (
            <div className="grid gap-4">
              {completedSessions.map(renderSessionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma sessão realizada
                </h3>
                <p className="text-gray-600">
                  As sessões realizadas aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingSessions.length > 0 ? (
            <div className="grid gap-4">
              {pendingSessions.map(renderSessionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma sessão pendente
                </h3>
                <p className="text-gray-600">
                  Todas as sessões estão agendadas ou foram realizadas.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para criar nova sessão */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Sessão</DialogTitle>
          </DialogHeader>
          <SessionForm
            enrollment={enrollment}
            onSubmit={(data) => {
              onCreateSession(data);
              setShowCreateForm(false);
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de detalhes da sessão */}
      <SessionDetailDialog
        session={viewingSession}
        open={!!viewingSession}
        onOpenChange={(open) => {
          if (!open) setViewingSession(null);
        }}
      />
    </div>
  );
};
