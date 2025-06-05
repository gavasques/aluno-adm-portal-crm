
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardContent } from '../dashboard/DashboardContent';
import { ModernDashboardToolbar } from '../dashboard/ModernDashboardToolbar';
import { CRMMetricsCards } from '../dashboard/CRMMetricsCards';
import CRMReports from '../reports/CRMReports';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import { CRMSettings } from '../settings/CRMSettings';
import { CRMFilters, CRMPipeline, CRMUser, CRMTag, CRMPipelineColumn } from '@/types/crm.types';

interface CRMDashboardContentProps {
  activeTab: 'dashboard' | 'reports' | 'analytics' | 'settings';
  activeView: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  selectedPipelineId: string;
  onPipelineChange: (pipelineId: string) => void;
  pipelines: CRMPipeline[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  isDebouncing: boolean;
  filters: CRMFilters;
  updateFilter: (key: keyof CRMFilters, value: any) => void;
  removeFilter: (key: keyof CRMFilters) => void;
  clearAllFilters: () => void;
  pipelineColumns: CRMPipelineColumn[];
  users: CRMUser[];
  tags: CRMTag[];
  handleTagsChange: (tagIds: string[]) => void;
  effectiveFilters: CRMFilters;
  onCreateLead: (columnId?: string) => void;
  activeFiltersCount: number;
}

export const CRMDashboardContent: React.FC<CRMDashboardContentProps> = ({
  activeTab,
  activeView,
  onViewChange,
  showFilters,
  onToggleFilters,
  selectedPipelineId,
  onPipelineChange,
  pipelines,
  searchValue,
  setSearchValue,
  isDebouncing,
  filters,
  updateFilter,
  removeFilter,
  clearAllFilters,
  pipelineColumns,
  users,
  tags,
  handleTagsChange,
  effectiveFilters,
  onCreateLead,
  activeFiltersCount
}) => {
  // Renderização condicional baseada na aba ativa
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100/50">
            {/* Métricas/KPIs */}
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <CRMMetricsCards />
              </motion.div>
            </div>

            {/* Toolbar Integrada com Filtros Primários */}
            <div className="flex-shrink-0">
              <ModernDashboardToolbar
                activeView={activeView}
                onViewChange={onViewChange}
                showFilters={showFilters}
                onToggleFilters={onToggleFilters}
                onCreateLead={onCreateLead}
                filters={effectiveFilters}
                pipelineId={selectedPipelineId}
                onPipelineChange={onPipelineChange}
                pipelines={pipelines}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isDebouncing={isDebouncing}
                updateFilter={updateFilter}
                removeFilter={removeFilter}
                clearAllFilters={clearAllFilters}
                pipelineColumns={pipelineColumns}
                users={users}
                tags={tags}
                activeFiltersCount={activeFiltersCount}
              />
            </div>

            {/* Conteúdo Principal - Usar toda altura restante e largura completa */}
            <div className="flex-1 min-h-0 w-full">
              <DashboardContent
                activeView={activeView}
                effectiveFilters={effectiveFilters}
                selectedPipelineId={selectedPipelineId}
                onCreateLead={onCreateLead}
              />
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100/50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <CRMReports />
            </motion.div>
          </div>
        );

      case 'analytics':
        return (
          <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100/50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <AnalyticsDashboard 
                dateRange={{
                  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  to: new Date()
                }}
              />
            </motion.div>
          </div>
        );

      case 'settings':
        return (
          <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100/50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <CRMSettings />
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full">
      {renderActiveTabContent()}
    </div>
  );
};
