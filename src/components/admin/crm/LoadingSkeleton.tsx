
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const KanbanSkeleton = () => {
  return (
    <div className="flex gap-4 min-w-max h-full px-3">
      {[1, 2, 3, 4].map((column) => (
        <div key={column} className="w-80 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-white p-3 rounded-lg border">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const CRMLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((card) => (
          <div key={card} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Kanban Skeleton */}
      <div className="bg-white rounded-lg border p-4">
        <KanbanSkeleton />
      </div>
    </div>
  );
};
