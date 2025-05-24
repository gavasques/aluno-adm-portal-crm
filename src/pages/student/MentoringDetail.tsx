
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Video, 
  Download, 
  Upload,
  MessageSquare,
  Star,
  ArrowLeft,
  Play
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentMentoringDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getMyEnrollments, 
    getEnrollmentSessions, 
    getEnrollmentMaterials, 
    getEnrollmentProgress 
  } = useMentoring();

  // Mock do usuário atual
  const currentUserId = 'user-1';
  
  const enrollment = getMyEnrollments(currentUserId).find(e => e.id === id);
  
  if (!enrollment) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Mentoria não encontrada</h2>
            <p className="text-gray-500 mb-4">A mentoria que você está procurando não existe ou não está disponível.</p>
            <Button onClick={() => navigate('/aluno/mentorias')}>
              Voltar para Mentorias
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sessions = getEnrollmentSessions(enrollment.id);
  const materials = getEnrollmentMaterials(enrollment.id);
  const progress = getEnrollmentProgress(enrollment);

  const upcomingSessions = sessions.filter(s => 
    s.status === 'agendada' && new Date(s.scheduledDate) >= new Date()
  );
  
  const completedSessions = sessions.filter(s => s.status === 'realizada');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/aluno/mentorias')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{enrollment.mentoring.name}</h1>
          <p className="text-gray-600 mt-1">Mentor: {enrollment.responsibleMentor}</p>
        </div>
        <Badge className={getStatusColor(enrollment.status)}>
          {enrollment.status}
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Mentoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Progresso Geral</p>
              <Progress value={progress.percentage} className="h-3" />
              <p className="text-sm text-gray-500">{progress.percentage.toFixed(0)}% concluído</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sessões</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrollment.sessionsUsed}/{enrollment.totalSessions}
              </p>
              <p className="text-sm text-gray-500">{progress.sessionsRemaining} restantes</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tipo</p>
              <p className="text-lg font-medium text-gray-900">{enrollment.mentoring.type}</p>
              <p className="text-sm text-gray-500">{enrollment.mentoring.durationWeeks} semanas</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Restante</p>
              <p className="text-2xl font-bold text-gray-900">{progress.daysRemaining}</p>
              <p className="text-sm text-gray-500">dias restantes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="sessoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessoes">Sessões</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="anotacoes">Anotações</TabsTrigger>
          <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
        </TabsList>

        {/* Sessões Tab */}
        <TabsContent value="sessoes" className="space-y-6">
          {/* Próximas Sessões */}
          {upcomingSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Sessões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Video className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(session.scheduledDate), "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(session.scheduledDate), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {session.accessLink && (
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Acessar
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/aluno/mentorias/${enrollment.id}/sessao/${session.id}`)}
                        >
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sessões Concluídas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sessões Concluídas ({completedSessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma sessão concluída ainda.</p>
              ) : (
                <div className="space-y-4">
                  {completedSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Video className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{format(new Date(session.scheduledDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                            <span>{session.durationMinutes} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {session.recordingLink && (
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4 mr-1" />
                            Gravação
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/aluno/mentorias/${enrollment.id}/sessao/${session.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materiais Tab */}
        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Materiais da Mentoria ({materials.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {materials.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum material disponível ainda.</p>
              ) : (
                <div className="space-y-4">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{material.fileName}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{material.sizeMB.toFixed(1)} MB</span>
                            <span>Por {material.uploaderType}</span>
                            <span>{format(new Date(material.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
                          </div>
                          {material.description && (
                            <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anotações Tab */}
        <TabsContent value="anotacoes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Minhas Anotações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Escreva suas anotações sobre esta mentoria..."
                  className="min-h-32"
                />
                <Button>Salvar Anotações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avaliação Tab */}
        <TabsContent value="avaliacao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Avaliar Mentoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nota Geral
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} className="p-1">
                        <Star className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentário sobre a mentoria
                  </label>
                  <Textarea
                    placeholder="Compartilhe sua experiência com esta mentoria..."
                    className="min-h-24"
                  />
                </div>
                
                <Button>Enviar Avaliação</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentMentoringDetail;
