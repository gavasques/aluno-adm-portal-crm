
import React from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { StatsOverview } from "@/components/admin/dashboard/StatsOverview";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { SystemHealth } from "@/components/admin/dashboard/SystemHealth";
import { RecentActivities } from "@/components/admin/dashboard/RecentActivities";
import { PerformanceMetrics } from "@/components/admin/dashboard/PerformanceMetrics";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { useUXFeedback } from "@/hooks/useUXFeedback";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const { feedback } = useUXFeedback();
  const isMobile = useIsMobile();

  // Show welcome message on dashboard load
  React.useEffect(() => {
    feedback.systemReady();
  }, [feedback]);

  const handleRefresh = async () => {
    feedback.loading("Atualizando dashboard...");
    
    // Simular carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    feedback.syncCompleted();
  };

  const content = (
    <div className="container mx-auto p-3 space-y-4 max-w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatsOverview />
      </motion.div>

      <div className={isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-3 gap-4"}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={isMobile ? "" : "lg:col-span-2"}
        >
          <RecentActivities />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>
      </div>

      <div className={isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SystemHealth />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <PerformanceMetrics />
        </motion.div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <PullToRefresh onRefresh={handleRefresh}>
          {content}
        </PullToRefresh>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {content}
    </div>
  );
};

export default AdminDashboard;
