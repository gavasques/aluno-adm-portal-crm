
import React from 'react';
import { motion } from 'framer-motion';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { AdaptiveGrid } from '@/components/ui/adaptive-grid';
import { SafeArea } from '@/components/ui/safe-area';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernDashboardProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  onRefresh?: () => void | Promise<void>;
  title?: string;
  subtitle?: string;
}

export const ModernDashboard: React.FC<ModernDashboardProps> = ({
  children,
  isAdmin = false,
  onRefresh,
  title,
  subtitle
}) => {
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      // Default refresh behavior
      window.location.reload();
    }
  };

  const content = (
    <div className="p-8 space-y-8">
      {/* Header with title */}
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          {title && (
            <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-purple-100 dark:to-white">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Dashboard Content */}
      <AdaptiveGrid
        className="w-full"
        responsive={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
          '2xl': 4
        }}
        gap={24}
      >
        {children}
      </AdaptiveGrid>
    </div>
  );

  if (isMobile) {
    return (
      <SafeArea>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <ModernHeader isAdmin={isAdmin} />
          
          <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
            <motion.main
              className="p-4 pb-safe-bottom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {content}
            </motion.main>
          </PullToRefresh>

          {/* Background Elements for mobile */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </SafeArea>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <ModernHeader isAdmin={isAdmin} />
      
      <motion.main
        className="ml-64 p-6 lg:p-8 pt-safe-top pb-safe-bottom"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto">
          {content}
        </div>
      </motion.main>

      {/* Background Elements for desktop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
    </div>
  );
};
