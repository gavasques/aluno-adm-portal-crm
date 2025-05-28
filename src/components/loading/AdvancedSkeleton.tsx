
import React from 'react';
import { cn } from '@/lib/utils';

interface AdvancedSkeletonProps {
  variant?: 'dashboard' | 'table' | 'form' | 'card' | 'text';
  className?: string;
  count?: number;
}

export const AdvancedSkeleton: React.FC<AdvancedSkeletonProps> = ({
  variant = 'card',
  className,
  count = 1
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <SkeletonVariant key={i} variant={variant} />
  ));

  return <div className={cn('space-y-4', className)}>{skeletons}</div>;
};

const SkeletonVariant: React.FC<{ variant: string }> = ({ variant }) => {
  switch (variant) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                  <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                </div>
                <div className="mt-4 h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="space-y-4">
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-16 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
      );

    case 'form':
      return (
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      );

    default: // card
      return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      );
  }
};

export default AdvancedSkeleton;
