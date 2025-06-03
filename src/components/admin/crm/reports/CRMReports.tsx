
import React from 'react';
import { useCRMReports } from '@/hooks/crm/useCRMReports';
import { useCRMReportsFilters } from '@/hooks/crm/useCRMReportsFilters';
import { useCRMReportsExport } from '@/hooks/crm/useCRMReportsExport';
import CRMReportsOverview from './CRMReportsOverview';
import CRMReportsHeader from './CRMReportsHeader';
import CRMReportsTabsContainer from './CRMReportsTabsContainer';

const CRMReports: React.FC = () => {
  const { dateRange, setDateRange } = useCRMReportsFilters();
  const { exportReport } = useCRMReportsExport();

  const { 
    metrics, 
    pipelineMetrics, 
    responsibleMetrics, 
    periodData, 
    loading 
  } = useCRMReports(dateRange);

  const handleExportReport = () => {
    exportReport(metrics, pipelineMetrics, responsibleMetrics, periodData);
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header com filtros */}
        <CRMReportsHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExport={handleExportReport}
        />

        {/* Overview Cards */}
        <CRMReportsOverview metrics={metrics} loading={loading} />

        {/* Tabs de Relatórios */}
        <CRMReportsTabsContainer
          pipelineMetrics={pipelineMetrics}
          responsibleMetrics={responsibleMetrics}
          periodData={periodData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CRMReports;
