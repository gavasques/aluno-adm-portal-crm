
import React from 'react';
import { motion } from 'framer-motion';
import { StatsCardTrend } from './StatsCardTrend';
import { StatsCardTrend as TrendType } from './types';

interface StatsCardContentProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: TrendType;
  delay: number;
}

export const StatsCardContent: React.FC<StatsCardContentProps> = ({
  title,
  value,
  description,
  trend,
  delay
}) => {
  return (
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
        <StatsCardTrend trend={trend} delay={delay} />
      )}
    </div>
  );
};
