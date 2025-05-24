
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMentoring } from '@/hooks/useMentoring';
import { CardStats } from '@/components/ui/card-stats';

const AdminMentoringManagement = () => {
  const navigate = useNavigate();
  const { catalogs, enrollments, sessions, materials } = useMentoring();

  // Calcular estatísticas
  const activeEnrollments = enrollments.filter(e => e.status === 'ativa').length;
  const completedSessions = sessions.filter(s => s.status === 'realizada').length;
  const upcomingSessions = sessions.filter(s => s.status === 'agendada').length;
  const totalMaterials = materials.length;

  const navigationCards = [
    {
      title: 'Catálogo de Mentorias',
      description: 'Gerencie produtos e pacotes de mentoria',
      icon: BookOpen,
      count: catalogs.length,
      href: '/admin/mentorias/catalogo',
      color: 'bg-blue-500',
      badge: `${catalogs.filter(c => c.active).length} ativas`
    },
    {
      title: 'Inscrições de Alunos',
      description: 'Acompanhe todas as inscrições ativas',
      icon: Users,
      count: activeEnrollments,
      href: '/admin/mentorias/inscricoes',
      color: 'bg-green-500',
      badge: `${enrollments.length} total`
    },
    {
      title: 'Sessões Agendadas',
      description: 'Gerencie sessões e agendamentos',
      icon: Calendar,
      count: upcomingSessions,
      href: '/admin/mentorias/sessoes',
      color: 'bg-purple-500',
      badge: `${completedSessions} realizadas`
    },
    {
      title: 'Central de Materiais',
      description: 'Todos os materiais e anexos',
      icon: FileText,
      count: totalMaterials,
      href: '/admin/mentorias/materiais',
      color: 'bg-orange-500',
      badge: `${materials.reduce((acc, m) => acc + m.sizeMB, 0).toFixed(1)} MB`
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Mentorias</h1>
          <p className="text-gray-600 mt-1">Central de controle para todo o sistema de mentorias</p>
        </div>
        <Button onClick={() => navigate('/admin/mentorias/catalogo')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Mentoria
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CardStats
          title="Mentorias Ativas"
          value={activeEnrollments}
          icon={<Users className="h-4 w-4" />}
          description="inscrições em andamento"
          trend="up"
          trendValue="+12%"
        />
        
        <CardStats
          title="Sessões Hoje"
          value={upcomingSessions}
          icon={<Calendar className="h-4 w-4" />}
          description="agendadas para hoje"
          trend="neutral"
        />
        
        <CardStats
          title="Materiais Enviados"
          value={totalMaterials}
          icon={<FileText className="h-4 w-4" />}
          description="arquivos no sistema"
          trend="up"
          trendValue="+8"
        />
        
        <CardStats
          title="Taxa de Conclusão"
          value="87%"
          icon={<CheckCircle className="h-4 w-4" />}
          description="sessões concluídas"
          trend="up"
          trendValue="+5%"
        />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navigationCards.map((card, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4"
            style={{ borderLeftColor: card.color.replace('bg-', '').replace('-500', '') === 'blue' ? '#3b82f6' : 
                     card.color.replace('bg-', '').replace('-500', '') === 'green' ? '#10b981' :
                     card.color.replace('bg-', '').replace('-500', '') === 'purple' ? '#8b5cf6' : '#f59e0b' }}
            onClick={() => navigate(card.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${card.color} text-white`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{card.count}</div>
                <Badge variant="secondary" className="mt-1">
                  {card.badge}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/admin/mentorias/sessoes')}
            >
              <Clock className="h-6 w-6" />
              <span>Agendar Sessão</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/admin/mentorias/inscricoes')}
            >
              <Users className="h-6 w-6" />
              <span>Nova Inscrição</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/admin/mentorias/materiais')}
            >
              <FileText className="h-6 w-6" />
              <span>Upload Material</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Sessão de E-commerce Avançado concluída</p>
                <p className="text-sm text-gray-600">João Silva - há 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nova sessão agendada para amanhã</p>
                <p className="text-sm text-gray-600">Maria Santos - Mentoria Individual - há 4 horas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-full">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Material enviado: Planilha de Análise de Concorrência</p>
                <p className="text-sm text-gray-600">Ana Costa - há 6 horas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringManagement;
