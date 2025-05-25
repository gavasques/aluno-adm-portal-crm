
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Users, 
  Clock, 
  Download,
  Play,
  BookOpen,
  Star
} from 'lucide-react';
import { useSecureMentoring } from '@/hooks/useSecureMentoring';
import { useMentoring } from '@/hooks/useMentoring';
import LoadingSpinner from '@/components/mentoring/LoadingSpinner';
import ErrorMessage from '@/components/mentoring/ErrorMessage';
import EmptyState from '@/components/mentoring/EmptyState';

const StudentMentoringDetail = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    getSecureEnrollmentDetails,
    getSecureEnrollmentSessions,
    getSecureEnrollmentMaterials,
    verifyEnrollmentOwnership,
    loading,
    error,
    clearError,
    isAuthenticated
  } = useSecureMentoring();
  
  const { getEnrollmentProgress } = useMentoring();

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    navigate('/');
    return null;
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <LoadingSpinner size="lg" message="Carregando detalhes da mentoria..." />
      </div>
    );
  }

  // Show error or access denied
  if (error || !enrollmentId || !verifyEnrollmentOwnership(enrollmentId)) {
    return (
      <div className="container mx-auto py-6">
        <ErrorMessage 
          title="Acesso Negado"
          message={error || "Você não tem permissão para acessar esta mentoria."}
          onRetry={() => {
            clearError();
            navigate('/aluno/mentorias');
          }}
        />
      </div>
    );
  }

  const enrollment = getSecureEnrollmentDetails(enrollmentId);
  const sessions = getSecureEnrollmentSessions(enrollmentId);
  const materials = getSecureEnrollmentMaterials(enrollmentId);

  if (!enrollment) {
    return (
      <div className="container mx-auto py-6">
        <ErrorMessage 
          title="Mentoria não encontrada"
          message="Esta mentoria não foi encontrada ou você não tem acesso a ela."
          onRetry={() => navigate('/aluno/mentorias')}
        />
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/aluno/mentorias')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{enrollment.mentoring.name}</h1>
          <p className="text-gray-600 mt-1">Detalhes e materiais da sua mentoria</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge className={getStatusColor(enrollment.status)}>
                  {enrollment.status}
                </Badge>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(progress.percentage)}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessões</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollment.sessionsUsed}/{enrollment.totalSessions}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dias Restantes</p>
                <p className="text-2xl font-bold text-gray-900">{progress.daysRemaining}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Progresso da Mentoria</h3>
              <span className="text-sm text-gray-600">{Math.round(progress.percentage)}% concluído</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all" 
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Mentor: {enrollment.responsibleMentor}</span>
              <span>Tipo: {enrollment.mentoring.type}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sessions">Sessões ({sessions.length})</TabsTrigger>
          <TabsTrigger value="materials">Materiais ({materials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Mentoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome da Mentoria</label>
                  <p className="text-gray-900">{enrollment.mentoring.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo</label>
                  <p className="text-gray-900">{enrollment.mentoring.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Início</label>
                  <p className="text-gray-900">
                    {new Date(enrollment.startDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Término</label>
                  <p className="text-gray-900">
                    {new Date(enrollment.endDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mentor Responsável</label>
                  <p className="text-gray-900">{enrollment.responsibleMentor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total de Sessões</label>
                  <p className="text-gray-900">{enrollment.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          {sessions.length === 0 ? (
            <EmptyState type="sessions" />
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">{session.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(session.scheduledDate).toLocaleDateString('pt-BR', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.durationMinutes}min</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {session.status === 'agendada' && (
                          <Button
                            onClick={() => navigate(`/aluno/mentorias/${enrollmentId}/sessoes/${session.id}`)}
                            className="flex items-center gap-2"
                          >
                            <Play className="h-4 w-4" />
                            Acessar
                          </Button>
                        )}
                        {session.status === 'realizada' && (
                          <Button 
                            variant="outline"
                            onClick={() => navigate(`/aluno/mentorias/${enrollmentId}/sessoes/${session.id}`)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          {materials.length === 0 ? (
            <EmptyState type="materials" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-2">{material.fileName}</h3>
                          {material.description && (
                            <p className="text-sm text-gray-600">{material.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{material.sizeMB} MB</span>
                        <span>{new Date(material.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      <Button className="w-full flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentMentoringDetail;
