import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  MessageSquare,
  Play,
  ExternalLink,
  Download,
  Upload,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMentoring } from '@/hooks/useMentoring';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

const MentoringSession = () => {
  const { id } = useParams();
  const { sessions, enrollments, materials } = useMentoring();
  const [studentNotes, setStudentNotes] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const session = sessions?.find(s => s.id === id);
  const enrollment = session ? enrollments?.find(e => e.id === session.enrollmentId) : null;
  const sessionMaterials = materials?.filter(m => m.sessionId === id) || [];

  const breadcrumbItems = [
    { label: 'Portal do Aluno', href: '/student' },
    { label: 'Minhas Mentorias', href: '/student/mentorias' },
    { label: enrollment?.mentoring.name || 'Mentoria', href: `/student/mentorias/${enrollment?.id}` },
    { label: session?.title || 'Sessão' }
  ];

  if (!session || !enrollment) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sessão não encontrada</h1>
          <Button onClick={() => window.history.back()}>
            Voltar
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

  const StatusIcon = getStatusIcon(session.status);
  const canJoinSession = session.status === 'agendada' && session.meetingLink;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />

      {/* Header da Sessão */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{session.title}</h1>
            <p className="text-blue-100 mb-4">Mentoria: {enrollment.mentoring.name}</p>
            <div className="flex items-center gap-4 text-sm">
              {session.scheduledDate && (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatSafeDate(session.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.durationMinutes} minutos</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>{session.type === 'individual' ? 'Individual' : 'Grupo'}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(session.status)} text-sm px-3 py-1`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {getStatusLabel(session.status)}
          </Badge>
        </div>

        {/* Botão de Entrar na Sessão */}
        {canJoinSession && (
          <div className="mt-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => window.open(session.meetingLink, '_blank')}
            >
              <Play className="h-5 w-5 mr-2" />
              Entrar na Sessão
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações da Sessão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Informações da Sessão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mentor</label>
                  <p className="text-gray-900">{enrollment.responsibleMentor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duração</label>
                  <p className="text-gray-900">{session.durationMinutes} minutos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">{session.type === 'individual' ? 'Individual' : 'Grupo'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={getStatusColor(session.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {getStatusLabel(session.status)}
                  </Badge>
                </div>
              </div>

              {session.calendlyLink && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Link de Agendamento</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(session.calendlyLink, '_blank')}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Agendar no Calendly
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {session.recordingLink && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Gravação da Sessão</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(session.recordingLink, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Assistir Gravação
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notas do Mentor */}
          {session.mentorNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notas do Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-800">{session.mentorNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transcrição */}
          {session.transcription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transcrição da Sessão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap">{session.transcription}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Minhas Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Minhas Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Adicione suas anotações sobre esta sessão..."
                value={session.studentNotes || studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                rows={4}
                className="mb-3"
              />
              <Button size="sm">
                Salvar Notas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Materiais da Sessão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessionMaterials.length > 0 ? (
                <div className="space-y-3">
                  {sessionMaterials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">{material.fileName}</div>
                          {material.description && (
                            <div className="text-xs text-gray-500">{material.description}</div>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum material disponível</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canJoinSession && (
                <Button 
                  className="w-full"
                  onClick={() => window.open(session.meetingLink, '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Entrar na Sessão
                </Button>
              )}
              
              {session.status === 'concluida' && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowFeedback(true)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar Sessão
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Enviar Arquivo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de Feedback */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Sessão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Como você avalia esta sessão de mentoria?
            </p>
            {/* Aqui você pode adicionar um sistema de avaliação com estrelas */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFeedback(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowFeedback(false)}>
                Enviar Avaliação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentoringSession;
