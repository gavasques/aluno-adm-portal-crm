
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, BookOpen, ArrowRight, Play, FileText } from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentMentoring = () => {
  const navigate = useNavigate();
  const { getMyEnrollments, getMyUpcomingSessions, getEnrollmentProgress } = useMentoring();
  
  // Mock do usuário atual
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
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Mentorias</h1>
          <p className="text-gray-600 mt-1">Acompanhe seu progresso e gerencie suas sessões</p>
        </div>
      </div>

      {/* Stats Cards */}
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
                <GraduationCap className="h-6 w-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Sessões Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myEnrollments.reduce((acc, e) => acc + e.sessionsUsed, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Play className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myEnrollments.filter(e => e.status === 'concluida').length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              {upcomingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {session.type === 'individual' ? <Users className="h-4 w-4 text-blue-600" /> : <Users className="h-4 w-4 text-blue-600" />}
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
                        <Badge variant="outline" className="capitalize">
                          {session.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/aluno/mentorias/${session.enrollmentId}/sessao/${session.id}`)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Minhas Mentorias */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Minhas Mentorias</h2>
        
        {myEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mentoria encontrada</h3>
              <p className="text-gray-500">Você ainda não está inscrito em nenhuma mentoria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myEnrollments.map((enrollment) => {
              const progress = getEnrollmentProgress(enrollment);
              
              return (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(enrollment.mentoring.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{enrollment.mentoring.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Mentor: {enrollment.responsibleMentor}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progresso */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{enrollment.sessionsUsed}/{enrollment.totalSessions} sessões</span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{progress.sessionsRemaining} sessões restantes</span>
                          <span>{progress.daysRemaining} dias restantes</span>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Tipo:</span>
                          <p className="font-medium">{enrollment.mentoring.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duração:</span>
                          <p className="font-medium">{enrollment.mentoring.durationWeeks} semanas</p>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/aluno/mentorias/${enrollment.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                        {enrollment.status === 'ativa' && (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => navigate(`/aluno/mentorias/${enrollment.id}`)}
                          >
                            Acessar Mentoria
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMentoring;
