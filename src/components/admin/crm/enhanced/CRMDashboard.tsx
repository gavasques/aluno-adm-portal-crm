
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
import { motion } from 'framer-motion';

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
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] pointer-events-none" />
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="h-full w-full flex flex-col relative z-10"
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
