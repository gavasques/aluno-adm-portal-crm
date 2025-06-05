
import React from 'react';
import { motion } from 'framer-motion';
import { ModernDashboardToolbar } from '../dashboard/ModernDashboardToolbar';
import { DashboardContent } from '../dashboard/DashboardContent';
import { CRMMetricsCards } from '../dashboard/CRMMetricsCards';
import { AdvancedFilters } from '../filters/AdvancedFilters';
import { AnimatePresence } from 'framer-motion';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMFiltersState } from '@/hooks/crm/useCRMFiltersState';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { useUnifiedCRMData } from '@/hooks/crm/useUnifiedCRMData';
import { useCRMContactAutoSync } from '@/hooks/crm/useCRMContactAutoSync';
import { useState } from 'react';
import { CRMFilters } from '@/types/crm.types';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

export const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [filters, setFilters] = useState<CRMFilters>({});

  // Hooks para dados
  const { pipelines, columns, loading: pipelinesLoading } = useCRMPipelines();
  const { tags } = useCRMTags();
  const { users } = useCRMUsers();
  
  // Filtros efetivos
  const effectiveFilters = {
    ...filters,
    pipeline_id: selectedPipelineId || filters.pipeline_id
  };

  const { leadsWithContacts, leadsByColumn, loading: leadsLoading } = useUnifiedCRMData(effectiveFilters);
  
  // Hook para filtros com search
  const {
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter
  } = useCRMFiltersState(filters, setFilters);

  // Ativar sincronização automática de contatos
  useCRMContactAutoSync();

  const isLoading = pipelinesLoading || leadsLoading;

  const handleCreateLead = (columnId?: string) => {
    console.log('Create lead for column:', columnId);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFiltersChange = (newFilters: Partial<CRMFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-gray-50"
    >
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

      {/* Toolbar */}
      <div className="flex-shrink-0">
        <ModernDashboardToolbar
          activeView={activeView}
          onViewChange={setActiveView}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          onCreateLead={handleCreateLead}
          filters={effectiveFilters}
          pipelineId={selectedPipelineId}
          onPipelineChange={setSelectedPipelineId}
          pipelines={pipelines}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isDebouncing={isDebouncing}
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
              pipelineColumns={columns}
              users={users}
              tags={tags}
              handleTagsChange={(tagIds: string[]) => updateFilter('tag_ids', tagIds)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      <div className="flex-1 min-h-0 w-full">
        <DashboardContent
          activeView={activeView}
          effectiveFilters={effectiveFilters}
          selectedPipelineId={selectedPipelineId}
          onCreateLead={handleCreateLead}
        />
      </div>
    </motion.div>
  );
};
