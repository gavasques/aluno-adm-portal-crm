
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMotionPreference } from '@/hooks/useReducedMotion';

interface AdvancedSkeletonProps {
  variant?: 'dashboard' | 'table' | 'form' | 'card' | 'list' | 'profile';
  lines?: number;
  className?: string;
  shimmer?: boolean;
}

const AdvancedSkeleton: React.FC<AdvancedSkeletonProps> = ({
  variant = 'card',
  lines = 3,
  className,
  shimmer = true
}) => {
  const { getAnimationConfig } = useMotionPreference();

  const baseClasses = "bg-slate-200 dark:bg-slate-700 rounded-lg";
  const shimmerClasses = shimmer ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent" : "";

  if (variant === 'dashboard') {
    return (
      <motion.div
        className={cn("space-y-6", className)}
        {...getAnimationConfig({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        })}
      >
        {/* Header */}
        <div className="space-y-3">
          <div className={cn(baseClasses, shimmerClasses, "h-8 w-1/3")} />
          <div className={cn(baseClasses, shimmerClasses, "h-4 w-1/2")} />
        </div>
        
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className={cn(baseClasses, shimmerClasses, "h-4 w-24")} />
                  <div className={cn(baseClasses, shimmerClasses, "h-8 w-16")} />
                  <div className={cn(baseClasses, shimmerClasses, "h-3 w-20")} />
                </div>
                <div className={cn(baseClasses, shimmerClasses, "h-12 w-12 rounded-xl")} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={cn(baseClasses, shimmerClasses, "h-6 w-32")} />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className={cn(baseClasses, shimmerClasses, "h-10 w-10 rounded-full")} />
                <div className="space-y-2 flex-1">
                  <div className={cn(baseClasses, shimmerClasses, "h-4 w-3/4")} />
                  <div className={cn(baseClasses, shimmerClasses, "h-3 w-1/2")} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className={cn(baseClasses, shimmerClasses, "h-6 w-40")} />
            <div className={cn(baseClasses, shimmerClasses, "h-64 w-full rounded-xl")} />
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'table') {
    return (
      <motion.div
        className={cn("space-y-4", className)}
        {...getAnimationConfig({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        })}
      >
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={cn(baseClasses, shimmerClasses, "h-4")} />
          ))}
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className={cn(baseClasses, shimmerClasses, "h-4")} />
            ))}
          </div>
        ))}
      </motion.div>
    );
  }

  if (variant === 'form') {
    return (
      <motion.div
        className={cn("space-y-6", className)}
        {...getAnimationConfig({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        })}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className={cn(baseClasses, shimmerClasses, "h-4 w-24")} />
            <div className={cn(baseClasses, shimmerClasses, "h-10 w-full")} />
          </div>
        ))}
        <div className="flex gap-4 pt-4">
          <div className={cn(baseClasses, shimmerClasses, "h-10 w-24")} />
          <div className={cn(baseClasses, shimmerClasses, "h-10 w-24")} />
        </div>
      </motion.div>
    );
  }

  if (variant === 'profile') {
    return (
      <motion.div
        className={cn("space-y-6", className)}
        {...getAnimationConfig({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        })}
      >
        <div className="flex items-center space-x-4">
          <div className={cn(baseClasses, shimmerClasses, "h-20 w-20 rounded-full")} />
          <div className="space-y-2">
            <div className={cn(baseClasses, shimmerClasses, "h-6 w-32")} />
            <div className={cn(baseClasses, shimmerClasses, "h-4 w-24")} />
          </div>
        </div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={cn(baseClasses, shimmerClasses, "h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
        ))}
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      className={cn("p-6 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4", className)}
      {...getAnimationConfig({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      })}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(baseClasses, shimmerClasses, "h-12 w-12 rounded")} />
        <div className="space-y-2 flex-1">
          <div className={cn(baseClasses, shimmerClasses, "h-4 w-3/4")} />
          <div className={cn(baseClasses, shimmerClasses, "h-3 w-1/2")} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            baseClasses,
            shimmerClasses,
            "h-3",
            i === lines - 1 ? "w-4/5" : "w-full"
          )}
        />
      ))}
      <div className="flex justify-between items-center pt-2">
        <div className={cn(baseClasses, shimmerClasses, "h-8 w-20 rounded-full")} />
        <div className={cn(baseClasses, shimmerClasses, "h-8 w-16 rounded-full")} />
      </div>
    </motion.div>
  );
};

export default AdvancedSkeleton;
