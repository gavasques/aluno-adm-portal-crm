
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import ModernCRMLeadFormDialog from '../ModernCRMLeadFormDialog';
import { CRMDashboardHeader } from './CRMDashboardHeader';
import { CRMDashboardContent } from './CRMDashboardContent';
import { useCRMDashboardState } from './useCRMDashboardState';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const navigate = useNavigate();
  
  // Estado do dashboard
  const {
    activeTab,
    setActiveTab,
    activeView,
    setActiveView,
    showFilters,
    setShowFilters,
    selectedPipelineId,
    setSelectedPipelineId,
    showLeadForm,
    setShowLeadForm,
    selectedColumnId,
    filters,
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter,
    effectiveFilters,
    handleCreateLead,
    handleLeadFormSuccess,
    handleTagsChange
  } = useCRMDashboardState();

  // Hooks de dados
  const { pipelines, loading: pipelinesLoading } = useCRMPipelines();
  const { tags } = useCRMTags();
  const { users } = useCRMUsers();

  // Get pipeline columns from the selected pipeline
  const pipelineColumns = selectedPipelineId 
    ? pipelines.find(p => p.id === selectedPipelineId)?.columns || []
    : [];

  const handleOpenLead = React.useCallback((leadId: string) => {
    if (onOpenLead) {
      onOpenLead(leadId);
    } else {
      navigate(`/admin/lead/${leadId}`);
    }
  }, [navigate, onOpenLead]);

  // Função wrapper para corrigir o tipo do setActiveTab
  const handleTabChange = React.useCallback((tab: string) => {
    setActiveTab(tab as 'dashboard' | 'reports' | 'analytics' | 'settings');
  }, [setActiveTab]);

  // Selecionar primeiro pipeline se nenhum estiver selecionado
  React.useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId, setSelectedPipelineId]);

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="h-full w-full flex flex-col"
      >
        {/* Header com Tabs */}
        <CRMDashboardHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Conteúdo das Tabs - Ocupando toda largura disponível */}
        <div className="flex-1 w-full">
          <CRMDashboardContent
            activeTab={activeTab}
            activeView={activeView}
            onViewChange={setActiveView}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            selectedPipelineId={selectedPipelineId}
            onPipelineChange={setSelectedPipelineId}
            pipelines={pipelines}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isDebouncing={isDebouncing}
            filters={filters}
            updateFilter={updateFilter}
            pipelineColumns={pipelineColumns}
            users={users}
            tags={tags}
            handleTagsChange={handleTagsChange}
            effectiveFilters={effectiveFilters}
            onCreateLead={handleCreateLead}
          />
        </div>
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
