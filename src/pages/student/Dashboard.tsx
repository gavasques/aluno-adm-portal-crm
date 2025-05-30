
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Package, GraduationCap, Wrench, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PageTransition, PageChild } from '@/components/animations/PageTransition';
import { useUXFeedback } from '@/hooks/useUXFeedback';
import { DesignStatsCard } from '@/design-system/components/DesignDashboard';
import { YouTubeSection } from '@/components/student/dashboard/YouTubeSection';
import { NewsSection } from '@/components/student/dashboard/NewsSection';

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

  // Removido: feedback.systemReady() que estava causando as notificações automáticas
  // React.useEffect(() => {
  //   feedback.systemReady();
  // }, [feedback]);

  return (
    <PageTransition className="space-y-4 p-4">
      {/* Header com saudação personalizada - mais compacto */}
      <PageChild>
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-purple-100 dark:to-white">
                {getGreeting()}, {firstName}! 👋
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Bem-vindo ao seu portal de aprendizado e crescimento
              </p>
            </div>
          </div>
          
          {/* Linha decorativa menor */}
          <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </motion.div>
      </PageChild>

      {/* Stats Cards - grid mais compacto */}
      <PageChild>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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

      {/* Seção de Notícias */}
      <NewsSection />
    </PageTransition>
  );
};

export default StudentDashboard;
