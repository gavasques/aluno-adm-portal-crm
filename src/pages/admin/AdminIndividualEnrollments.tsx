import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { usePagination } from '@/hooks/usePagination';
import EnrollmentForm from '@/components/admin/mentoring/EnrollmentForm';
import EditEnrollmentForm from '@/components/admin/mentoring/EditEnrollmentForm';
import ExtensionDialog from '@/components/admin/mentoring/ExtensionDialog';
import { EnrollmentDetailDialog } from '@/components/admin/mentoring/EnrollmentDetailDialog';
import { ModernIndividualEnrollmentsHeader } from '@/components/admin/mentoring/enrollments/ModernIndividualEnrollmentsHeader';
import { ModernIndividualEnrollmentCard } from '@/components/admin/mentoring/enrollments/ModernIndividualEnrollmentCard';
import { ModernIndividualEnrollmentsList } from '@/components/admin/mentoring/enrollments/ModernIndividualEnrollmentsList';
import { EnrollmentsPagination } from '@/components/admin/mentoring/enrollments/EnrollmentsPagination';
import { CreateExtensionData, StudentMentoringEnrollment } from '@/types/mentoring.types';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 25;

const AdminIndividualEnrollments = () => {
  const { enrollments, loading, addExtension, refreshEnrollments } = useSupabaseMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Individuais' }
  ];

  // Filtrar apenas inscrições individuais (sem groupId)
  const individualEnrollments = useMemo(() => {
    return enrollments.filter(e => !e.groupId);
  }, [enrollments]);

  // Aplicar filtros
  const filteredEnrollments = useMemo(() => {
    const filtered = individualEnrollments.filter(enrollment => {
      const matchesSearch = !searchTerm || 
        enrollment.mentoring.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || statusFilter === 'all' || enrollment.status === statusFilter;
      const matchesType = !typeFilter || typeFilter === 'all' || enrollment.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    // Reset para a primeira página quando os filtros mudarem
    setCurrentPage(1);
    
    return filtered;
  }, [individualEnrollments, searchTerm, statusFilter, typeFilter]);

  // Aplicar paginação
  const { paginatedItems: paginatedEnrollments, pageInfo } = usePagination({
    items: filteredEnrollments,
    pageSize: ITEMS_PER_PAGE,
    currentPage
  });

  // Estatísticas específicas para individuais
  const statistics = useMemo(() => {
    const total = individualEnrollments.length;
    const active = individualEnrollments.filter(e => e.status === 'ativa').length;
    const completed = individualEnrollments.filter(e => e.status === 'concluida').length;
    const paused = individualEnrollments.filter(e => e.status === 'pausada').length;
    
    return { total, active, completed, paused };
  }, [individualEnrollments]);

  // Handlers
  const handleCreateEnrollment = () => {
    console.log('Enrollment created successfully');
    setShowForm(false);
    refreshEnrollments();
  };

  const handleEditEnrollment = (data: any) => {
    console.log('Editing individual enrollment:', data);
    setEditingEnrollment(null);
    refreshEnrollments();
  };

  const handleViewEnrollment = (enrollment: StudentMentoringEnrollment) => {
    setViewingEnrollment(enrollment);
  };

  const handleDeleteEnrollment = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inscrição individual?')) {
      console.log('Deleting individual enrollment:', id);
      refreshEnrollments();
    }
  };

  const handleAddExtension = (enrollment: StudentMentoringEnrollment) => {
    setSelectedEnrollmentForExtension(enrollment);
    setShowExtensionDialog(true);
  };

  const handleExtensionSubmit = async (data: CreateExtensionData) => {
    const success = await addExtension(data);
    if (success) {
      console.log('Extensão adicionada com sucesso');
      refreshEnrollments();
    }
  };

  const toggleEnrollmentSelection = (id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin/mentorias"
          className="mb-4"
        />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando inscrições...</p>
          </div>
        </div>
      </div>
    );
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
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma inscrição individual</h3>
            <p className="text-gray-600 text-sm mb-6">Comece criando a primeira inscrição individual de mentoria.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Criar Primeira Inscrição
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cards ou Lista */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedEnrollments.map((enrollment) => (
                <ModernIndividualEnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onView={handleViewEnrollment}
                  onEdit={setEditingEnrollment}
                  onDelete={handleDeleteEnrollment}
                  onAddExtension={handleAddExtension}
                  onToggleSelection={toggleEnrollmentSelection}
                  isSelected={selectedEnrollments.includes(enrollment.id)}
                />
              ))}
            </div>
          ) : (
            <ModernIndividualEnrollmentsList
              enrollments={paginatedEnrollments}
              onView={handleViewEnrollment}
              onEdit={setEditingEnrollment}
              onDelete={handleDeleteEnrollment}
              onAddExtension={handleAddExtension}
              onToggleSelection={toggleEnrollmentSelection}
              selectedEnrollments={selectedEnrollments}
            />
          )}

          {/* Paginação */}
          <EnrollmentsPagination
            currentPage={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            onPageChange={handlePageChange}
            totalItems={pageInfo.totalItems}
            startIndex={pageInfo.startIndex}
            endIndex={pageInfo.endIndex}
          />
        </div>
      )}

      {/* Diálogos */}
      <Dialog open={showForm} onOpenChange={(open) => {
        if (!open) setShowForm(false);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Inscrição Individual</DialogTitle>
          </DialogHeader>
          <EnrollmentForm
            onSuccess={handleCreateEnrollment}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingEnrollment} onOpenChange={(open) => {
        if (!open) setEditingEnrollment(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Inscrição Individual</DialogTitle>
          </DialogHeader>
          {editingEnrollment && (
            <EditEnrollmentForm
              enrollment={editingEnrollment}
              onSubmit={handleEditEnrollment}
              onCancel={() => setEditingEnrollment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <EnrollmentDetailDialog
        open={!!viewingEnrollment}
        onOpenChange={(open) => {
          if (!open) setViewingEnrollment(null);
        }}
        enrollment={viewingEnrollment}
      />

      <ExtensionDialog
        open={showExtensionDialog}
        onOpenChange={setShowExtensionDialog}
        enrollment={selectedEnrollmentForExtension}
        onSubmit={handleExtensionSubmit}
      />
    </div>
  );
};

export default AdminIndividualEnrollments;
