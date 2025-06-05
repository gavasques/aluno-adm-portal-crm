
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
  // Estado das abas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'analytics' | 'settings'>('dashboard');
  
  // Estado da view e filtros
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

  // Ativar sincronização automática aprimorada de contatos
  useCRMContactAutoSyncImproved();

  const isLoading = pipelinesLoading || leadsLoading;

  // Handlers
  const handleCreateLead = (columnId?: string) => {
    console.log('Create lead for column:', columnId);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFiltersChange = (newFilters: Partial<CRMFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTagsChange = (tagIds: string[]) => {
    updateFilter('tag_ids', tagIds);
  };

  // Função wrapper para converter o tipo do setActiveTab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'dashboard' | 'reports' | 'analytics' | 'settings');
  };

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
};
