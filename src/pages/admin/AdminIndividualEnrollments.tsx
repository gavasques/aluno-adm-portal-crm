
import React from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useIndividualEnrollments } from '@/hooks/admin/useIndividualEnrollments';
import { ModernIndividualEnrollmentsHeader } from '@/components/admin/mentoring/enrollments/ModernIndividualEnrollmentsHeader';
import { IndividualEnrollmentsLoading } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsLoading';
import { IndividualEnrollmentsEmpty } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsEmpty';
import { IndividualEnrollmentsContent } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsContent';
import { IndividualEnrollmentsDialogs } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsDialogs';

const AdminIndividualEnrollments = () => {
  const {
    // Data
    filteredEnrollments,
    paginatedEnrollments,
    pageInfo,
    statistics,
    loading,
    
    // State
    searchTerm,
    statusFilter,
    typeFilter,
    viewMode,
    showForm,
    editingEnrollment,
    viewingEnrollment,
    selectedEnrollments,
    showExtensionDialog,
    selectedEnrollmentForExtension,
    
    // Setters
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setViewMode,
    setShowForm,
    setEditingEnrollment,
    setViewingEnrollment,
    setShowExtensionDialog,
    
    // Handlers
    handleCreateEnrollment,
    handleEditEnrollment,
    handleViewEnrollment,
    handleDeleteEnrollment,
    handleAddExtension,
    handleExtensionSubmit,
    toggleEnrollmentSelection,
    handlePageChange
  } = useIndividualEnrollments();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Individuais' }
  ];

  if (loading) {
    return <IndividualEnrollmentsLoading />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />

      {/* Header Moderno */}
      <ModernIndividualEnrollmentsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddEnrollment={() => setShowForm(true)}
        statistics={statistics}
      />

      {/* Conteúdo */}
      {filteredEnrollments.length === 0 ? (
        <IndividualEnrollmentsEmpty onAddEnrollment={() => setShowForm(true)} />
      ) : (
        <IndividualEnrollmentsContent
          paginatedEnrollments={paginatedEnrollments}
          viewMode={viewMode}
          selectedEnrollments={selectedEnrollments}
          pageInfo={pageInfo}
          onView={handleViewEnrollment}
          onEdit={setEditingEnrollment}
          onDelete={handleDeleteEnrollment}
          onAddExtension={handleAddExtension}
          onToggleSelection={toggleEnrollmentSelection}
          onPageChange={handlePageChange}
        />
      )}

      {/* Diálogos */}
      <IndividualEnrollmentsDialogs
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

export default AdminIndividualEnrollments;
