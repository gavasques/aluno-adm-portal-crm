
import { LucideIcon } from 'lucide-react';

export interface StatsCardTrend {
  value: string;
  isPositive: boolean;
}

export interface ModernStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: StatsCardTrend;
  onClick?: () => void;
  delay?: number;
  miniChart?: React.ReactNode;
}
