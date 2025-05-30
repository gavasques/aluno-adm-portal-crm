
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

type GradientType = 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'error';
type VariantType = 'default' | 'glass' | 'solid';

interface Trend {
  value: string;
  isPositive: boolean;
}

interface DesignStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  gradient: GradientType;
  trend?: Trend;
  onClick?: () => void;
  variant?: VariantType;
  className?: string;
}

const gradientClasses = {
  primary: 'from-blue-500 to-blue-600',
  secondary: 'from-purple-500 to-purple-600',
  accent: 'from-pink-500 to-pink-600',
  warning: 'from-amber-500 to-amber-600',
  success: 'from-green-500 to-green-600',
  error: 'from-red-500 to-red-600',
};

const backgroundVariants = {
  default: 'bg-white dark:bg-gray-800',
  glass: 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
  solid: 'bg-white dark:bg-gray-800',
};

export const DesignStatsCard: React.FC<DesignStatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  trend,
  onClick,
  variant = 'default',
  className,
}) => {
  return (
    <motion.div
      className={cn(
        'rounded-xl border border-white/20 shadow-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        backgroundVariants[variant],
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '↗' : '↘'} {trend.value}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className={cn(
          'p-2 rounded-lg bg-gradient-to-br shadow-md',
          gradientClasses[gradient]
        )}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};
