
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Package, GraduationCap, BarChart, Wrench, TrendingUp, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';

const StudentDashboard = () => {
  const statsCards = [
    {
      title: "Meus Fornecedores",
      value: "12",
      description: "fornecedores cadastrados",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      link: "/aluno/meus-fornecedores",
      trend: "+3 este mês",
      trendUp: true
    },
    {
      title: "Mentorias Ativas",
      value: "3",
      description: "em andamento",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      link: "/aluno/mentoria",
      trend: "2 agendadas",
      trendUp: true
    },
    {
      title: "Recursos Gerais",
      value: "125",
      description: "fornecedores disponíveis",
      icon: Users,
      color: "from-green-500 to-green-600",
      link: "/aluno/fornecedores",
      trend: "+8 novos",
      trendUp: true
    },
    {
      title: "Ferramentas",
      value: "18",
      description: "disponíveis para você",
      icon: Wrench,
      color: "from-orange-500 to-orange-600",
      link: "/aluno/ferramentas",
      trend: "+2 adicionadas",
      trendUp: true
    }
  ];

  const quickActions = [
    {
      title: "Fornecedores",
      description: "Explore nossa rede de fornecedores",
      href: "/aluno/fornecedores",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Parceiros",
      description: "Conecte-se com parceiros estratégicos",
      href: "/aluno/parceiros",
      icon: BarChart,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Ferramentas",
      description: "Acesse ferramentas exclusivas",
      href: "/aluno/ferramentas",
      icon: Wrench,
      color: "from-purple-500 to-purple-600"
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
    },
    {
      title: "Avaliação enviada",
      time: "3 dias atrás",
      color: "bg-purple-500",
      icon: Award
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-purple-100 dark:to-white">
          Dashboard do Aluno
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Bem-vindo ao seu portal de aprendizado
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={card.link}>
              <ModernCard variant="glass" interactive hover>
                <ModernCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                        {card.value}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {card.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {card.trend}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-modern-2`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </ModernCardContent>
              </ModernCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <ModernCard variant="glass">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart className="h-5 w-5 text-white" />
                </div>
                Acesso Rápido
              </ModernCardTitle>
              <ModernCardDescription>
                Links para as principais funcionalidades
              </ModernCardDescription>
            </ModernCardHeader>
            <ModernCardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Link to={action.href}>
                    <div className="group flex items-center space-x-4 p-4 rounded-xl bg-white/30 dark:bg-white/5 border border-white/20 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-modern-2">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} shadow-modern-1 group-hover:shadow-modern-2 transition-shadow`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {action.description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </ModernCardContent>
          </ModernCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
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
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <ModernButton 
                  variant="glass" 
                  size="sm" 
                  className="w-full"
                  animation="scale"
                >
                  Ver todas as atividades
                </ModernButton>
              </div>
            </ModernCardContent>
          </ModernCard>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
