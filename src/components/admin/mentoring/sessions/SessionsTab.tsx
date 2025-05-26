
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
  Edit,
  Trash2,
  UserX
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
  onDeleteSession: (sessionId: string) => void;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({
  enrollment,
  sessions,
  onCreateSession,
  onUpdateSession,
  onDeleteSession
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingSession, setViewingSession] = useState<MentoringSession | null>(null);

  // Separar sessões por status
  const waitingSessions = sessions.filter(s => s.status === 'aguardando_agendamento');
  const scheduledSessions = sessions.filter(s => s.status === 'agendada');
  const completedSessions = sessions.filter(s => s.status === 'concluida');
  const noShowSessions = sessions.filter(s => s.status === 'no_show_aluno');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'no_show_aluno': return 'bg-red-100 text-red-800';
      case 'aguardando_agendamento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'concluida': return 'Concluída';
      case 'no_show_aluno': return 'No-Show';
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

  const handleStatusChange = (sessionId: string, newStatus: string) => {
    onUpdateSession(sessionId, { status: newStatus });
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
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(session.status)}>
              {getStatusLabel(session.status)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
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
          {session.status === 'aguardando_agendamento' && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(session.id, 'agendada');
              }}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
          )}
          
          {session.status === 'agendada' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(session.id, 'concluida');
                }}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Concluir
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(session.id, 'no_show_aluno');
                }}
              >
                <UserX className="h-3 w-3 mr-1" />
                No-Show
              </Button>
            </>
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

  const renderEmptyState = (title: string, description: string, icon: React.ReactNode) => (
    <Card>
      <CardContent className="p-8 text-center">
        {icon}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );

  // Calcular sessões concluídas vs perdidas
  const completedCount = completedSessions.length;
  const lostCount = noShowSessions.length;
  const totalSessions = sessions.length;
  const availableSessions = completedCount + (totalSessions - completedCount - lostCount);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{lostCount}</div>
              <div className="text-sm text-gray-600">Perdidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{availableSessions}</div>
              <div className="text-sm text-gray-600">Disponíveis</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {completedCount} de {totalSessions} sessões concluídas
            </span>
            <span className="text-sm text-gray-600">
              {totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0}%` 
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessões por Status */}
      <Tabs defaultValue="waiting" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="waiting" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Aguardando ({waitingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agendadas ({scheduledSessions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluídas ({completedSessions.length})
          </TabsTrigger>
          <TabsTrigger value="noshow" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            No-Show ({noShowSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waiting" className="space-y-4">
          {waitingSessions.length > 0 ? (
            <div className="grid gap-4">
              {waitingSessions.map(renderSessionCard)}
            </div>
          ) : (
            renderEmptyState(
              "Nenhuma sessão aguardando",
              "Todas as sessões foram agendadas ou estão em outros status.",
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledSessions.length > 0 ? (
            <div className="grid gap-4">
              {scheduledSessions.map(renderSessionCard)}
            </div>
          ) : (
            renderEmptyState(
              "Nenhuma sessão agendada",
              "Não há sessões agendadas no momento.",
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSessions.length > 0 ? (
            <div className="grid gap-4">
              {completedSessions.map(renderSessionCard)}
            </div>
          ) : (
            renderEmptyState(
              "Nenhuma sessão concluída",
              "As sessões concluídas aparecerão aqui.",
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )
          )}
        </TabsContent>

        <TabsContent value="noshow" className="space-y-4">
          {noShowSessions.length > 0 ? (
            <div className="grid gap-4">
              {noShowSessions.map(renderSessionCard)}
            </div>
          ) : (
            renderEmptyState(
              "Nenhum no-show registrado",
              "Sessões perdidas por ausência do aluno aparecerão aqui.",
              <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )
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
        onUpdate={onUpdateSession}
      />
    </div>
  );
};
