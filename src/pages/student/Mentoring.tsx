
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  FileText, 
  Video,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMentoring } from '@/hooks/useMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentMentoring = () => {
  const navigate = useNavigate();
  const { getMyEnrollments, getMyUpcomingSessions, getEnrollmentProgress } = useMentoring();
  
  // Mock do usuário atual - em um ambiente real viria do contexto de auth
  const currentUserId = 'user-1';
  
  const myEnrollments = getMyEnrollments(currentUserId);
  const upcomingSessions = getMyUpcomingSessions(currentUserId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Individual': return <Users className="h-4 w-4" />;
      case 'Grupo': return <Users className="h-4 w-4" />;
      case 'Premium': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Mentorias</h1>
          <p className="text-gray-600 mt-1">Acompanhe seu progresso e próximas sessões</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myEnrollments.filter(e => e.status === 'ativa').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Próximas Sessões</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingSessions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessões Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myEnrollments.reduce((acc, e) => acc + e.sessionsUsed, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materiais</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximas Sessões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(session.scheduledDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {session.type}
                    </Badge>
                    {session.accessLink && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Entrar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Enrollments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myEnrollments.map((enrollment) => {
          const progress = getEnrollmentProgress(enrollment);
          
          return (
            <Card 
              key={enrollment.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/aluno/mentorias/${enrollment.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(enrollment.mentoring.type)}
                    <CardTitle className="text-lg">{enrollment.mentoring.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(enrollment.status)}>
                    {enrollment.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {enrollment.responsibleMentor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {enrollment.mentoring.durationWeeks} semanas
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso das Sessões</span>
                    <span>{enrollment.sessionsUsed}/{enrollment.totalSessions}</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {progress.sessionsRemaining} sessões restantes • {progress.daysRemaining} dias
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-600">
                    <p>Início: {format(new Date(enrollment.startDate), 'dd/MM/yyyy')}</p>
                    <p>Término: {format(new Date(enrollment.endDate), 'dd/MM/yyyy')}</p>
                  </div>
                  
                  {progress.isExpired && (
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Expirada
                    </Badge>
                  )}
                  
                  {progress.isCompleted && !progress.isExpired && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Concluída
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {myEnrollments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mentoria encontrada</h3>
            <p className="text-gray-500 mb-4">
              Você ainda não está inscrito em nenhuma mentoria.
            </p>
            <Button onClick={() => navigate('/aluno/fornecedores')}>
              Explorar Mentorias
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentMentoring;
