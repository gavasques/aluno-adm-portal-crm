
import { useState, useCallback } from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

export const useEnrollmentDialogs = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentMentoringEnrollment | null>(null);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

  const handleCreateEnrollment = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleEditEnrollment = useCallback((enrollment: StudentMentoringEnrollment) => {
    setEditingEnrollment(enrollment);
  }, []);

  const handleViewEnrollment = useCallback((enrollment: StudentMentoringEnrollment) => {
    setViewingEnrollment(enrollment);
  }, []);

  const handleAddExtension = useCallback((enrollment: StudentMentoringEnrollment) => {
    setSelectedEnrollmentForExtension(enrollment);
    setShowExtensionDialog(true);
  }, []);

  const handleDeleteEnrollment = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição?')) {
      return;
    }
    console.log('Delete enrollment:', id);
  }, []);

  const closeForm = useCallback(() => setShowForm(false), []);
  const closeEdit = useCallback(() => setEditingEnrollment(null), []);
  const closeView = useCallback(() => setViewingEnrollment(null), []);
  const closeExtension = useCallback(() => {
    setShowExtensionDialog(false);
    setSelectedEnrollmentForExtension(null);
  }, []);

  return {
    showForm,
    editingEnrollment,
    viewingEnrollment,
    showExtensionDialog,
    selectedEnrollmentForExtension,
    handleCreateEnrollment,
    handleEditEnrollment,
    handleViewEnrollment,
    handleAddExtension,
    handleDeleteEnrollment,
    closeForm,
    closeEdit,
    closeView,
    closeExtension
  };
};
