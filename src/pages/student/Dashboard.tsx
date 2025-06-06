
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { PageTransition, PageChild } from '@/components/animations/PageTransition';
import { useUXFeedback } from '@/hooks/useUXFeedback';
import { YouTubeSection } from '@/components/student/dashboard/YouTubeSection';
import { NewsSection } from '@/components/student/dashboard/NewsSection';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { feedback } = useUXFeedback();

  console.log("=== STUDENT DASHBOARD DEBUG ===");
  console.log("User:", user?.email);
  console.log("================================");

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

  return (
    <PageTransition className="space-y-6 p-4">
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

      {/* Seção de Notícias - movida para o topo */}
      <NewsSection />

      {/* Seção de Vídeos do YouTube - movida para baixo */}
      <YouTubeSection />
    </PageTransition>
  );
};

export default StudentDashboard;
