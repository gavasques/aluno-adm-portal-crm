
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedFilters } from '../filters/AdvancedFilters';
import { DashboardContent } from '../dashboard/DashboardContent';
import { ModernDashboardToolbar } from '../dashboard/ModernDashboardToolbar';
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
  console.log('🎯 [CRMDashboardContent] Renderizando:', {
    activeTab,
    selectedPipelineId,
    pipelinesCount: pipelines.length,
    usersCount: users.length,
    tagsCount: tags.length
  });

  // Renderização condicional baseada na aba ativa
  const renderActiveTabContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return (
            <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100/50">
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
                  users={users}
                  tags={tags}
                  handleTagsChange={handleTagsChange}
                />
              </div>

              {/* Filtros Avançados */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0"
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
          console.warn('🚨 [CRMDashboardContent] Tab desconhecida:', activeTab);
          return (
            <div className="h-full w-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                  Conteúdo não encontrado
                </h2>
                <p className="text-gray-500">
                  A aba "{activeTab}" não foi reconhecida.
                </p>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error('❌ [CRMDashboardContent] Erro ao renderizar tab:', error);
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar conteúdo
            </h2>
            <p className="text-gray-500 mb-4">
              Ocorreu um erro ao renderizar o conteúdo do CRM.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full">
      {renderActiveTabContent()}
    </div>
  );
};
