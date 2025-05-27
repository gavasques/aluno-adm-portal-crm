
import { useState, useMemo } from 'react';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { usePagination } from '@/hooks/usePagination';
import { CreateExtensionData, StudentMentoringEnrollment } from '@/types/mentoring.types';

const ITEMS_PER_PAGE = 25;

export const useIndividualEnrollments = () => {
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

  return {
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
  };
};
