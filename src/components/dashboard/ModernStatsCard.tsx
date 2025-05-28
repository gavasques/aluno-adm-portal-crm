
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card';

interface ModernStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  delay?: number;
  miniChart?: React.ReactNode;
}

export const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  trend,
  onClick,
  delay = 0,
  miniChart
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <ModernCard 
        variant="glass" 
        hover={false}
        className="relative overflow-hidden group"
      >
        {/* Background Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <ModernCardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              {/* Title */}
              <motion.p 
                className="text-sm font-medium text-slate-600 dark:text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.1 }}
              >
                {title}
              </motion.p>
              
              {/* Value */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring" }}
                className="space-y-1"
              >
                <p className="text-3xl font-bold font-display text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {value}
                </p>
                {description && (
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {description}
                  </p>
                )}
              </motion.div>
              
              {/* Trend */}
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                  className="flex items-center gap-1.5"
                >
                  <div className={`p-1 rounded-full ${trend.isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trend.value}
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: delay + 0.4,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-modern-2 group-hover:shadow-modern-3 transition-shadow duration-300`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300`} />
            </motion.div>
          </div>
          
          {/* Mini Chart */}
          {miniChart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: delay + 0.5 }}
              className="mt-4 pt-3 border-t border-white/10"
            >
              {miniChart}
            </motion.div>
          )}
          
          {/* Hover particles effect */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" />
          </div>
          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.5s' }}>
            <div className="w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping" />
          </div>
        </ModernCardContent>
      </ModernCard>
    </motion.div>
  );
};
