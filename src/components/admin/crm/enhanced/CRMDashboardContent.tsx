
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryFilters } from '../filters/PrimaryFilters';
import { AdvancedFilters } from '../filters/AdvancedFilters';
import { DashboardContent } from '../dashboard/DashboardContent';
import { DashboardToolbar } from '../dashboard/DashboardToolbar';
import CRMReports from '../reports/CRMReports';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import { CRMSettings } from '../settings/CRMSettings';
import { CRMFilters, CRMPipeline, CRMUser, CRMTag } from '@/types/crm.types';

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
  pipelineColumns: any[];
  users: CRMUser[];
  tags: CRMTag[];
  handleTagsChange: (tagIds: string[]) => void;
  effectiveFilters: CRMFilters;
  onCreateLead: (columnId?: string) => void;
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
  pipelineColumns,
  users,
  tags,
  handleTagsChange,
  effectiveFilters,
  onCreateLead
}) => {
  // Renderização condicional baseada na aba ativa
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="h-full flex flex-col">
            {/* Filtros Primários */}
            <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
              <PrimaryFilters
                pipelineId={selectedPipelineId}
                onPipelineChange={onPipelineChange}
                pipelines={pipelines}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isDebouncing={isDebouncing}
              />
            </div>

            {/* Toolbar */}
            <div className="flex-shrink-0">
              <DashboardToolbar
                activeView={activeView}
                onViewChange={onViewChange}
                showFilters={showFilters}
                onToggleFilters={onToggleFilters}
                onCreateLead={onCreateLead}
                filters={effectiveFilters}
              />
            </div>

            {/* Filtros Avançados */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-white border-b border-gray-200 p-4 flex-shrink-0"
                >
                  <AdvancedFilters
                    filters={filters}
                    updateFilter={updateFilter}
                    pipelineColumns={pipelineColumns}
                    users={users}
                    tags={tags}
                    handleTagsChange={handleTagsChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conteúdo Principal - Usar toda altura restante */}
            <div className="flex-1 min-h-0">
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
          <div className="h-full">
            <CRMReports />
          </div>
        );

      case 'analytics':
        return (
          <div className="h-full">
            <AnalyticsDashboard 
              dateRange={{
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                to: new Date()
              }}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="h-full">
            <CRMSettings />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 min-h-0">
      {renderActiveTabContent()}
    </div>
  );
};
