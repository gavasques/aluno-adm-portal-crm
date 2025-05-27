
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { useMentoring } from '@/hooks/useMentoring';
import EnrollmentForm from '@/components/admin/mentoring/EnrollmentForm';
import EditEnrollmentForm from '@/components/admin/mentoring/EditEnrollmentForm';
import ExtensionDialog from '@/components/admin/mentoring/ExtensionDialog';
import { EnrollmentDetailDialog } from '@/components/admin/mentoring/EnrollmentDetailDialog';
import { EnrollmentsHeader } from '@/components/admin/mentoring/enrollments/EnrollmentsHeader';
import { BulkActions } from '@/components/admin/mentoring/enrollments/BulkActions';
import { IndividualEnrollmentSection } from '@/components/admin/mentoring/enrollments/IndividualEnrollmentSection';
import { GroupEnrollmentSection } from '@/components/admin/mentoring/enrollments/GroupEnrollmentSection';
import { CreateExtensionData, StudentMentoringEnrollment, GroupEnrollment } from '@/types/mentoring.types';
import { mockGroupEnrollments } from '@/data/mockGroupEnrollments';

const AdminMentoringEnrollments = () => {
  const { enrollments, getEnrollmentProgress, addExtension } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);
  const [activeTab, setActiveTab] = useState('individual');

  // Mock groups data - in real implementation, this would come from a hook
  const [groups] = useState<GroupEnrollment[]>(mockGroupEnrollments);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Inscrições' }
  ];

  // Separar inscrições individuais das que fazem parte de grupos
  const { individualEnrollments, groupEnrollments } = useMemo(() => {
    const individual = enrollments.filter(e => !e.groupId);
    const group = enrollments.filter(e => e.groupId);
    
    return {
      individualEnrollments: individual,
      groupEnrollments: group
    };
  }, [enrollments]);

  // Filtros para inscrições individuais
  const filteredIndividualEnrollments = useMemo(() => {
    return individualEnrollments.filter(enrollment => {
      const matchesSearch = !searchTerm || 
        enrollment.mentoring.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      const matchesType = !typeFilter || enrollment.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [individualEnrollments, searchTerm, statusFilter, typeFilter]);

  // Filtros para grupos
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch = !searchTerm || 
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || group.status === statusFilter;
      const matchesType = !typeFilter || group.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [groups, searchTerm, statusFilter, typeFilter]);

  // Estatísticas atualizadas
  const statistics = useMemo(() => {
    const totalIndividual = individualEnrollments.length;
    const totalGroups = groups.length;
    const totalGroupParticipants = groups.reduce((sum, g) => sum + g.participants.length, 0);
    const total = totalIndividual + totalGroupParticipants;
    
    return {
      total,
      active: individualEnrollments.filter(e => e.status === 'ativa').length + 
              groups.filter(g => g.status === 'ativa').reduce((sum, g) => sum + g.participants.length, 0),
      completed: individualEnrollments.filter(e => e.status === 'concluida').length +
                 groups.filter(g => g.status === 'concluida').reduce((sum, g) => sum + g.participants.length, 0),
      paused: individualEnrollments.filter(e => e.status === 'pausada').length +
              groups.filter(g => g.status === 'pausada').reduce((sum, g) => sum + g.participants.length, 0),
    };
  }, [individualEnrollments, groups]);

  const hasFilters = Boolean(searchTerm || statusFilter || typeFilter);

  // Handlers existentes
  const handleCreateEnrollment = (data: any) => {
    console.log('Creating enrollment:', data);
    setShowForm(false);
  };

  const handleEditEnrollment = (data: any) => {
    console.log('Editing enrollment:', data);
    setEditingEnrollment(null);
  };

  const handleViewEnrollment = (enrollment: StudentMentoringEnrollment) => {
    setViewingEnrollment(enrollment);
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

  // Novos handlers para grupos
  const handleViewGroup = (group: GroupEnrollment) => {
    console.log('Viewing group:', group);
  };

  const handleEditGroup = (group: GroupEnrollment) => {
    console.log('Editing group:', group);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      console.log('Deleting group:', id);
    }
  };

  const handleAddStudent = (group: GroupEnrollment) => {
    console.log('Adding student to group:', group);
  };

  const handleRemoveStudent = (groupId: string, studentId: string) => {
    if (confirm('Tem certeza que deseja remover este aluno do grupo?')) {
      console.log('Removing student:', studentId, 'from group:', groupId);
    }
  };

  const handleAddGroup = () => {
    console.log('Adding new group');
  };

  // Handlers de seleção
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for enrollments:`, selectedEnrollments, 'groups:', selectedGroups);
  };

  const toggleEnrollmentSelection = (id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleGroupSelection = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAllIndividual = () => {
    setSelectedEnrollments(
      selectedEnrollments.length === filteredIndividualEnrollments.length 
        ? [] 
        : filteredIndividualEnrollments.map(e => e.id)
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const clearSelection = () => {
    setSelectedEnrollments([]);
    setSelectedGroups([]);
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
      />

      {/* Ações em Lote */}
      <BulkActions
        selectedCount={selectedEnrollments.length + selectedGroups.length}
        onBulkAction={handleBulkAction}
        onClearSelection={clearSelection}
      />

      {/* Tabs para separar Individuais e Grupos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            Inscrições Individuais
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              {filteredIndividualEnrollments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="group" className="flex items-center gap-2">
            Inscrições em Grupo
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
              {filteredGroups.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-6">
          <IndividualEnrollmentSection
            enrollments={filteredIndividualEnrollments}
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
        </TabsContent>

        <TabsContent value="group" className="mt-6">
          <GroupEnrollmentSection
            groups={filteredGroups}
            selectedGroups={selectedGroups}
            onView={handleViewGroup}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudent}
            onToggleSelection={toggleGroupSelection}
            onAddGroup={handleAddGroup}
          />
        </TabsContent>
      </Tabs>

      {/* Diálogos existentes */}
      <Dialog open={showForm} onOpenChange={(open) => {
        if (!open) setShowForm(false);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Inscrição</DialogTitle>
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
            <DialogTitle>Editar Inscrição</DialogTitle>
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

export default AdminMentoringEnrollments;
