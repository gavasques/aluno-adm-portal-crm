
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  MessageSquare, 
  Download,
  ExternalLink,
  Play
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentMentoringSession = () => {
  const { enrollmentId, sessionId } = useParams<{ enrollmentId: string; sessionId: string }>();
  const navigate = useNavigate();
  const { getSessionDetails, getMyEnrollments } = useMentoring();

  // Mock do usuário atual
  const currentUserId = 'user-1';
  
  const session = getSessionDetails(sessionId || '');
  const enrollment = getMyEnrollments(currentUserId).find(e => e.id === enrollmentId);

  if (!session || !enrollment) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Sessão não encontrada</h2>
            <p className="text-gray-500 mb-4">A sessão que você está procurando não existe ou não está disponível.</p>
            <Button onClick={() => navigate('/aluno/mentorias')}>
              Voltar para Mentorias
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isUpcoming = session.status === 'agendada' && new Date(session.scheduledDate) >= new Date();
  const isCompleted = session.status === 'realizada';

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/aluno/mentorias/${enrollmentId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Mentoria
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
          <p className="text-gray-600 mt-1">{enrollment.mentoring.name}</p>
        </div>
        <Badge className={getStatusColor(session.status)}>
          {session.status}
        </Badge>
      </div>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Data e Hora</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {format(new Date(session.scheduledDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <Clock className="h-4 w-4 text-gray-400 ml-2" />
                  <span className="text-gray-900">
                    {format(new Date(session.scheduledDate), 'HH:mm')}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Duração</label>
                <p className="text-gray-900 mt-1">{session.durationMinutes} minutos</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Tipo</label>
                <Badge variant="outline" className="mt-1 capitalize">
                  {session.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Mentor Responsável</label>
                <p className="text-gray-900 mt-1">{enrollment.responsibleMentor}</p>
              </div>

              {session.mentorNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notas do Mentor</label>
                  <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-md">
                    {session.mentorNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Access Link */}
        {session.accessLink && isUpcoming && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Video className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Acessar Sessão</h3>
                    <p className="text-sm text-gray-500">Link para participar da sessão</p>
                  </div>
                </div>
                <Button asChild>
                  <a href={session.accessLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Entrar
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recording Link */}
        {session.recordingLink && isCompleted && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Play className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Gravação</h3>
                    <p className="text-sm text-gray-500">Assista novamente à sessão</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <a href={session.recordingLink} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 mr-2" />
                    Assistir
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Student Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Minhas Anotações da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva suas anotações sobre esta sessão..."
              defaultValue={session.studentNotes || ''}
              className="min-h-32"
            />
            <Button>Salvar Anotações</Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Materiais da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-8">
              Nenhum material disponível para esta sessão ainda.
            </p>
            {/* Aqui seria listados os materiais específicos desta sessão */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMentoringSession;
