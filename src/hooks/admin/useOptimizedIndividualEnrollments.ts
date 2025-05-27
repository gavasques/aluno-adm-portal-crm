
import { useState, useMemo, useCallback } from 'react';
import { useMentoringReadQueries } from '@/features/mentoring/hooks/useMentoringReadQueries';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

export const useOptimizedIndividualEnrollments = (currentPage: number = 1, pageSize: number = 12) => {
  const { useEnrollments } = useMentoringReadQueries();
  const { data: allEnrollments = [], isLoading, error } = useEnrollments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Filter enrollments (Individual only)
  const filteredEnrollments = useMemo(() => {
    return allEnrollments.filter((enrollment: StudentMentoringEnrollment) => {
      // Only individual enrollments (no group_id)
      if (enrollment.groupId) return false;
      
      const matchesSearch = !searchTerm || 
        enrollment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.mentoring?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      const matchesType = !typeFilter || enrollment.mentoring?.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allEnrollments, searchTerm, statusFilter, typeFilter]);

  // Pagination
  const paginatedEnrollments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredEnrollments.slice(start, end);
  }, [filteredEnrollments, currentPage, pageSize]);

  // Page info
  const pageInfo = useMemo(() => {
    const totalItems = filteredEnrollments.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      itemsPerPage: pageSize,
      startItem: Math.min((currentPage - 1) * pageSize + 1, totalItems),
      endItem: Math.min(currentPage * pageSize, totalItems)
    };
  }, [filteredEnrollments.length, currentPage, pageSize]);

  // Statistics
  const statistics = useMemo(() => {
    const total = filteredEnrollments.length;
    const active = filteredEnrollments.filter(e => e.status === 'ativa').length;
    const completed = filteredEnrollments.filter(e => e.status === 'concluida').length;
    const paused = filteredEnrollments.filter(e => e.status === 'pausada').length;
    const cancelled = filteredEnrollments.filter(e => e.status === 'cancelada').length;
    
    return {
      total,
      active,
      completed,
      paused,
      cancelled,
      withExtensions: filteredEnrollments.filter(e => e.hasExtension).length,
      expiringSoon: filteredEnrollments.filter(e => {
        if (e.status !== 'ativa') return false;
        const endDate = new Date(e.endDate);
        const today = new Date();
        const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
      }).length
    };
  }, [filteredEnrollments]);

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
    setStatusFilter('');
    setTypeFilter('');
  }, []);

  return {
    // Data
    paginatedEnrollments,
    filteredEnrollments,
    allEnrollments,
    
    // Pagination
    pageInfo,
    
    // Statistics
    statistics,
    
    // Loading states
    isLoading,
    error,
    
    // Filters
    searchTerm,
    statusFilter,
    typeFilter,
    viewMode,
    
    // Handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleClearFilters,
    setViewMode
  };
};
