
import React from 'react';
import { Users, Package, GraduationCap, BarChart, Wrench, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModernDashboard } from '@/components/dashboard/ModernDashboard';
import { ModernStatsCard } from '@/components/dashboard/ModernStatsCard';
import { ModernQuickActions } from '@/components/dashboard/ModernQuickActions';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';

const StudentDashboard = () => {
  const statsCards = [
    {
      title: "Meus Fornecedores",
      value: "12",
      description: "fornecedores cadastrados",
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      trend: { value: "+3 este mês", isPositive: true },
      onClick: () => window.location.href = "/aluno/meus-fornecedores"
    },
    {
      title: "Mentorias Ativas",
      value: "3",
      description: "em andamento",
      icon: GraduationCap,
      gradient: "from-purple-500 to-purple-600",
      trend: { value: "2 agendadas", isPositive: true },
      onClick: () => window.location.href = "/aluno/mentoria"
    },
    {
      title: "Recursos Gerais",
      value: "125",
      description: "fornecedores disponíveis",
      icon: Users,
      gradient: "from-green-500 to-green-600",
      trend: { value: "+8 novos", isPositive: true },
      onClick: () => window.location.href = "/aluno/fornecedores"
    },
    {
      title: "Ferramentas",
      value: "18",
      description: "disponíveis para você",
      icon: Wrench,
      gradient: "from-orange-500 to-orange-600",
      trend: { value: "+2 adicionadas", isPositive: true },
      onClick: () => window.location.href = "/aluno/ferramentas"
    }
  ];

  const quickActions = [
    {
      id: "fornecedores",
      title: "Fornecedores",
      description: "Explore nossa rede de fornecedores",
      href: "/aluno/fornecedores",
      icon: Users,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      id: "parceiros",
      title: "Parceiros",
      description: "Conecte-se com parceiros estratégicos",
      href: "/aluno/parceiros",
      icon: BarChart,
      gradient: "from-green-500 to-green-600"
    },
    {
      id: "ferramentas",
      title: "Ferramentas",
      description: "Acesse ferramentas exclusivas",
      href: "/aluno/ferramentas",
      icon: Wrench,
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const recentActivities = [
    {
      title: "Novo fornecedor adicionado",
      time: "2 horas atrás",
      color: "bg-blue-500",
      icon: Package
    },
    {
      title: "Mentoria agendada",
      time: "1 dia atrás",
      color: "bg-green-500",
      icon: GraduationCap
    }
  ];

  return (
    <ModernDashboard
      title="Dashboard do Aluno"
      subtitle="Bem-vindo ao seu portal de aprendizado"
      onRefresh={() => window.location.reload()}
    >
      {/* Stats Cards */}
      {statsCards.map((card, index) => (
        <ModernStatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          gradient={card.gradient}
          trend={card.trend}
          onClick={card.onClick}
          delay={index * 0.1}
        />
      ))}

      {/* Quick Actions - Full width */}
      <div className="lg:col-span-2">
        <ModernQuickActions actions={quickActions} />
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-1">
        <ModernCard variant="glass">
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              Atividade Recente
            </ModernCardTitle>
            <ModernCardDescription>
              Suas últimas ações no sistema
            </ModernCardDescription>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/20 dark:bg-white/5 border border-white/10"
                >
                  <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center shadow-modern-1`}>
                    <activity.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    </ModernDashboard>
  );
};

export default StudentDashboard;
