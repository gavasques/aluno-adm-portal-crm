
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  variant?: 'card' | 'list' | 'table' | 'form';
  count?: number;
  message?: string;
}

export const MentoringLoadingState: React.FC<LoadingStateProps> = ({
  variant = 'card',
  count = 3,
  message = 'Carregando...'
}) => {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border rounded">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 p-4 border-b">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-4" />
          ))}
        </div>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b">
            {Array.from({ length: 4 }).map((_, cellIndex) => (
              <Skeleton key={cellIndex} className="h-4" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Default spinner loading
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
