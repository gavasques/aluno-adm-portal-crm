
import { useState, useMemo, useCallback } from 'react';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { usePagination } from '@/hooks/usePagination';
import { CreateExtensionData, StudentMentoringEnrollment } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

interface UseOptimizedIndividualEnrollmentsResult {
  paginatedEnrollments: StudentMentoringEnrollment[];
  pageInfo: any;
  statistics: {
    total: number;
    active: number;
    completed: number;
    paused: number;
    cancelled: number;
    withExtensions: number;
    expiringSoon: number;
  };
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  viewMode: 'cards' | 'list';
  handleSearchChange: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  handleTypeFilterChange: (value: string) => void;
  handleClearFilters: () => void;
  setViewMode: (mode: 'cards' | 'list') => void;
  filteredEnrollments: StudentMentoringEnrollment[];
}

export const useOptimizedIndividualEnrollments = (
  currentPage: number,
  pageSize: number = 12
): UseOptimizedIndividualEnrollmentsResult => {
  const { enrollments, loading, addExtension, refreshEnrollments, deleteEnrollment } = useSupabaseMentoring();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Filtrar apenas inscrições individuais (sem groupId)
  const individualEnrollments = useMemo(() => {
    return enrollments.filter(e => !e.groupId);
  }, [enrollments]);

  // Aplicar filtros
  const filteredEnrollments = useMemo(() => {
    return individualEnrollments.filter(enrollment => {
      const matchesSearch = !searchTerm || 
        enrollment.mentoring.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
      const matchesType = typeFilter === 'all' || enrollment.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [individualEnrollments, searchTerm, statusFilter, typeFilter]);

  // Aplicar paginação
  const { paginatedItems: paginatedEnrollments, pageInfo } = usePagination({
    items: filteredEnrollments,
    pageSize,
    currentPage
  });

  // Estatísticas específicas para individuais
  const statistics = useMemo(() => {
    const total = individualEnrollments.length;
    const active = individualEnrollments.filter(e => e.status === 'ativa').length;
    const completed = individualEnrollments.filter(e => e.status === 'concluida').length;
    const paused = individualEnrollments.filter(e => e.status === 'pausada').length;
    const cancelled = individualEnrollments.filter(e => e.status === 'cancelada').length;
    const withExtensions = individualEnrollments.filter(e => e.hasExtension).length;
    
    // Contar expiração próxima (próximos 30 dias)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSoon = individualEnrollments.filter(e => {
      const endDate = new Date(e.endDate);
      return endDate <= thirtyDaysFromNow && e.status === 'ativa';
    }).length;
    
    return { total, active, completed, paused, cancelled, withExtensions, expiringSoon };
  }, [individualEnrollments]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  }, []);

  return {
    paginatedEnrollments,
    pageInfo,
    statistics,
    isLoading: loading,
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
  };
};
