
import React from 'react';
import { Users, Package, GraduationCap, BarChart, Wrench, Clock } from 'lucide-react';
import { DesignStatsCard, DesignQuickActions, DesignActivityFeed } from '@/design-system/components/DesignDashboard';
import { PageTransition, PageChild } from '@/components/animations/PageTransition';
import { useUXFeedback } from '@/hooks/useUXFeedback';

const StudentDashboard = () => {
  const { feedback } = useUXFeedback();

  const statsCards = [
    {
      title: "Meus Fornecedores",
      value: "12",
      description: "fornecedores cadastrados",
      icon: Package,
      gradient: "primary" as const,
      trend: { value: "+3 este mês", isPositive: true },
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/meus-fornecedores";
      }
    },
    {
      title: "Mentorias Ativas",
      value: "3",
      description: "em andamento",
      icon: GraduationCap,
      gradient: "secondary" as const,
      trend: { value: "2 agendadas", isPositive: true },
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/mentorias";
      }
    },
    {
      title: "Recursos Gerais",
      value: "125",
      description: "fornecedores disponíveis",
      icon: Users,
      gradient: "accent" as const,
      trend: { value: "+8 novos", isPositive: true },
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/fornecedores";
      }
    },
    {
      title: "Ferramentas",
      value: "18",
      description: "disponíveis para você",
      icon: Wrench,
      gradient: "warning" as const,
      trend: { value: "+2 adicionadas", isPositive: true },
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/ferramentas";
      }
    }
  ];

  const quickActions = [
    {
      id: "fornecedores",
      title: "Fornecedores",
      description: "Explore nossa rede de fornecedores",
      icon: Users,
      gradient: "primary" as const,
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/fornecedores";
      }
    },
    {
      id: "parceiros",
      title: "Parceiros",
      description: "Conecte-se com parceiros estratégicos",
      icon: BarChart,
      gradient: "accent" as const,
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/parceiros";
      }
    },
    {
      id: "ferramentas",
      title: "Ferramentas",
      description: "Acesse ferramentas exclusivas",
      icon: Wrench,
      gradient: "secondary" as const,
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/ferramentas";
      }
    }
  ];

  const recentActivities = [
    {
      id: "1",
      title: "Novo fornecedor adicionado",
      time: "2 horas atrás",
      color: "bg-blue-500",
      icon: Package
    },
    {
      id: "2",
      title: "Mentoria agendada",
      time: "1 dia atrás",
      color: "bg-green-500",
      icon: GraduationCap
    },
    {
      id: "3",
      title: "Ferramenta avaliada",
      time: "2 dias atrás",
      color: "bg-purple-500",
      icon: Wrench
    }
  ];

  // Show welcome message on dashboard load
  React.useEffect(() => {
    feedback.systemReady();
  }, [feedback]);

  return (
    <PageTransition className="space-y-8 p-6">
      {/* Header */}
      <PageChild>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-purple-100 dark:to-white">
            Dashboard do Aluno
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Bem-vindo ao seu portal de aprendizado 🚀
          </p>
        </div>
      </PageChild>

      {/* Stats Cards */}
      <PageChild>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <DesignStatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              gradient={card.gradient}
              trend={card.trend}
              onClick={card.onClick}
              variant="glass"
            />
          ))}
        </div>
      </PageChild>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <PageChild className="lg:col-span-2">
          <DesignQuickActions actions={quickActions} variant="glass" />
        </PageChild>

        {/* Recent Activity */}
        <PageChild className="lg:col-span-1">
          <DesignActivityFeed activities={recentActivities} variant="glass" />
        </PageChild>
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
