
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  Search,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMentoring } from '@/hooks/useMentoring';

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
      description: 'Gerencie produtos e pacotes',
      icon: BookOpen,
      count: catalogs.length,
      href: '/admin/mentorias/catalogo',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: `${catalogs.filter(c => c.active).length} ativas`,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Inscrições de Alunos',
      description: 'Acompanhe inscrições ativas',
      icon: Users,
      count: activeEnrollments,
      href: '/admin/mentorias/inscricoes',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      badge: `${enrollments.length} total`,
      badgeColor: 'bg-green-100 text-green-700'
    },
    {
      title: 'Sessões Agendadas',
      description: 'Gerencie sessões',
      icon: Calendar,
      count: upcomingSessions,
      href: '/admin/mentorias/sessoes',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badge: `${completedSessions} realizadas`,
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Central de Materiais',
      description: 'Materiais e anexos',
      icon: FileText,
      count: totalMaterials,
      href: '/admin/mentorias/materiais',
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badge: `${materials.reduce((acc, m) => acc + m.sizeMB, 0).toFixed(1)} MB`,
      badgeColor: 'bg-orange-100 text-orange-700'
    }
  ];

  return (
    <div className="container mx-auto py-4 space-y-6">
      {/* Header compacto */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <Award className="h-5 w-5 lg:h-6 w-6" />
            </div>
            Gestão de Mentorias
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">Central de controle para todo o sistema de mentorias</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar mentorias, alunos..." 
              className="pl-9 w-full sm:w-64 h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
            />
          </div>
          <Button 
            onClick={() => navigate('/admin/mentorias/catalogo')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 h-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Mentoria
          </Button>
        </div>
      </div>

      {/* Stats Cards compactos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Mentorias Ativas</p>
                <p className="text-xl lg:text-2xl font-bold text-blue-900">{activeEnrollments}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+12%</span>
                </div>
              </div>
              <div className="p-2 lg:p-3 bg-blue-500 rounded-xl">
                <Users className="h-4 w-4 lg:h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Sessões Hoje</p>
                <p className="text-xl lg:text-2xl font-bold text-green-900">{upcomingSessions}</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-xs text-gray-600">agendadas</span>
                </div>
              </div>
              <div className="p-2 lg:p-3 bg-green-500 rounded-xl">
                <Calendar className="h-4 w-4 lg:h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 mb-1">Materiais</p>
                <p className="text-xl lg:text-2xl font-bold text-purple-900">{totalMaterials}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+8 novos</span>
                </div>
              </div>
              <div className="p-2 lg:p-3 bg-purple-500 rounded-xl">
                <FileText className="h-4 w-4 lg:h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 mb-1">Taxa Conclusão</p>
                <p className="text-xl lg:text-2xl font-bold text-orange-900">87%</p>
                <div className="flex items-center mt-1">
                  <Target className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+5%</span>
                </div>
              </div>
              <div className="p-2 lg:p-3 bg-orange-500 rounded-xl">
                <CheckCircle className="h-4 w-4 lg:h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards compactos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {navigationCards.map((card, index) => (
          <Card 
            key={index} 
            className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => navigate(card.href)}
          >
            <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 lg:p-3 ${card.iconBg} rounded-xl group-hover:scale-105 transition-transform duration-300`}>
                    <card.icon className={`h-5 w-5 lg:h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {card.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-1 text-sm">{card.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                    {card.count}
                  </div>
                  <Badge className={`mt-1 ${card.badgeColor} border-0 text-xs`}>
                    {card.badge}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Quick Actions compacto */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <BarChart3 className="h-4 w-4" />
            </div>
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex flex-col gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
              onClick={() => navigate('/admin/mentorias/sessoes')}
            >
              <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-sm">Agendar Sessão</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex flex-col gap-2 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group"
              onClick={() => navigate('/admin/mentorias/inscricoes')}
            >
              <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <span className="font-medium text-sm">Nova Inscrição</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex flex-col gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group"
              onClick={() => navigate('/admin/mentorias/materiais')}
            >
              <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <span className="font-medium text-sm">Upload Material</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity compacto */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
              <Clock className="h-4 w-4" />
            </div>
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500 hover:bg-green-100 transition-colors duration-300">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Sessão de E-commerce Avançado concluída</p>
                <p className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                  <Users className="h-3 w-3" />
                  João Silva • há 2 horas
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 text-xs">Concluída</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition-colors duration-300">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Nova sessão agendada para amanhã</p>
                <p className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                  <Users className="h-3 w-3" />
                  Maria Santos • Mentoria Individual • há 4 horas
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Agendada</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500 hover:bg-orange-100 transition-colors duration-300">
              <div className="p-2 bg-orange-500 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Material enviado: Planilha de Análise</p>
                <p className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                  <Users className="h-3 w-3" />
                  Ana Costa • há 6 horas
                </p>
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">Novo Material</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringManagement;
