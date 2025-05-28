
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'pulse' | 'orbit';
  className?: string;
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

export const ModernSpinner: React.FC<ModernSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className 
}) => {
  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full bg-blue-500",
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(
          "rounded-full bg-blue-500",
          spinnerSizes[size],
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  if (variant === 'orbit') {
    return (
      <div className={cn("relative", spinnerSizes[size], className)}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border border-purple-500 border-b-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <Loader2 
      className={cn(
        "animate-spin text-blue-500",
        spinnerSizes[size],
        className
      )} 
    />
  );
};

interface ProgressIndicatorProps {
  progress: number;
  variant?: 'linear' | 'circular';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  variant = 'linear',
  showPercentage = true,
  className
}) => {
  if (variant === 'circular') {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-blue-500"
            strokeLinecap="round"
          />
        </svg>
        {showPercentage && (
          <span className="absolute text-sm font-medium text-slate-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Progresso
        </span>
        {showPercentage && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

interface StatusAnimationProps {
  status: 'loading' | 'success' | 'error';
  message?: string;
  className?: string;
}

export const StatusAnimation: React.FC<StatusAnimationProps> = ({
  status,
  message,
  className
}) => {
  const variants = {
    loading: { scale: 1, rotate: 0 },
    success: { scale: [1, 1.2, 1], rotate: [0, 180, 360] },
    error: { scale: [1, 1.1, 1], x: [-5, 5, -5, 0] }
  };

  const icons = {
    loading: <ModernSpinner size="md" />,
    success: <CheckCircle className="h-8 w-8 text-green-500" />,
    error: <AlertCircle className="h-8 w-8 text-red-500" />
  };

  return (
    <div className={cn("flex flex-col items-center space-y-3", className)}>
      <motion.div
        variants={variants}
        animate={status}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {icons[status]}
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-slate-600 dark:text-slate-400 text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};
