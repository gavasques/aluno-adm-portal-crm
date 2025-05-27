
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface EnrollmentProgressProps {
  sessionsUsed: number;
  totalSessions: number;
  className?: string;
  showPercentage?: boolean;
}

export const EnrollmentProgress = memo<EnrollmentProgressProps>(({ 
  sessionsUsed, 
  totalSessions, 
  className,
  showPercentage = true 
}) => {
  const progressPercentage = totalSessions > 0 ? (sessionsUsed / totalSessions) * 100 : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{sessionsUsed}/{totalSessions}</span>
        {showPercentage && <span>{Math.round(progressPercentage)}%</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            getProgressColor(progressPercentage)
          )}
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
});

EnrollmentProgress.displayName = 'EnrollmentProgress';
