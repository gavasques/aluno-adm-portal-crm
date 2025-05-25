
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Clock, 
  ChevronRight,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSecureMentoring } from '@/hooks/useSecureMentoring';
import { useMentoring } from '@/hooks/useMentoring';
import LoadingSpinner from '@/components/mentoring/LoadingSpinner';
import ErrorMessage from '@/components/mentoring/ErrorMessage';
import EmptyState from '@/components/mentoring/EmptyState';

const StudentMentoring = () => {
  const navigate = useNavigate();
  const { 
    getMySecureEnrollments,
    getMySecureUpcomingSessions,
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
        <LoadingSpinner size="lg" message="Carregando suas mentorias..." />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <ErrorMessage 
          message={error}
          onRetry={() => {
            clearError();
            window.location.reload();
          }}
        />
      </div>
    );
  }

  const enrollments = getMySecureEnrollments;
  const upcomingSessions = getMySecureUpcomingSessions;

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Mentorias</h1>
        <p className="text-gray-600 mt-1">Acompanhe seu progresso e acesse materiais</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'ativa').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'concluida').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
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
              <Calendar className="h-5 w-5" />
              Próximas Sessões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.scheduledDate).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Acessar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Minhas Inscrições ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <EmptyState type="enrollments" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const progress = getEnrollmentProgress(enrollment);
                return (
                  <Card key={enrollment.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/aluno/mentorias/${enrollment.id}`)}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {enrollment.mentoring.name}
                            </h3>
                            <Badge className={getStatusColor(enrollment.status)}>
                              {enrollment.status}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{enrollment.responsibleMentor}</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{Math.round(progress.percentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all" 
                                style={{ width: `${progress.percentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{enrollment.sessionsUsed}/{enrollment.totalSessions} sessões</span>
                              <span>{progress.daysRemaining} dias restantes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMentoring;
