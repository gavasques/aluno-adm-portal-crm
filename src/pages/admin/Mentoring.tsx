
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, Users, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { useMentoringReadQueries } from '@/features/mentoring/hooks/useMentoringReadQueries';

const AdminMentoring = () => {
  const { useCatalogs, useEnrollments, useSessions } = useMentoringReadQueries();
  
  const { data: catalogs = [], isLoading: catalogsLoading } = useCatalogs();
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useEnrollments();
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();

  // Calcular estatísticas
  const activeCatalogs = catalogs.filter(c => c.active).length;
  const activeEnrollments = enrollments.filter(e => e.status === 'ativa').length;
  const todaySessions = sessions.filter(s => {
    if (!s.scheduledDate) return false;
    const today = new Date().toDateString();
    const sessionDate = new Date(s.scheduledDate).toDateString();
    return sessionDate === today;
  }).length;
  const totalMaterials = 156; // Placeholder até implementar materiais

  const isLoading = catalogsLoading || enrollmentsLoading || sessionsLoading;

  console.log('📊 Dashboard stats:', {
    totalCatalogs: catalogs.length,
    activeCatalogs,
    totalEnrollments: enrollments.length,
    activeEnrollments,
    totalSessions: sessions.length,
    todaySessions
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Mentorias</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de mentorias
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Mentorias Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : activeCatalogs}
            </div>
            <p className="text-xs text-muted-foreground">
              De {catalogs.length} totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Alunos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : activeEnrollments}
            </div>
            <p className="text-xs text-muted-foreground">
              Participando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Sessões Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : todaySessions}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">
              Disponíveis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas detalhadas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Resumo de Catálogos
            </CardTitle>
            <CardDescription>
              Distribuição dos tipos de mentorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Individual</span>
                <span className="font-medium">
                  {catalogs.filter(c => c.type === 'Individual').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Grupo</span>
                <span className="font-medium">
                  {catalogs.filter(c => c.type === 'Grupo').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ativas</span>
                <span className="font-medium text-green-600">
                  {activeCatalogs}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inativas</span>
                <span className="font-medium text-gray-500">
                  {catalogs.length - activeCatalogs}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Status das Inscrições
            </CardTitle>
            <CardDescription>
              Situação atual dos alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ativas</span>
                <span className="font-medium text-green-600">
                  {enrollments.filter(e => e.status === 'ativa').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pausadas</span>
                <span className="font-medium text-yellow-600">
                  {enrollments.filter(e => e.status === 'pausada').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Concluídas</span>
                <span className="font-medium text-blue-600">
                  {enrollments.filter(e => e.status === 'concluida').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Canceladas</span>
                <span className="font-medium text-red-600">
                  {enrollments.filter(e => e.status === 'cancelada').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Mentorias</CardTitle>
          <CardDescription>
            Funcionalidades disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            O sistema de mentorias está ativo com as seguintes funcionalidades:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Dashboard completo de mentorias ✅</li>
            <li>Catálogo de mentorias disponíveis ✅</li>
            <li>Gestão de inscrições individuais e em grupo ✅</li>
            <li>Upload e gestão de materiais 🚧</li>
            <li>Agendamento de sessões ✅</li>
            <li>Relatórios e analytics 🚧</li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            ✅ Implementado | 🚧 Em desenvolvimento
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoring;
