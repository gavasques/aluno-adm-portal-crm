import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  FileText, 
  Download,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMentoring } from '@/hooks/useMentoring';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { SessionDetailDialog } from '@/components/admin/mentoring/sessions/SessionDetailDialog';

const MentoringDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enrollments, sessions, materials } = useMentoring();
  const [viewingSession, setViewingSession] = useState<any>(null);

  const enrollment = enrollments?.find(e => e.id === id);
  const enrollmentSessions = sessions?.filter(s => s.enrollmentId === id) || [];
  const enrollmentMaterials = materials?.filter(m => m.enrollmentId === id) || [];

  const breadcrumbItems = [
    { label: 'Portal do Aluno', href: '/student' },
    { label: 'Minhas Mentorias', href: '/student/mentorias' },
    { label: enrollment?.mentoring.name || 'Mentoria' }
  ];

  if (!enrollment) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mentoria não encontrada</h1>
          <Button onClick={() => navigate('/student/mentorias')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Mentorias
          </Button>
        </div>
      </div>
    );
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return AlertCircle;
      case 'agendada': return Calendar;
      case 'concluida': return CheckCircle;
      case 'cancelada': return XCircle;
      case 'reagendada': return AlertCircle;
      case 'no_show_aluno': return XCircle;
      case 'no_show_mentor': return XCircle;
      default: return AlertCircle;
    }
  };

  const formatSafeDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  // Calcular progresso
  const completedSessions = enrollmentSessions.filter(s => s.status === 'concluida').length;
  const totalSessions = enrollment.totalSessions;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  // Separar sessões por status para as abas
  const waitingSessions = enrollmentSessions.filter(s => s.status === 'aguardando_agendamento');
  const scheduledSessions = enrollmentSessions.filter(s => s.status === 'agendada');
  const completedSessionsList = enrollmentSessions.filter(s => s.status === 'concluida');
  const problemSessions = enrollmentSessions.filter(s => 
    ['cancelada', 'no_show_aluno', 'no_show_mentor'].includes(s.status)
  );

  const renderSessionCard = (session: any) => {
    const StatusIcon = getStatusIcon(session.status);
    
    return (
      <Card 
        key={session.id} 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setViewingSession(session)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-gray-500">
                  Sessão {enrollmentSessions.indexOf(session) + 1} de {totalSessions}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(session.status)}>
              <StatusIcon className="h-3 w-3 mr-1" />
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
                Entrar na Sessão
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
              <Eye className="h-3 w-3 mr-1" />
              Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />

      {/* Header da Mentoria */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{enrollment.mentoring.name}</h1>
            <p className="text-blue-100 mb-4">{enrollment.mentoring.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Início: {format(new Date(enrollment.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Mentor: {enrollment.responsibleMentor}</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>{enrollment.mentoring.type}</span>
              </div>
            </div>
          </div>
          <Badge className={`${enrollment.status === 'ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-sm px-3 py-1`}>
            {enrollment.status === 'ativa' ? 'Ativa' : enrollment.status}
          </Badge>
        </div>
      </div>

      {/* Cards de Progresso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
            <div className="text-sm text-gray-600">Total de Sessões</div>
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
            <div className="text-2xl font-bold text-yellow-600">{scheduledSessions.length}</div>
            <div className="text-sm text-gray-600">Agendadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-600">Progresso</div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Progresso */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso da Mentoria</span>
            <span className="text-sm text-gray-600">{completedSessions}/{totalSessions} sessões</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Abas de Sessões */}
      <Tabs defaultValue="scheduled" className="w-full">
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
            Concluídas ({completedSessionsList.length})
          </TabsTrigger>
          <TabsTrigger value="problems" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Problemas ({problemSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waiting" className="space-y-4">
          {waitingSessions.length > 0 ? (
            <div className="grid gap-4">
              {waitingSessions.map(renderSessionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sessão aguardando</h3>
                <p className="text-gray-600">Todas as sessões foram agendadas.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledSessions.length > 0 ? (
            <div className="grid gap-4">
              {scheduledSessions.map(renderSessionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sessão agendada</h3>
                <p className="text-gray-600">Não há sessões agendadas no momento.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSessionsList.length > 0 ? (
            <div className="grid gap-4">
              {completedSessionsList.map(renderSessionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sessão concluída</h3>
                <p className="text-gray-600">As sessões concluídas aparecerão aqui.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="problems" className="space-y-4">
          {problemSessions.length > 0 ? (
            <div className="grid gap-4">
              {problemSessions.map(renderSessionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum problema registrado</h3>
                <p className="text-gray-600">Todas as sessões foram realizadas com sucesso.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Materiais da Mentoria */}
      {enrollmentMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Materiais da Mentoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {enrollmentMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{material.fileName}</div>
                      {material.description && (
                        <div className="text-sm text-gray-600">{material.description}</div>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Detalhes da Sessão */}
      <SessionDetailDialog
        session={viewingSession}
        open={!!viewingSession}
        onOpenChange={(open) => {
          if (!open) setViewingSession(null);
        }}
        onUpdate={() => {}} // Student view - no update capability
      />
    </div>
  );
};

export default MentoringDetail;
