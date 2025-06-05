import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRMDashboardHeader } from './CRMDashboardHeader';
import { CRMDashboardContent } from './CRMDashboardContent';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMFiltersState } from '@/hooks/crm/useCRMFiltersState';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { useUnifiedCRMData } from '@/hooks/crm/useUnifiedCRMData';
import { useCRMContactAutoSyncImproved } from '@/hooks/crm/useCRMContactAutoSyncImproved';
import { CRMFilters } from '@/types/crm.types';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

export const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  console.log('🚀 [CRMDashboard] Inicializando dashboard...');

  try {
    // Estado das abas
    const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'analytics' | 'settings'>('dashboard');
    
    // Estado da view e filtros
    const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
    const [filters, setFilters] = useState<CRMFilters>({});

    console.log('📊 [CRMDashboard] Estado inicial:', {
      activeTab,
      activeView,
      selectedPipelineId,
      filtersCount: Object.keys(filters).length
    });

    // Hooks para dados - removendo error que não existe
    const { pipelines, columns, loading: pipelinesLoading } = useCRMPipelines();
    const { tags, loading: tagsLoading } = useCRMTags();
    const { users, loading: usersLoading } = useCRMUsers();
    
    console.log('🔄 [CRMDashboard] Dados carregados:', {
      pipelines: pipelines.length,
      columns: columns.length,
      tags: tags.length,
      users: users.length,
      pipelinesLoading,
      tagsLoading,
      usersLoading
    });

    // Filtros efetivos
    const effectiveFilters = {
      ...filters,
      pipeline_id: selectedPipelineId || filters.pipeline_id
    };

    const { leadsWithContacts, leadsByColumn, loading: leadsLoading, error: leadsError } = useUnifiedCRMData(effectiveFilters);
    
    // Hook para filtros com search
    const {
      searchValue,
      setSearchValue,
      isDebouncing,
      updateFilter
    } = useCRMFiltersState(filters, setFilters);

    // Ativar sincronização automática aprimorada de contatos
    useCRMContactAutoSyncImproved();

    const isLoading = pipelinesLoading || leadsLoading || tagsLoading || usersLoading;

    console.log('⚡ [CRMDashboard] Status:', {
      isLoading,
      hasError: !!leadsError,
      leadsCount: leadsWithContacts.length
    });

    // Handlers
    const handleCreateLead = (columnId?: string) => {
      console.log('➕ [CRMDashboard] Create lead para coluna:', columnId);
    };

    const handleToggleFilters = () => {
      console.log('🔍 [CRMDashboard] Toggle filtros:', !showFilters);
      setShowFilters(!showFilters);
    };

    const handleFiltersChange = (newFilters: Partial<CRMFilters>) => {
      console.log('🎛️ [CRMDashboard] Atualizando filtros:', newFilters);
      setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleTagsChange = (tagIds: string[]) => {
      console.log('🏷️ [CRMDashboard] Alterando tags:', tagIds);
      updateFilter('tag_ids', tagIds);
    };

    // Função wrapper para converter o tipo do setActiveTab
    const handleTabChange = (tab: string) => {
      console.log('📋 [CRMDashboard] Mudando aba:', tab);
      setActiveTab(tab as 'dashboard' | 'reports' | 'analytics' | 'settings');
    };

    // Log de erros apenas para leads
    if (leadsError) {
      console.error('❌ [CRMDashboard] Erro ao carregar leads:', leadsError);
    }

    // Estado de loading
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando CRM...</p>
            <p className="text-sm text-gray-500 mt-2">
              Pipelines: {pipelinesLoading ? 'Carregando...' : 'OK'} | 
              Leads: {leadsLoading ? 'Carregando...' : 'OK'} | 
              Tags: {tagsLoading ? 'Carregando...' : 'OK'} | 
              Users: {usersLoading ? 'Carregando...' : 'OK'}
            </p>
          </div>
        </div>
      );
    }

    // Estado de erro apenas para leads
    if (leadsError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar CRM
            </h2>
            <p className="text-gray-500 mb-4">
              {leadsError?.message || 'Erro desconhecido'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full bg-gray-50"
      >
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          {/* Header com as abas */}
          <CRMDashboardHeader
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedPipelineId={selectedPipelineId}
          />

          {/* Conteúdo das abas */}
          <div className="flex-1 min-h-0">
            <TabsContent value="dashboard" className="h-full m-0">
              <CRMDashboardContent
                activeTab="dashboard"
                activeView={activeView}
                onViewChange={setActiveView}
                showFilters={showFilters}
                onToggleFilters={handleToggleFilters}
                selectedPipelineId={selectedPipelineId}
                onPipelineChange={setSelectedPipelineId}
                pipelines={pipelines}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isDebouncing={isDebouncing}
                filters={filters}
                updateFilter={updateFilter}
                pipelineColumns={columns}
                users={users}
                tags={tags}
                handleTagsChange={handleTagsChange}
                effectiveFilters={effectiveFilters}
                onCreateLead={handleCreateLead}
              />
            </TabsContent>

            <TabsContent value="reports" className="h-full m-0">
              <CRMDashboardContent
                activeTab="reports"
                activeView={activeView}
                onViewChange={setActiveView}
                showFilters={showFilters}
                onToggleFilters={handleToggleFilters}
                selectedPipelineId={selectedPipelineId}
                onPipelineChange={setSelectedPipelineId}
                pipelines={pipelines}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isDebouncing={isDebouncing}
                filters={filters}
                updateFilter={updateFilter}
                pipelineColumns={columns}
                users={users}
                tags={tags}
                handleTagsChange={handleTagsChange}
                effectiveFilters={effectiveFilters}
                onCreateLead={handleCreateLead}
              />
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <CRMDashboardContent
                activeTab="analytics"
                activeView={activeView}
                onViewChange={setActiveView}
                showFilters={showFilters}
                onToggleFilters={handleToggleFilters}
                selectedPipelineId={selectedPipelineId}
                onPipelineChange={setSelectedPipelineId}
                pipelines={pipelines}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isDebouncing={isDebouncing}
                filters={filters}
                updateFilter={updateFilter}
                pipelineColumns={columns}
                users={users}
                tags={tags}
                handleTagsChange={handleTagsChange}
                effectiveFilters={effectiveFilters}
                onCreateLead={handleCreateLead}
              />
            </TabsContent>

            <TabsContent value="settings" className="h-full m-0">
              <CRMDashboardContent
                activeTab="settings"
                activeView={activeView}
                onViewChange={setActiveView}
                showFilters={showFilters}
                onToggleFilters={handleToggleFilters}
                selectedPipelineId={selectedPipelineId}
                onPipelineChange={setSelectedPipelineId}
                pipelines={pipelines}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isDebouncing={isDebouncing}
                filters={filters}
                updateFilter={updateFilter}
                pipelineColumns={columns}
                users={users}
                tags={tags}
                handleTagsChange={handleTagsChange}
                effectiveFilters={effectiveFilters}
                onCreateLead={handleCreateLead}
              />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    );

  } catch (error) {
    console.error('❌ [CRMDashboard] Erro crítico:', error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erro crítico no CRM
          </h2>
          <p className="text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
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
