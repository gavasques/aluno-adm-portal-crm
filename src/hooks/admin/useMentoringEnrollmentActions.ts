
import { useState } from 'react';
import { StudentMentoringEnrollment, CreateExtensionData, GroupEnrollment } from '@/types/mentoring.types';
import { useMentoring } from '@/hooks/useMentoring';

export const useMentoringEnrollmentActions = () => {
  const { addExtension } = useMentoring();
  
  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

  // Individual enrollment handlers
  const handleCreateEnrollment = () => {
    console.log('Enrollment created successfully');
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

  // Group handlers
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

  // Bulk actions
  const handleBulkAction = (action: string, selectedEnrollments: string[], selectedGroups: string[]) => {
    console.log(`Bulk action ${action} for enrollments:`, selectedEnrollments, 'groups:', selectedGroups);
  };

  return {
    // Dialog states
    showForm,
    editingEnrollment,
    viewingEnrollment,
    showExtensionDialog,
    selectedEnrollmentForExtension,
    
    // Dialog setters
    setShowForm,
    setEditingEnrollment,
    setViewingEnrollment,
    setShowExtensionDialog,
    
    // Individual handlers
    handleCreateEnrollment,
    handleEditEnrollment,
    handleViewEnrollment,
    handleDeleteEnrollment,
    handleAddExtension,
    handleExtensionSubmit,
    
    // Group handlers
    handleViewGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleAddStudent,
    handleRemoveStudent,
    handleAddGroup,
    
    // Bulk actions
    handleBulkAction
  };
};
