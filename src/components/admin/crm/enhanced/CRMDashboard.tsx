
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
import { CORSDebugSection } from '@/components/admin/dashboard/CORSDebugSection';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const navigate = useNavigate();
  const [loadingSequence, setLoadingSequence] = React.useState<'pipelines' | 'users' | 'tags' | 'complete'>('pipelines');
  const [hasError, setHasError] = React.useState(false);
  const [showDiagnostics, setShowDiagnostics] = React.useState(false);
  
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

  // Hooks de dados com loading sequencial
  const { pipelines, loading: pipelinesLoading, error: pipelinesError } = useCRMPipelines();
  
  // Carregar usuários só depois dos pipelines
  const { users, error: usersError } = useCRMUsers({
    enabled: !pipelinesLoading && !pipelinesError
  });
  
  // Carregar tags só depois dos usuários
  const { tags, error: tagsError } = useCRMTags({
    enabled: !pipelinesLoading && !pipelinesError && !usersError
  });

  // Gerenciar sequência de loading
  React.useEffect(() => {
    if (pipelinesLoading) {
      setLoadingSequence('pipelines');
    } else if (pipelinesError || usersError || tagsError) {
      setHasError(true);
      console.error('❌ [CRM_DASHBOARD] Erro ao carregar dados:', {
        pipelinesError,
        usersError,
        tagsError
      });
    } else if (pipelines.length > 0) {
      setLoadingSequence('users');
      setTimeout(() => {
        setLoadingSequence('tags');
        setTimeout(() => {
          setLoadingSequence('complete');
        }, 300);
      }, 300);
    }
  }, [pipelinesLoading, pipelinesError, usersError, tagsError, pipelines.length]);

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

  // Renderizar erro se houver problemas
  if (hasError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-6"
        >
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <h2 className="text-lg font-semibold text-orange-800">
                  Erro ao Carregar Dados do CRM
                </h2>
              </div>
              <p className="text-orange-700 mb-4">
                Houve um problema ao carregar os dados do CRM. Isso pode ser relacionado 
                a conectividade ou configuração.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Recarregar Página
                </Button>
                <Button 
                  onClick={() => setShowDiagnostics(!showDiagnostics)} 
                  variant="secondary"
                >
                  {showDiagnostics ? 'Ocultar' : 'Mostrar'} Diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>

          {showDiagnostics && <CORSDebugSection />}
        </motion.div>
      </div>
    );
  }

  // Renderizar loading sequencial
  if (loadingSequence !== 'complete') {
    const loadingMessages = {
      pipelines: 'Carregando pipelines...',
      users: 'Carregando usuários...',
      tags: 'Carregando tags...'
    };

    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600 font-medium">
            {loadingMessages[loadingSequence]}
          </span>
        </motion.div>
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
