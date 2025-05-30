
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
  error: 'from-red-500 to-red-600'
};

const backgroundVariants = {
  default: 'bg-white dark:bg-gray-800',
  glass: 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
  solid: 'bg-white dark:bg-gray-800'
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
  className
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-200 hover:shadow-md",
        backgroundVariants[variant],
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}
                >
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br",
            gradientClasses[gradient]
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
