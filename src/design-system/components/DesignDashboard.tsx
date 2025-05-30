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
  return;
};