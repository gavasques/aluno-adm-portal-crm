
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Package, GraduationCap, BarChart, Wrench, Clock, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PageTransition, PageChild } from '@/components/animations/PageTransition';
import { useUXFeedback } from '@/hooks/useUXFeedback';
import { DesignStatsCard, DesignQuickActions, DesignActivityFeed } from '@/design-system/components/DesignDashboard';
import { YouTubeSection } from '@/components/student/dashboard/YouTubeSection';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { feedback } = useUXFeedback();

  // Extrair nome do usuário
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Aluno';
  const firstName = userName.split(' ')[0];

  // Obter saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const statsCards = [
    {
      title: "Meus Créditos",
      value: "85",
      description: "créditos disponíveis",
      icon: CreditCard,
      gradient: "secondary" as const,
      trend: { value: "+15 este mês", isPositive: true },
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/creditos";
      }
    },
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
      gradient: "accent" as const,
      trend: { value: "2 agendadas", isPositive: true },
      onClick: () => {
        feedback.dataLoaded();
        window.location.href = "/aluno/mentoria";
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
      title: "Mentoria agendada para amanhã",
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
    },
    {
      id: "4",
      title: "Créditos renovados",
      time: "3 dias atrás",
      color: "bg-emerald-500",
      icon: CreditCard
    }
  ];

  // Show welcome message on dashboard load
  React.useEffect(() => {
    feedback.systemReady();
  }, [feedback]);

  return (
    <PageTransition className="space-y-8 p-6">
      {/* Header com saudação personalizada */}
      <PageChild>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-purple-100 dark:to-white">
                {getGreeting()}, {firstName}! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Bem-vindo ao seu portal de aprendizado e crescimento
              </p>
            </div>
          </div>
          
          {/* Linha decorativa */}
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </motion.div>
      </PageChild>

      {/* Stats Cards */}
      <PageChild>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <DesignStatsCard
                title={card.title}
                value={card.value}
                description={card.description}
                icon={card.icon}
                gradient={card.gradient}
                trend={card.trend}
                onClick={card.onClick}
                variant="glass"
              />
            </motion.div>
          ))}
        </div>
      </PageChild>

      {/* Seção de Vídeos do YouTube */}
      <YouTubeSection />

      {/* Content Grid - Ações Rápidas e Atividade Recente */}
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
