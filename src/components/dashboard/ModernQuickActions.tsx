
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Plus, ArrowRight, Check, X } from 'lucide-react';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  href?: string;
  onClick?: () => void | Promise<void>;
}

interface ModernQuickActionsProps {
  actions: QuickAction[];
  title?: string;
  description?: string;
}

export const ModernQuickActions: React.FC<ModernQuickActionsProps> = ({
  actions,
  title = "Acesso Rápido",
  description = "Links para as principais funcionalidades"
}) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({});

  const handleAction = async (action: QuickAction) => {
    if (action.href) {
      window.location.href = action.href;
      return;
    }

    if (action.onClick) {
      setLoadingStates(prev => ({ ...prev, [action.id]: true }));
      
      try {
        await action.onClick();
        setSuccessStates(prev => ({ ...prev, [action.id]: true }));
        setTimeout(() => {
          setSuccessStates(prev => ({ ...prev, [action.id]: false }));
        }, 2000);
      } catch (error) {
        console.error('Error executing action:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, [action.id]: false }));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ModernCard variant="glass">
        <ModernCardHeader>
          <ModernCardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            {title}
          </ModernCardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </ModernCardHeader>
        
        <ModernCardContent className="space-y-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(action)}
                className="group flex items-center space-x-4 p-4 rounded-xl bg-white/30 dark:bg-white/5 border border-white/20 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-modern-2 cursor-pointer relative overflow-hidden"
              >
                {/* Ripple Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                {/* Icon */}
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient} shadow-modern-1 group-hover:shadow-modern-2 transition-shadow relative`}>
                    <AnimatePresence mode="wait">
                      {loadingStates[action.id] ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, rotate: 0 }}
                          animate={{ opacity: 1, rotate: 360 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : successStates[action.id] ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Check className="h-5 w-5 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <action.icon className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300`} />
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    {action.title}
                  </motion.h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {action.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                  </div>
                </motion.div>
                
                {/* Status indicator */}
                <AnimatePresence>
                  {(loadingStates[action.id] || successStates[action.id]) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2"
                    >
                      <div className={`w-2 h-2 rounded-full ${successStates[action.id] ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Hover particles */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" />
                </div>
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.2s' }}>
                  <div className="w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </ModernCardContent>
      </ModernCard>
    </motion.div>
  );
};
