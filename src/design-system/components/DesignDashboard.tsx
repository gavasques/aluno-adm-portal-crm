
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { DesignCard, DesignCardHeader, DesignCardTitle, DesignCardDescription, DesignCardContent } from './DesignCard';
import { DesignButton } from './DesignButton';
import { cn } from '@/lib/utils';
import { designTokens } from '../tokens';

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  variant?: 'glass' | 'neumorphism' | 'modern';
  gradient?: keyof typeof designTokens.gradients;
}

export const DesignStatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  onClick,
  variant = 'glass',
  gradient = 'primary'
}) => {
  return (
    <DesignCard
      variant={variant}
      size="md"
      interactive={!!onClick}
      onClick={onClick}
      className="relative overflow-hidden group"
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: designTokens.gradients[gradient] }}
      />
      
      <DesignCardContent className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
              </p>
              {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
              {trend && (
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
          </div>
          
          <div 
            className="p-3 rounded-xl"
            style={{ background: designTokens.gradients[gradient] }}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </DesignCardContent>
    </DesignCard>
  );
};

// Quick Actions Component
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient?: keyof typeof designTokens.gradients;
}

interface QuickActionsProps {
  actions: QuickAction[];
  variant?: 'glass' | 'neumorphism' | 'modern';
}

export const DesignQuickActions: React.FC<QuickActionsProps> = ({
  actions,
  variant = 'glass'
}) => {
  return (
    <DesignCard variant={variant} size="lg">
      <DesignCardHeader>
        <DesignCardTitle>Ações Rápidas</DesignCardTitle>
        <DesignCardDescription>
          Acesse rapidamente as principais funcionalidades
        </DesignCardDescription>
      </DesignCardHeader>
      
      <DesignCardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <DesignButton
                  variant="glass"
                  size="lg"
                  fullWidth
                  onClick={action.onClick}
                  className="h-auto p-6 flex-col gap-3 group"
                  gradient={action.gradient}
                >
                  <div 
                    className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
                    style={{ background: designTokens.gradients[action.gradient || 'primary'] }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {action.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {action.description}
                    </div>
                  </div>
                </DesignButton>
              </motion.div>
            );
          })}
        </div>
      </DesignCardContent>
    </DesignCard>
  );
};

// Activity Feed Component
interface Activity {
  id: string;
  title: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  variant?: 'glass' | 'neumorphism' | 'modern';
}

export const DesignActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  variant = 'glass'
}) => {
  return (
    <DesignCard variant={variant} size="lg" className="h-full">
      <DesignCardHeader>
        <DesignCardTitle>Atividade Recente</DesignCardTitle>
        <DesignCardDescription>
          Suas últimas ações no sistema
        </DesignCardDescription>
      </DesignCardHeader>
      
      <DesignCardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10 hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200"
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", activity.color)}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DesignCardContent>
    </DesignCard>
  );
};
