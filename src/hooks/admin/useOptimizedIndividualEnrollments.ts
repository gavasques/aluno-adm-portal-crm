
import { useState, useMemo, useCallback } from 'react';
import { useMentoringReadQueries } from '@/features/mentoring/hooks/useMentoringReadQueries';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

interface EnrollmentFilters {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
}

interface EnrollmentStats {
  total: number;
  filtered: number;
  active: number;
  completed: number;
  cancelled: number;
  paused: number;
}

export const useOptimizedIndividualEnrollments = (
  currentPage: number = 1,
  itemsPerPage: number = 12
) => {
  const { useEnrollments } = useMentoringReadQueries();
  const { data: allEnrollments = [], isLoading, error, refetch } = useEnrollments();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Filter individual enrollments and optimize with memoization
  const individualEnrollments = useMemo(() => {
    return allEnrollments.filter(enrollment => 
      enrollment.mentoring?.type === 'Individual'
    );
  }, [allEnrollments]);

  // Apply filters with memoization
  const filteredEnrollments = useMemo(() => {
    return individualEnrollments.filter(enrollment => {
      const matchesSearch = !searchTerm || 
        enrollment.mentoring?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      const matchesType = !typeFilter || enrollment.mentoring?.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [individualEnrollments, searchTerm, statusFilter, typeFilter]);

  // Pagination with memoization
  const paginationData = useMemo(() => {
    const totalItems = filteredEnrollments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedItems = filteredEnrollments.slice(startIndex, startIndex + itemsPerPage);

    return {
      paginatedEnrollments: paginatedItems,
      pageInfo: {
        currentPage,
        totalPages,
        totalItems,
        startIndex: startIndex + 1,
        endIndex
      }
    };
  }, [filteredEnrollments, currentPage, itemsPerPage]);

  // Statistics with memoization
  const statistics = useMemo((): EnrollmentStats => {
    const total = individualEnrollments.length;
    const filtered = filteredEnrollments.length;
    
    return {
      total,
      filtered,
      active: individualEnrollments.filter(e => e.status === 'ativa').length,
      completed: individualEnrollments.filter(e => e.status === 'concluida').length,
      cancelled: individualEnrollments.filter(e => e.status === 'cancelada').length,
      paused: individualEnrollments.filter(e => e.status === 'pausada').length
    };
  }, [individualEnrollments, filteredEnrollments.length]);

  // Optimized filter handlers
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
    setStatusFilter('');
    setTypeFilter('');
  }, []);

  return {
    // Data
    individualEnrollments,
    filteredEnrollments,
    ...paginationData,
    statistics,
    isLoading,
    error,

    // Filter state
    searchTerm,
    statusFilter,
    typeFilter,
    viewMode,

    // Filter handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleClearFilters,
    setViewMode,

    // Utilities
    refetch
  };
};
