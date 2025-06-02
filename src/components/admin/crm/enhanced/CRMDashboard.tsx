
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrimaryFilters } from '../filters/PrimaryFilters';
import { AdvancedFilters } from '../filters/AdvancedFilters';
import { DashboardContent } from '../dashboard/DashboardContent';
import { DashboardToolbar } from '../dashboard/DashboardToolbar';
import { StatusReports } from '../reports/StatusReports';
import { CRMFilters } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMFiltersState } from '@/hooks/crm/useCRMFiltersState';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import ModernCRMLeadFormDialog from '../ModernCRMLeadFormDialog';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const navigate = useNavigate();
  
  // Estados principais
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports'>('dashboard');
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>();

  // Estados de filtros
  const [filters, setFilters] = useState<CRMFilters>({});

  // Hooks
  const { pipelines, loading: pipelinesLoading } = useCRMPipelines();
  const { tags } = useCRMTags();
  const { users } = useCRMUsers();

  // Get pipeline columns from the selected pipeline
  const pipelineColumns = selectedPipelineId 
    ? pipelines.find(p => p.id === selectedPipelineId)?.columns || []
    : [];

  // Hook para gerenciar filtros
  const {
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter,
    clearAllFilters
  } = useCRMFiltersState(filters, setFilters);

  // Handlers
  const handleCreateLead = useCallback((columnId?: string) => {
    setSelectedColumnId(columnId);
    setShowLeadForm(true);
  }, []);

  const handleLeadFormSuccess = useCallback(() => {
    setShowLeadForm(false);
    setSelectedColumnId(undefined);
  }, []);

  const handleOpenLead = useCallback((leadId: string) => {
    if (onOpenLead) {
      onOpenLead(leadId);
    } else {
      navigate(`/admin/lead/${leadId}`);
    }
  }, [navigate, onOpenLead]);

  const handleTagsChange = useCallback((tagIds: string[]) => {
    updateFilter('tag_ids', tagIds);
  }, [updateFilter]);

  // Filtros efetivos
  const effectiveFilters: CRMFilters = {
    ...filters,
    pipeline_id: selectedPipelineId || filters.pipeline_id
  };

  // Selecionar primeiro pipeline se nenhum estiver selecionado
  React.useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId]);

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'reports')} className="flex-1 flex flex-col">
        {/* Header com Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
                <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
              </div>
              
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="dashboard" className="flex-1 flex flex-col m-0">
          {/* Filtros Primários */}
          <div className="bg-white border-b border-gray-200 p-4">
            <PrimaryFilters
              pipelineId={selectedPipelineId}
              onPipelineChange={setSelectedPipelineId}
              pipelines={pipelines}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isDebouncing={isDebouncing}
            />
          </div>

          {/* Toolbar */}
          <DashboardToolbar
            activeView={activeView}
            onViewChange={setActiveView}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onCreateLead={handleCreateLead}
            filters={effectiveFilters}
          />

          {/* Filtros Avançados */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-white border-b border-gray-200 p-4"
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

          {/* Conteúdo Principal */}
          <div className="flex-1 overflow-hidden">
            <DashboardContent
              activeView={activeView}
              effectiveFilters={effectiveFilters}
              selectedPipelineId={selectedPipelineId}
              onCreateLead={handleCreateLead}
            />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="flex-1 m-0 p-6 overflow-y-auto">
          <StatusReports />
        </TabsContent>
      </Tabs>

      {/* Modal de Lead */}
      <ModernCRMLeadFormDialog
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        onSuccess={handleLeadFormSuccess}
        pipelineId={selectedPipelineId}
        initialColumnId={selectedColumnId}
        mode="create"
      />
    </div>
  );
};

export default CRMDashboard;
