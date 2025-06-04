
import React from 'react';
import { useCRMAnalytics } from '@/hooks/crm/useCRMAnalytics';
import { AnalyticsDashboardHeader } from './AnalyticsDashboardHeader';
import { AnalyticsOverviewCards } from './AnalyticsOverviewCards';
import { AnalyticsTabsContainer } from './AnalyticsTabsContainer';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsDashboardProps {
  dateRange: { from: Date; to: Date };
}

const AnalyticsLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-20 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="h-64 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  </div>
);

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ dateRange }) => {
  const { analyticsMetrics, conversionFunnel, isLoading } = useCRMAnalytics(dateRange);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        <div className="p-4 space-y-4">
          <AnalyticsDashboardHeader />
          <AnalyticsLoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-4">
        <AnalyticsDashboardHeader />
        
        <AnalyticsOverviewCards 
          analyticsMetrics={analyticsMetrics} 
          dateRange={dateRange}
        />
        
        <AnalyticsTabsContainer
          analyticsMetrics={analyticsMetrics}
          conversionFunnel={conversionFunnel}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
