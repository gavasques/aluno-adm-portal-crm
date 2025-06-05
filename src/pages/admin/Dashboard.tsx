
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  console.log('Dashboard component is rendering');

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Leads Ativos',
      value: '567',
      icon: FileText,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Mentorias',
      value: '89',
      icon: Calendar,
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Crescimento',
      value: '23%',
      icon: TrendingUp,
      change: '+5%',
      changeType: 'positive' as const
    }
  ];

  const quickActions = [
    { title: 'Gerenciar Usuários', href: '/admin/users', description: 'Adicionar e gerenciar usuários do sistema' },
    { title: 'CRM - Leads', href: '/admin/crm', description: 'Visualizar e gerenciar leads' },
    { title: 'Mentorias', href: '/admin/mentoring', description: 'Gerenciar programas de mentoria' },
    { title: 'Tarefas', href: '/admin/tasks', description: 'Organizar e acompanhar tarefas' }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema e ações rápidas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h3 className="font-medium text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <Link to={action.href}>
                  <Button variant="outline" size="sm">
                    Acessar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-600">
            <p>Componente Dashboard renderizado com sucesso</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
