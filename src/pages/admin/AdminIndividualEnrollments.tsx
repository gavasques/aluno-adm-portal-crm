
import React, { useState, useCallback } from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useOptimizedIndividualEnrollments } from '@/hooks/admin/useOptimizedIndividualEnrollments';
import OptimizedIndividualEnrollmentsHeader from '@/components/admin/mentoring/individual-enrollments/OptimizedIndividualEnrollmentsHeader';
import OptimizedIndividualEnrollmentsContent from '@/components/admin/mentoring/individual-enrollments/OptimizedIndividualEnrollmentsContent';
import { IndividualEnrollmentsLoading } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsLoading';
import { IndividualEnrollmentsEmpty } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsEmpty';
import { IndividualEnrollmentsDialogs } from '@/components/admin/mentoring/individual-enrollments/IndividualEnrollmentsDialogs';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

const AdminIndividualEnrollments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  
  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

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

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Individuais' }
  ];

  // Handlers
  const handleCreateEnrollment = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleEditEnrollment = useCallback((enrollment: StudentMentoringEnrollment) => {
    setEditingEnrollment(enrollment);
  }, []);

  const handleViewEnrollment = useCallback((enrollment: StudentMentoringEnrollment) => {
    setViewingEnrollment(enrollment);
  }, []);

  const handleDeleteEnrollment = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição?')) {
      return;
    }
    console.log('Delete enrollment:', id);
  }, []);

  const handleAddExtension = useCallback((enrollment: StudentMentoringEnrollment) => {
    setSelectedEnrollmentForExtension(enrollment);
    setShowExtensionDialog(true);
  }, []);

  const handleExtensionSubmit = useCallback(async (data: any) => {
    console.log('Extension submitted:', data);
    setShowExtensionDialog(false);
    setSelectedEnrollmentForExtension(null);
  }, []);

  const toggleEnrollmentSelection = useCallback((id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(enrollmentId => enrollmentId !== id)
        : [...prev, id]
    );
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (isLoading) {
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

      {/* Header Otimizado */}
      <OptimizedIndividualEnrollmentsHeader
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        viewMode={viewMode}
        statistics={statistics}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onViewModeChange={setViewMode}
        onAddEnrollment={handleCreateEnrollment}
        onClearFilters={handleClearFilters}
      />

      {/* Conteúdo */}
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
