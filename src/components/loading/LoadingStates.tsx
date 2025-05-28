
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useMotionPreference } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'md',
  message = 'Carregando...',
  className
}) => {
  const { getAnimationConfig } = useMotionPreference();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'spinner') {
    return (
      <motion.div
        className={cn('flex flex-col items-center justify-center space-y-4', className)}
        {...getAnimationConfig({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        })}
      >
        <Loader2 className={cn('animate-spin text-blue-500', sizeClasses[size])} />
        {message && (
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {message}
          </p>
        )}
      </motion.div>
    );
  }

  if (variant === 'dots') {
    return (
      <motion.div
        className={cn('flex flex-col items-center justify-center space-y-4', className)}
        {...getAnimationConfig({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        })}
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'rounded-full bg-blue-500',
                size === 'sm' ? 'w-2 h-2' : 
                size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
              )}
              {...getAnimationConfig({
                animate: {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                },
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }
              })}
            />
          ))}
        </div>
        {message && (
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {message}
          </p>
        )}
      </motion.div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn('flex flex-col items-center justify-center space-y-4', className)}
        {...getAnimationConfig({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        })}
      >
        <motion.div
          className={cn(
            'rounded-full bg-blue-500/20 border-2 border-blue-500',
            sizeClasses[size]
          )}
          {...getAnimationConfig({
            animate: {
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            },
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          })}
        />
        {message && (
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {message}
          </p>
        )}
      </motion.div>
    );
  }

  return null;
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Ocorreu um erro. Tente novamente.',
  onRetry,
  className
}) => {
  const { getAnimationConfig } = useMotionPreference();

  return (
    <motion.div
      className={cn('flex flex-col items-center justify-center space-y-4 p-8', className)}
      {...getAnimationConfig({
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 }
      })}
    >
      <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Ops! Algo deu errado
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tentar Novamente
        </button>
      )}
    </motion.div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum item encontrado',
  description = 'Não há dados para exibir no momento.',
  action,
  icon,
  className
}) => {
  const { getAnimationConfig } = useMotionPreference();

  return (
    <motion.div
      className={cn('flex flex-col items-center justify-center space-y-4 p-12', className)}
      {...getAnimationConfig({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
      })}
    >
      {icon && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
          {icon}
        </div>
      )}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
          {description}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </motion.div>
  );
};
