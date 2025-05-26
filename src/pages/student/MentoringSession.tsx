import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { 
  ArrowLeft, 
  Video, 
  Clock, 
  Calendar, 
  FileText, 
  Download,
  ExternalLink,
  Play,
  Users,
  MessageSquare
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentMentoringSession = () => {
  const { enrollmentId, sessionId } = useParams<{ enrollmentId: string; sessionId: string }>();
  const navigate = useNavigate();
  const { getSessionDetails, getEnrollmentMaterials } = useMentoring();
  
  const session = sessionId ? getSessionDetails(sessionId) : undefined;
  const materials = enrollmentId ? getEnrollmentMaterials(enrollmentId) : [];
  const sessionMaterials = materials.filter(m => m.sessionId === sessionId);

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Sessão não encontrada</h2>
            <p className="text-gray-500 mb-4">A sessão que você está procurando não existe ou não está disponível.</p>
            <Button onClick={() => navigate(`/aluno/mentorias/${enrollmentId}`)}>
              Voltar para Mentoria
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

  const breadcrumbItems = [
    { label: 'Mentorias', href: '/aluno/mentorias' },
    { label: 'Detalhes da Mentoria', href: `/aluno/mentorias/${enrollmentId}` },
    { label: session.title }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <BreadcrumbNav items={breadcrumbItems} showBackButton />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(session.scheduledDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
        <Badge className={getStatusColor(session.status)}>
          {session.status}
        </Badge>
      </div>

      {/* Session Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Informações da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Data e Horário</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {format(new Date(session.scheduledDate), "dd/MM/yyyy 'às' HH:mm")}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Duração</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{session.durationMinutes} minutos</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <Badge variant="outline" className="capitalize">
                    {session.type}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {session.status === 'agendada' && session.meetingLink && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Acesso</label>
                  <div className="mt-2">
                    <Button 
                      onClick={() => window.open(session.meetingLink, '_blank')}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Entrar na Sessão
                    </Button>
                  </div>
                </div>
              )}

              {session.status === 'realizada' && session.recordingLink && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Gravação</label>
                  <div className="mt-2">
                    <Button 
                      variant="outline"
                      onClick={() => window.open(session.recordingLink, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Gravação
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Anotações</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {session.mentorNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Anotações do Mentor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{session.mentorNotes}</p>
                </CardContent>
              </Card>
            )}

            {session.studentNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Minhas Anotações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{session.studentNotes}</p>
                </CardContent>
              </Card>
            )}

            {!session.mentorNotes && !session.studentNotes && (
              <Card className="md:col-span-2">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma anotação disponível para esta sessão</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Materiais da Sessão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionMaterials.map((material) => (
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
                          <Badge variant="outline" className="text-xs">
                            {material.uploaderType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
                
                {sessionMaterials.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum material específico para esta sessão</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentMentoringSession;
