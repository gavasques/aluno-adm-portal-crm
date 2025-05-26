
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  BookOpen,
  UserCheck,
  Users2
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { mockMentoringStats, mockStudentEnrollments, mockMentoringSessions } from '@/data/mentoringData';

const AdminMentoringDashboard = () => {
  const navigate = useNavigate();
  const { catalogs, enrollments, sessions } = useMentoring();

  const stats = mockMentoringStats;
  const recentEnrollments = mockStudentEnrollments.slice(0, 5);
  const upcomingSessions = mockMentoringSessions
    .filter(s => s.status === 'agendada' && new Date(s.scheduledDate) >= new Date())
    .slice(0, 5);

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Mentorias</h1>
          <p className="text-gray-600 mt-1">Dashboard completo das mentorias e alunos</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/admin/mentorias/catalogo')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Ver Catálogo
          </Button>
          <Button onClick={() => navigate('/admin/inscricoes-individuais')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Inscrição
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Inscrições</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% este mês
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEnrollments}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  {Math.round((stats.activeEnrollments / stats.totalEnrollments) * 100)}% do total
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessões Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {stats.upcomingSessions} agendadas
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
                <p className="text-sm font-medium text-gray-600">Materiais Enviados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <FileText className="h-3 w-3 mr-1" />
                  Avaliação: {stats.averageRating}/5
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/mentorias/catalogo')}>
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Catálogo de Mentorias</h3>
            <p className="text-sm text-gray-600">Gerencie o catálogo de mentorias disponíveis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/inscricoes-individuais')}>
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-green-100 rounded-lg inline-block mb-4">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inscrições Individuais</h3>
            <p className="text-sm text-gray-600">Gerencie inscrições em mentorias individuais</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/inscricoes-grupo')}>
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-purple-100 rounded-lg inline-block mb-4">
              <Users2 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inscrições em Grupo</h3>
            <p className="text-sm text-gray-600">Gerencie inscrições em mentorias em grupo</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/mentorias/sessoes-individuais')}>
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-orange-100 rounded-lg inline-block mb-4">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sessões Individuais</h3>
            <p className="text-sm text-gray-600">Agende e gerencie sessões individuais</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/mentorias/sessoes-grupo')}>
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-red-100 rounded-lg inline-block mb-4">
              <Clock className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sessões em Grupo</h3>
            <p className="text-sm text-gray-600">Agende e gerencie sessões em grupo</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="enrollments">Inscrições Recentes</TabsTrigger>
          <TabsTrigger value="sessions">Próximas Sessões</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/inscricoes-individuais')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Inscrições Individuais
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/inscricoes-grupo')}
                >
                  <Users2 className="h-4 w-4 mr-2" />
                  Gerenciar Inscrições em Grupo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/mentorias/sessoes-individuais')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Sessões
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/mentorias/catalogo')}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Catálogo de Mentorias
                </Button>
              </CardContent>
            </Card>

            {/* Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Status das Mentorias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {enrollments.filter(e => e.status === 'ativa').length}
                    </p>
                    <p className="text-sm text-green-600">Ativas</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {enrollments.filter(e => e.status === 'concluida').length}
                    </p>
                    <p className="text-sm text-blue-600">Concluídas</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {enrollments.filter(e => e.status === 'pausada').length}
                    </p>
                    <p className="text-sm text-yellow-600">Pausadas</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {enrollments.filter(e => e.status === 'cancelada').length}
                    </p>
                    <p className="text-sm text-red-600">Canceladas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inscrições Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{enrollment.mentoring.name}</h4>
                        <p className="text-sm text-gray-500">Mentor: {enrollment.responsibleMentor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {enrollment.status}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        {enrollment.sessionsUsed}/{enrollment.totalSessions} sessões
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Sessões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(session.scheduledDate).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(session.scheduledDate).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1 capitalize">
                        {session.type}
                      </Badge>
                      <p className="text-sm text-gray-500">{session.durationMinutes} min</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMentoringDashboard;
