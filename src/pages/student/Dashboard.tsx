
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Wrench, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Bell,
  ChevronRight,
  Star,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSecureMentoring } from "@/hooks/useSecureMentoring";
import { useMentoring } from "@/hooks/useMentoring";
import LoadingSpinner from "@/components/mentoring/LoadingSpinner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    getMySecureEnrollments,
    getMySecureUpcomingSessions,
    loading,
    isAuthenticated
  } = useSecureMentoring();
  const { getEnrollmentProgress } = useMentoring();

  // Show loading if auth is loading
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <LoadingSpinner size="lg" message="Carregando dashboard..." />
      </div>
    );
  }

  // If not authenticated, don't show mentoring data
  const enrollments = isAuthenticated ? getMySecureEnrollments : [];
  const upcomingSessions = isAuthenticated ? getMySecureUpcomingSessions : [];

  const activeEnrollments = enrollments.filter(e => e.status === 'ativa');
  const completedEnrollments = enrollments.filter(e => e.status === 'concluida');

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de controle</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => navigate('/aluno/fornecedores')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fornecedores</p>
                <p className="text-2xl font-bold text-gray-900">150+</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => navigate('/aluno/parceiros')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Parceiros</p>
                <p className="text-2xl font-bold text-gray-900">50+</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => navigate('/aluno/ferramentas')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ferramentas</p>
                <p className="text-2xl font-bold text-gray-900">30+</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => navigate('/aluno/mentorias')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{activeEnrollments.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentoring Section - Only show if authenticated */}
      {isAuthenticated && (
        <>
          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Sessões
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/aluno/mentorias')}>
                  Ver todas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.scheduledDate).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {session.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Mentorings */}
          {activeEnrollments.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Mentorias em Andamento
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/aluno/mentorias')}>
                  Ver todas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeEnrollments.slice(0, 4).map((enrollment) => {
                    const progress = getEnrollmentProgress(enrollment);
                    return (
                      <div 
                        key={enrollment.id} 
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/aluno/mentorias/${enrollment.id}`)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{enrollment.mentoring.name}</h3>
                              <p className="text-sm text-gray-600">{enrollment.responsibleMentor}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
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
                              <span>{progress.daysRemaining} dias</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Mentorings */}
          {completedEnrollments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Mentorias Concluídas ({completedEnrollments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {completedEnrollments.slice(0, 3).map((enrollment) => (
                    <div 
                      key={enrollment.id} 
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-green-50"
                      onClick={() => navigate(`/aluno/mentorias/${enrollment.id}`)}
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium">{enrollment.mentoring.name}</h3>
                        <p className="text-sm text-gray-600">{enrollment.responsibleMentor}</p>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Concluída
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/aluno/meus-fornecedores')}
            >
              <Users className="h-6 w-6" />
              <span>Meus Fornecedores</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/aluno/fornecedores')}
            >
              <Building2 className="h-6 w-6" />
              <span>Buscar Fornecedores</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/aluno/ferramentas')}
            >
              <Wrench className="h-6 w-6" />
              <span>Explorar Ferramentas</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/aluno/mentorias')}
            >
              <BookOpen className="h-6 w-6" />
              <span>Minhas Mentorias</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Bem-vindo ao Portal do Aluno</p>
                <p className="text-sm text-gray-600">Explore todas as funcionalidades disponíveis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
