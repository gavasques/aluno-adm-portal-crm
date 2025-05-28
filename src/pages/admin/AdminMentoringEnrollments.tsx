
import React from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useMentoring } from '@/hooks/useMentoring';
import { useMentoringEnrollmentsState } from '@/hooks/admin/useMentoringEnrollmentsState';
import { useMentoringEnrollmentActions } from '@/hooks/admin/useMentoringEnrollmentActions';
import { useMentoringEnrollmentSelection } from '@/hooks/admin/useMentoringEnrollmentSelection';
import { EnrollmentsHeader } from '@/components/admin/mentoring/enrollments/EnrollmentsHeader';
import { BulkActions } from '@/components/admin/mentoring/enrollments/BulkActions';
import MentoringEnrollmentsTabs from '@/components/admin/mentoring/enrollments/MentoringEnrollmentsTabs';
import { MentoringEnrollmentsDialogs } from '@/components/admin/mentoring/enrollments/MentoringEnrollmentsDialogs';

const AdminMentoringEnrollments = () => {
  const { enrollments } = useMentoring();
  
  // State management
  const {
    searchTerm,
    statusFilter,
    typeFilter,
    viewMode,
    activeTab,
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setViewMode,
    setActiveTab,
    filteredIndividualEnrollments,
    filteredGroups,
    statistics
  } = useMentoringEnrollmentsState(enrollments);

  // Selection management
  const {
    selectedEnrollments,
    selectedGroups,
    toggleEnrollmentSelection,
    toggleGroupSelection,
    selectAllIndividual,
    clearSelection
  } = useMentoringEnrollmentSelection();

  // Actions management
  const {
    showForm,
    editingEnrollment,
    viewingEnrollment,
    showExtensionDialog,
    selectedEnrollmentForExtension,
    setShowForm,
    setEditingEnrollment,
    setViewingEnrollment,
    setShowExtensionDialog,
    handleCreateEnrollment,
    handleEditEnrollment,
    handleViewEnrollment,
    handleDeleteEnrollment,
    handleAddExtension,
    handleExtensionSubmit,
    handleViewGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleAddStudent,
    handleRemoveStudent,
    handleAddGroup,
    handleBulkAction
  } = useMentoringEnrollmentActions();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Inscrições' }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const handleSelectAllIndividual = () => {
    selectAllIndividual(filteredIndividualEnrollments);
  };

  const handleBulkActionWrapper = (action: string) => {
    handleBulkAction(action, selectedEnrollments, selectedGroups);
  };

  // Convert viewMode from "cards" to "grid" for compatibility
  const convertedViewMode = viewMode === "cards" ? "grid" : viewMode;
  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode === "grid" ? "cards" : mode);
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />

      {/* Header com Filtros e Estatísticas */}
      <EnrollmentsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        viewMode={convertedViewMode}
        onViewModeChange={handleViewModeChange}
        onAddEnrollment={() => setShowForm(true)}
        totalEnrollments={statistics.total}
        activeEnrollments={statistics.active}
        completedEnrollments={statistics.completed}
        pausedEnrollments={statistics.paused}
      />

      {/* Ações em Lote */}
      <BulkActions
        selectedCount={selectedEnrollments.length + selectedGroups.length}
        onBulkAction={handleBulkActionWrapper}
        onClearSelection={clearSelection}
      />

      {/* Tabs para separar Individuais e Grupos */}
      <MentoringEnrollmentsTabs
        selectedTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={convertedViewMode}
        onViewModeChange={handleViewModeChange}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        enrollments={filteredIndividualEnrollments}
        groups={filteredGroups}
        selectedEnrollments={selectedEnrollments}
        selectedGroups={selectedGroups}
        onToggleEnrollmentSelection={toggleEnrollmentSelection}
        onToggleGroupSelection={toggleGroupSelection}
        onCreateEnrollment={() => setShowForm(true)}
        onEditEnrollment={setEditingEnrollment}
        onViewEnrollment={handleViewEnrollment}
        onDeleteEnrollment={handleDeleteEnrollment}
        onAddExtension={handleAddExtension}
        onViewGroup={handleViewGroup}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
        onAddStudent={handleAddStudent}
        onRemoveStudent={handleRemoveStudent}
        onAddGroup={handleAddGroup}
        onBulkAction={handleBulkAction}
      />

      {/* Diálogos */}
      <MentoringEnrollmentsDialogs
        showForm={showForm}
        editingEnrollment={editingEnrollment}
        viewingEnrollment={viewingEnrollment}
        showExtensionDialog={showExtensionDialog}
        selectedEnrollmentForExtension={selectedEnrollmentForExtension}
        onFormClose={() => setShowForm(false)}
        onEditClose={() => setEditingEnrollment(null)}
        onViewClose={() => setViewingEnrollment(null)}
        onExtensionClose={() => setShowExtensionDialog(false)}
        onCreateSuccess={handleCreateEnrollment}
        onEditSubmit={handleEditEnrollment}
        onExtensionSubmit={handleExtensionSubmit}
      />
    </div>
  );
};

export default AdminMentoringEnrollments;
