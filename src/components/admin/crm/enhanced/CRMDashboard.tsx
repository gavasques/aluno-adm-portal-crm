
import React from 'react';
import { motion } from 'framer-motion';
import { CRMDashboardHeader } from './CRMDashboardHeader';
import { CRMDashboardContent } from './CRMDashboardContent';
import { useCRMDashboardState } from './useCRMDashboardState';
import { useCRMContactAutoSync } from '@/hooks/crm/useCRMContactAutoSync';

export const CRMDashboard: React.FC = () => {
  const {
    // Estado e dados
    currentPipelineId,
    activeView,
    showFilters,
    searchValue,
    debouncedSearchValue,
    isDebouncing,
    filters,
    
    // Dados das queries
    pipelines,
    columns,
    tags,
    users,
    leadsWithContacts,
    leadsByColumn,
    isLoading,
    
    // Handlers
    handlePipelineChange,
    handleViewChange,
    handleToggleFilters,
    handleCreateLead,
    handleSearchChange,
    handleFiltersChange,
    handleOpenReports,
    
    // Estados dos modais
    showLeadForm,
    setShowLeadForm,
    showReports,
    setShowReports,
    editingLead,
    setEditingLead,
    selectedColumnId,
    setSelectedColumnId
  } = useCRMDashboardState();

  // Ativar sincronização automática de contatos
  useCRMContactAutoSync();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-gray-50"
    >
      {/* Header fixo */}
      <CRMDashboardHeader
        activeView={activeView}
        onViewChange={handleViewChange}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
        onCreateLead={handleCreateLead}
        filters={filters}
        onOpenReports={handleOpenReports}
        pipelineId={currentPipelineId}
        onPipelineChange={handlePipelineChange}
        pipelines={pipelines}
        searchValue={searchValue}
        setSearchValue={handleSearchChange}
        isDebouncing={isDebouncing}
      />

      {/* Conteúdo principal */}
      <CRMDashboardContent
        activeView={activeView}
        showFilters={showFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        searchValue={debouncedSearchValue}
        currentPipelineId={currentPipelineId}
        columns={columns}
        tags={tags}
        users={users}
        leadsWithContacts={leadsWithContacts}
        leadsByColumn={leadsByColumn}
        isLoading={isLoading}
        onCreateLead={handleCreateLead}
        showLeadForm={showLeadForm}
        setShowLeadForm={setShowLeadForm}
        showReports={showReports}
        setShowReports={setShowReports}
        editingLead={editingLead}
        setEditingLead={setEditingLead}
        selectedColumnId={selectedColumnId}
        setSelectedColumnId={setSelectedColumnId}
      />
    </motion.div>
  );
};
