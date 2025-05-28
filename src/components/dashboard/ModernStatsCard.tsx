
import React from 'react';
import { motion } from 'framer-motion';
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card';
import { StatsCardContent } from './stats-card/StatsCardContent';
import { StatsCardIcon } from './stats-card/StatsCardIcon';
import { ModernStatsCardProps } from './stats-card/types';

export const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  description,
  icon,
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
            <StatsCardContent
              title={title}
              value={value}
              description={description}
              trend={trend}
              delay={delay}
            />
            
            <StatsCardIcon
              icon={icon}
              gradient={gradient}
              delay={delay}
            />
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
