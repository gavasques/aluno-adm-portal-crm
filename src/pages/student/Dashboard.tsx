
import React, { useState } from 'react';
import { Users, Package, GraduationCap, BarChart, Wrench, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ModernStatsCard } from '@/components/dashboard/ModernStatsCard';
import { ModernQuickActions } from '@/components/dashboard/ModernQuickActions';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { PageTransition, PageChild } from '@/components/animations/PageTransition';
import { HoverCard } from '@/components/animations/HoverCard';
import { StatusAnimation, ModernSpinner } from '@/components/animations/LoadingStates';
import { FloatingActionButton, SuccessCheckmark, Confetti } from '@/components/animations/SuccessStates';

const StudentDashboard = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      onClick: () => window.location.href = "/aluno/mentorias"
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

  const handleQuickAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowConfetti(false);
      }, 3000);
    }, 2000);
  };

  return (
    <PageTransition className="space-y-8">
      {/* Header */}
      <PageChild>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-purple-100 dark:to-white">
            Dashboard do Aluno
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Bem-vindo ao seu portal de aprendizado
          </p>
        </div>
      </PageChild>

      {/* Stats Cards */}
      <PageChild>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <HoverCard
              key={card.title}
              variant="lift"
              onClick={card.onClick}
              className="p-0 overflow-hidden"
            >
              <ModernStatsCard
                title={card.title}
                value={card.value}
                description={card.description}
                icon={card.icon}
                gradient={card.gradient}
                trend={card.trend}
                onClick={card.onClick}
                delay={index * 0.1}
              />
            </HoverCard>
          ))}
        </div>
      </PageChild>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <PageChild className="lg:col-span-2">
          <ModernQuickActions actions={quickActions} />
        </PageChild>

        {/* Recent Activity */}
        <PageChild className="lg:col-span-1">
          <HoverCard variant="glow" className="h-full">
            <ModernCard variant="glass" className="h-full">
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
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-white/20 dark:bg-white/5 border border-white/10 hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200"
                    >
                      <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center`}>
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
                    </motion.div>
                  ))}
                </div>
              </ModernCardContent>
            </ModernCard>
          </HoverCard>
        </PageChild>
      </div>

      {/* Success States */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <SuccessCheckmark isVisible={showSuccess} size="lg" />
      </div>

      <Confetti isVisible={showConfetti} />

      {/* Loading Demo */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8">
            <StatusAnimation 
              status="loading" 
              message="Processando sua solicitação..." 
            />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setFabExpanded(!fabExpanded)}
        icon={<Plus className="h-5 w-5" />}
        label="Ação Rápida"
        isExpanded={fabExpanded}
      />
    </PageTransition>
  );
};

export default StudentDashboard;
