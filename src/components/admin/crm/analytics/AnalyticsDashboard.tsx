
import React from 'react';
import { useCRMAnalytics } from '@/hooks/crm/useCRMAnalytics';
import { AnalyticsDashboardHeader } from './AnalyticsDashboardHeader';
import { AnalyticsOverviewCards } from './AnalyticsOverviewCards';
import { AnalyticsTabsContainer } from './AnalyticsTabsContainer';

interface AnalyticsDashboardProps {
  dateRange: { from: Date; to: Date };
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ dateRange }) => {
  const { analyticsMetrics, leadSourceAnalysis, conversionFunnel, isLoading } = useCRMAnalytics(dateRange);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        <AnalyticsDashboardHeader />
        
        <AnalyticsOverviewCards analyticsMetrics={analyticsMetrics} />
        
        <AnalyticsTabsContainer
          analyticsMetrics={analyticsMetrics}
          leadSourceAnalysis={leadSourceAnalysis}
          conversionFunnel={conversionFunnel}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
