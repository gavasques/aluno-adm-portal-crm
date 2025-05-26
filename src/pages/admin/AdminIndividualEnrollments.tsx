import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useMentoring } from '@/hooks/useMentoring';
import EnrollmentForm from '@/components/admin/mentoring/EnrollmentForm';
import EditEnrollmentForm from '@/components/admin/mentoring/EditEnrollmentForm';
import ExtensionDialog from '@/components/admin/mentoring/ExtensionDialog';
import EnrollmentDetailDialog from '@/components/admin/mentoring/EnrollmentDetailDialog';
import { EnrollmentsHeader } from '@/components/admin/mentoring/enrollments/EnrollmentsHeader';
import { BulkActions } from '@/components/admin/mentoring/enrollments/BulkActions';
import { IndividualEnrollmentSection } from '@/components/admin/mentoring/enrollments/IndividualEnrollmentSection';
import { CreateExtensionData, StudentMentoringEnrollment } from '@/types/mentoring.types';

const AdminIndividualEnrollments = () => {
  const { enrollments, getEnrollmentProgress, addExtension, scheduleSession, updateSession } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Inscrições Individuais' }
  ];

  // Filtrar apenas inscrições individuais (sem groupId)
  const individualEnrollments = useMemo(() => {
    return enrollments.filter(e => !e.groupId);
  }, [enrollments]);

  // Aplicar filtros
  const filteredEnrollments = useMemo(() => {
    return individualEnrollments.filter(enrollment => {
      const matchesSearch = !searchTerm || 
        enrollment.mentoring.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      const matchesType = !typeFilter || enrollment.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [individualEnrollments, searchTerm, statusFilter, typeFilter]);

  // Estatísticas específicas para individuais
  const statistics = useMemo(() => {
    const total = individualEnrollments.length;
    const active = individualEnrollments.filter(e => e.status === 'ativa').length;
    const completed = individualEnrollments.filter(e => e.status === 'concluida').length;
    const paused = individualEnrollments.filter(e => e.status === 'pausada').length;
    
    return { total, active, completed, paused };
  }, [individualEnrollments]);

  // Handlers
  const handleCreateEnrollment = (data: any) => {
    console.log('Creating individual enrollment:', data);
    setShowForm(false);
  };

  const handleEditEnrollment = (data: any) => {
    console.log('Editing individual enrollment:', data);
    setEditingEnrollment(null);
  };

  const handleViewEnrollment = (enrollment: StudentMentoringEnrollment) => {
    setViewingEnrollment(enrollment);
  };

  const handleDeleteEnrollment = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inscrição individual?')) {
      console.log('Deleting individual enrollment:', id);
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

  // Novos handlers para sessões - corrigindo a chamada da função scheduleSession
  const handleScheduleSession = async (sessionId: string, data: any) => {
    const success = await scheduleSession(sessionId, data.scheduledDate, data.meetingLink);
    if (success) {
      console.log('Sessão agendada com sucesso');
    }
  };

  const handleUpdateSession = async (sessionId: string, data: any) => {
    const success = await updateSession(sessionId, data);
    if (success) {
      console.log('Sessão atualizada com sucesso');
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for individual enrollments:`, selectedEnrollments);
  };

  const toggleEnrollmentSelection = (id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAllIndividual = () => {
    setSelectedEnrollments(
      selectedEnrollments.length === filteredEnrollments.length 
        ? [] 
        : filteredEnrollments.map(e => e.id)
    );
  };

  const clearSelection = () => {
    setSelectedEnrollments([]);
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddEnrollment={() => setShowForm(true)}
        totalEnrollments={statistics.total}
        activeEnrollments={statistics.active}
        completedEnrollments={statistics.completed}
        pausedEnrollments={statistics.paused}
        title="Inscrições Individuais"
        description="Gerencie as inscrições individuais de mentoria"
      />

      {/* Ações em Lote */}
      <BulkActions
        selectedCount={selectedEnrollments.length}
        onBulkAction={handleBulkAction}
        onClearSelection={clearSelection}
      />

      {/* Seção de Inscrições Individuais */}
      <IndividualEnrollmentSection
        enrollments={filteredEnrollments}
        viewMode={viewMode}
        selectedEnrollments={selectedEnrollments}
        onView={handleViewEnrollment}
        onEdit={setEditingEnrollment}
        onDelete={handleDeleteEnrollment}
        onAddExtension={handleAddExtension}
        onToggleSelection={toggleEnrollmentSelection}
        onSelectAll={selectAllIndividual}
        onAddEnrollment={() => setShowForm(true)}
      />

      {/* Diálogos */}
      <Dialog open={showForm} onOpenChange={(open) => {
        if (!open) setShowForm(false);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Inscrição Individual</DialogTitle>
          </DialogHeader>
          <EnrollmentForm
            onSubmit={handleCreateEnrollment}
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
