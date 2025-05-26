
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useMentoring } from '@/hooks/useMentoring';
import EnrollmentForm from '@/components/admin/mentoring/EnrollmentForm';
import ExtensionDialog from '@/components/admin/mentoring/ExtensionDialog';
import { EnrollmentsHeader } from '@/components/admin/mentoring/enrollments/EnrollmentsHeader';
import { EnrollmentCard } from '@/components/admin/mentoring/enrollments/EnrollmentCard';
import { EnrollmentsList } from '@/components/admin/mentoring/enrollments/EnrollmentsList';
import { EnrollmentsEmptyState } from '@/components/admin/mentoring/enrollments/EnrollmentsEmptyState';
import { BulkActions } from '@/components/admin/mentoring/enrollments/BulkActions';
import { CreateExtensionData, StudentMentoringEnrollment } from '@/types/mentoring.types';

const AdminMentoringEnrollments = () => {
  const { enrollments, getEnrollmentProgress, addExtension } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Inscrições' }
  ];

  // Filtros e estatísticas
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => {
      const matchesSearch = !searchTerm || 
        enrollment.mentoring.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      const matchesType = !typeFilter || enrollment.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [enrollments, searchTerm, statusFilter, typeFilter]);

  const statistics = useMemo(() => {
    return {
      total: enrollments.length,
      active: enrollments.filter(e => e.status === 'ativa').length,
      completed: enrollments.filter(e => e.status === 'concluida').length,
      paused: enrollments.filter(e => e.status === 'pausada').length,
    };
  }, [enrollments]);

  const hasFilters = Boolean(searchTerm || statusFilter || typeFilter);

  // Handlers
  const handleCreateEnrollment = (data: any) => {
    console.log('Creating enrollment:', data);
    setShowForm(false);
  };

  const handleEditEnrollment = (data: any) => {
    console.log('Editing enrollment:', data);
    setEditingEnrollment(null);
  };

  const handleDeleteEnrollment = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inscrição?')) {
      console.log('Deleting enrollment:', id);
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
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for:`, selectedEnrollments);
  };

  const toggleSelection = (id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedEnrollments(
      selectedEnrollments.length === filteredEnrollments.length 
        ? [] 
        : filteredEnrollments.map(e => e.id)
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const clearSelection = () => {
    setSelectedEnrollments([]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddEnrollment={() => setShowForm(true)}
        totalEnrollments={statistics.total}
        activeEnrollments={statistics.active}
        completedEnrollments={statistics.completed}
        pausedEnrollments={statistics.paused}
      />

      {/* Ações em Lote */}
      <BulkActions
        selectedCount={selectedEnrollments.length}
        onBulkAction={handleBulkAction}
        onClearSelection={clearSelection}
      />

      {/* Lista/Cards de Inscrições */}
      {filteredEnrollments.length === 0 ? (
        <EnrollmentsEmptyState
          hasFilters={hasFilters}
          onAddEnrollment={() => setShowForm(true)}
          onClearFilters={clearFilters}
        />
      ) : (
        <div className="space-y-4">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEnrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onView={(enrollment) => console.log('View:', enrollment)}
                  onEdit={setEditingEnrollment}
                  onDelete={handleDeleteEnrollment}
                  onAddExtension={handleAddExtension}
                  onToggleSelection={toggleSelection}
                  isSelected={selectedEnrollments.includes(enrollment.id)}
                />
              ))}
            </div>
          ) : (
            <EnrollmentsList
              enrollments={filteredEnrollments}
              onView={(enrollment) => console.log('View:', enrollment)}
              onEdit={setEditingEnrollment}
              onDelete={handleDeleteEnrollment}
              onAddExtension={handleAddExtension}
              onToggleSelection={toggleSelection}
              selectedEnrollments={selectedEnrollments}
              onSelectAll={selectAll}
            />
          )}
        </div>
      )}

      {/* Create/Edit Form Dialog */}
      <Dialog open={showForm || !!editingEnrollment} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false);
          setEditingEnrollment(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEnrollment ? 'Editar Inscrição' : 'Nova Inscrição'}
            </DialogTitle>
          </DialogHeader>
          <EnrollmentForm
            onSubmit={editingEnrollment ? handleEditEnrollment : handleCreateEnrollment}
            onCancel={() => {
              setShowForm(false);
              setEditingEnrollment(null);
            }}
            initialData={editingEnrollment}
          />
        </DialogContent>
      </Dialog>

      {/* Extension Dialog */}
      <ExtensionDialog
        open={showExtensionDialog}
        onOpenChange={setShowExtensionDialog}
        enrollment={selectedEnrollmentForExtension}
        onSubmit={handleExtensionSubmit}
      />
    </div>
  );
};

export default AdminMentoringEnrollments;
