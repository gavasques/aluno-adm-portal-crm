
import { useState, useCallback } from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

export const useEnrollmentDialogs = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

  const handleCreateEnrollment = useCallback(() => {
    console.log('🎯 handleCreateEnrollment chamado - abrindo formulário');
    setShowForm(true);
  }, []);

  const handleEditEnrollment = useCallback((enrollment: StudentMentoringEnrollment) => {
    console.log('✏️ handleEditEnrollment chamado para:', enrollment.id);
    setEditingEnrollment(enrollment);
  }, []);

  const handleViewEnrollment = useCallback((enrollment: StudentMentoringEnrollment) => {
    console.log('👁️ handleViewEnrollment chamado para:', enrollment.id);
    setViewingEnrollment(enrollment);
  }, []);

  const handleDeleteEnrollment = useCallback((id: string) => {
    console.log('🗑️ handleDeleteEnrollment chamado para:', id);
    if (confirm('Tem certeza que deseja excluir esta inscrição?')) {
      console.log('✅ Exclusão confirmada para:', id);
      // TODO: Implementar exclusão real
    }
  }, []);

  const handleAddExtension = useCallback((enrollment: StudentMentoringEnrollment) => {
    console.log('➕ handleAddExtension chamado para:', enrollment.id);
    setSelectedEnrollmentForExtension(enrollment);
    setShowExtensionDialog(true);
  }, []);

  const closeForm = useCallback(() => {
    console.log('❌ closeForm chamado - fechando formulário e recarregando dados');
    setShowForm(false);
    // Force page reload to refresh data
    window.location.reload();
  }, []);

  const closeEdit = useCallback(() => {
    console.log('❌ closeEdit chamado');
    setEditingEnrollment(null);
  }, []);

  const closeView = useCallback(() => {
    console.log('❌ closeView chamado');
    setViewingEnrollment(null);
  }, []);

  const closeExtension = useCallback(() => {
    console.log('❌ closeExtension chamado');
    setShowExtensionDialog(false);
    setSelectedEnrollmentForExtension(null);
  }, []);

  return {
    // State
    showForm,
    editingEnrollment,
    viewingEnrollment,
    showExtensionDialog,
    selectedEnrollmentForExtension,
    
    // Handlers
    handleCreateEnrollment,
    handleEditEnrollment,
    handleViewEnrollment,
    handleDeleteEnrollment,
    handleAddExtension,
    
    // Close functions
    closeForm,
    closeEdit,
    closeView,
    closeExtension
  };
};
