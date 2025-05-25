import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Download, 
  Video, 
  Play,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { useSecureMentoring } from '@/hooks/useSecureMentoring';
import { useMentoring } from '@/hooks/useMentoring';
import MentoringRouteGuard from '@/components/RouteGuards/MentoringRouteGuard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentMentoringDetail = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const { getEnrollmentProgress } = useMentoring();
  const { 
    getSecureEnrollmentDetails,
    getSecureEnrollmentSessions, 
    getSecureEnrollmentMaterials 
  } = useSecureMentoring();

  if (!enrollmentId) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">ID da mentoria não fornecido</h2>
            <Button onClick={() => navigate('/aluno/mentorias')}>
              Voltar para Mentorias
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const enrollment = getSecureEnrollmentDetails(enrollmentId);
  const sessions = getSecureEnrollmentSessions(enrollmentId);
  const materials = getSecureEnrollmentMaterials(enrollmentId);

  if (!enrollment) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Mentoria não encontrada</h2>
            <p className="text-gray-500 mb-4">A mentoria que você está procurando não existe ou você não tem acesso a ela.</p>
            <Button onClick={() => navigate('/aluno/mentorias')}>
              Voltar para Mentorias
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = getEnrollmentProgress(enrollment);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <MentoringRouteGuard requireEnrollmentAccess={true}>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/aluno/mentorias')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Mentorias
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{enrollment.mentoring.name}</h1>
            <p className="text-gray-600 mt-1">{enrollment.mentoring.description}</p>
          </div>
          <Badge className={getStatusColor(enrollment.status)}>
            {enrollment.status}
          </Badge>
        </div>

        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resumo da Mentoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Mentor Responsável</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{enrollment.responsibleMentor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Mentoria</label>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {enrollment.mentoring.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Período</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      {format(new Date(enrollment.startDate), 'dd/MM/yyyy')} - {format(new Date(enrollment.endDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Duração</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{enrollment.mentoring.durationWeeks} semanas</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Progresso das Sessões</label>
                  <div className="mt-2 space-y-2">
                    <Progress value={progress.percentage} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{enrollment.sessionsUsed} de {enrollment.totalSessions} sessões</span>
                      <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {progress.sessionsRemaining} sessões restantes • {progress.daysRemaining} dias
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {enrollment.observations && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Observações</label>
                <p className="text-gray-700 mt-1">{enrollment.observations}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Histórico de Sessões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/aluno/mentorias/${enrollmentId}/sessoes/${session.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Video className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <p className="text-sm text-gray-500">
                            {format(new Date(session.scheduledDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                          <p className="text-xs text-gray-400">{session.durationMinutes} minutos</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getSessionStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        
                        {session.status === 'agendada' && session.accessLink && (
                          <Button size="sm" onClick={(e) => {
                            e.stopPropagation();
                            window.open(session.accessLink, '_blank');
                          }}>
                            <Play className="h-4 w-4 mr-2" />
                            Entrar
                          </Button>
                        )}
                        
                        {session.status === 'realizada' && session.recordingLink && (
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            window.open(session.recordingLink, '_blank');
                          }}>
                            <Play className="h-4 w-4 mr-2" />
                            Gravação
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {sessions.length === 0 && (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma sessão agendada ainda</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Materiais da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{material.fileName}</h4>
                          <p className="text-sm text-gray-500">{material.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-400">{material.sizeMB} MB</span>
                            <span className="text-xs text-gray-400">
                              {format(new Date(material.createdAt), 'dd/MM/yyyy')}
                            </span>
                            {material.uploaderType && (
                              <Badge variant="outline" className="text-xs">
                                {material.uploaderType}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                  
                  {materials.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum material disponível ainda</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MentoringRouteGuard>
  );
};

export default StudentMentoringDetail;
