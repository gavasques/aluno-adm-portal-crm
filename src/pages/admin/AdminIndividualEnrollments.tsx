
import React, { useState, useCallback } from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useOptimizedIndividualEnrollments } from '@/hooks/admin/useOptimizedIndividualEnrollments';
import { useEnrollmentSelection } from '@/hooks/admin/useEnrollmentSelection';
import { useEnrollmentDialogs } from '@/hooks/admin/useEnrollmentDialogs';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { useToast } from '@/hooks/use-toast';
import OptimizedIndividualEnrollmentsHeader from '@/components/admin/mentoring/individual-enrollments/OptimizedIndividualEnrollmentsHeader';
import OptimizedIndividualEnrollmentsContent from '@/components/admin/mentoring/individual-enrollments/OptimizedIndividualEnrollmentsContent';
import { IndividualEnrollmentsLoading } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsLoading';
import { IndividualEnrollmentsEmpty } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsEmpty';
import { IndividualEnrollmentsDialogs } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsDialogs';

const AdminIndividualEnrollments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { deleteEnrollment, addExtension, refreshEnrollments } = useSupabaseMentoring();
  const { toast } = useToast();
  
  const {
    paginatedEnrollments,
    pageInfo,
    statistics,
    isLoading,
    searchTerm,
    statusFilter,
    typeFilter,
    viewMode,
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleClearFilters,
    setViewMode,
    filteredEnrollments
  } = useOptimizedIndividualEnrollments(currentPage, 12);

  const {
    selectedEnrollments,
    toggleEnrollmentSelection
  } = useEnrollmentSelection();

  const {
    showForm,
    editingEnrollment,
    viewingEnrollment,
    showExtensionDialog,
    selectedEnrollmentForExtension,
    handleCreateEnrollment,
    handleEditEnrollment,
    handleViewEnrollment,
    handleAddExtension,
    closeForm,
    closeEdit,
    closeView,
    closeExtension
  } = useEnrollmentDialogs();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Individuais' }
  ];

  const handleDeleteEnrollment = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const success = await deleteEnrollment(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Inscrição excluída com sucesso!",
        });
        await refreshEnrollments();
      } else {
        toast({
          title: "Erro",
          description: "Erro ao excluir inscrição. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir inscrição. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [deleteEnrollment, refreshEnrollments, toast]);

  const handleExtensionSubmit = useCallback(async (data: any) => {
    try {
      const success = await addExtension(data);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Extensão adicionada com sucesso!",
        });
        await refreshEnrollments();
        closeExtension();
      }
    } catch (error) {
      console.error('Error adding extension:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar extensão. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [addExtension, refreshEnrollments, toast, closeExtension]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (isLoading) {
    return <IndividualEnrollmentsLoading />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />

      <OptimizedIndividualEnrollmentsHeader
        searchTerm={searchTerm}
        statusFilter={statusFilter || "all"}
        typeFilter={typeFilter || "all"}
        viewMode={viewMode}
        statistics={statistics}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onViewModeChange={setViewMode}
        onAddEnrollment={handleCreateEnrollment}
        onClearFilters={handleClearFilters}
      />

      {filteredEnrollments.length === 0 ? (
        <IndividualEnrollmentsEmpty onAddEnrollment={handleCreateEnrollment} />
      ) : (
        <OptimizedIndividualEnrollmentsContent
          paginatedEnrollments={paginatedEnrollments}
          viewMode={viewMode}
          selectedEnrollments={selectedEnrollments}
          pageInfo={pageInfo}
          onView={handleViewEnrollment}
          onEdit={handleEditEnrollment}
          onDelete={handleDeleteEnrollment}
          onAddExtension={handleAddExtension}
          onToggleSelection={toggleEnrollmentSelection}
          onPageChange={handlePageChange}
        />
      )}

      <IndividualEnrollmentsDialogs
        showForm={showForm}
        editingEnrollment={editingEnrollment}
        viewingEnrollment={viewingEnrollment}
        showExtensionDialog={showExtensionDialog}
        selectedEnrollmentForExtension={selectedEnrollmentForExtension}
        onFormClose={closeForm}
        onEditClose={closeEdit}
        onViewClose={closeView}
        onExtensionClose={closeExtension}
        onCreateSuccess={handleCreateEnrollment}
        onEditSubmit={handleEditEnrollment}
        onExtensionSubmit={handleExtensionSubmit}
      />
    </div>
  );
};

export default AdminIndividualEnrollments;
