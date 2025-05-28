
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatsCardTrend as StatsCardTrendType } from './types';

interface StatsCardTrendProps {
  trend: StatsCardTrendType;
  delay: number;
}

export const StatsCardTrend: React.FC<StatsCardTrendProps> = ({ trend, delay }) => {
  return (
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
  );
};
