
import { useCallback, useMemo } from 'react';
import { useMentoringContext } from '../contexts/MentoringContext';
import { MentoringFilters } from '../types/contracts.types';
import { MentoringCatalog, StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';

export const useMentoringFilters = () => {
  const { state, dispatch } = useMentoringContext();

  const setFilters = useCallback((filters: Partial<MentoringFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'SET_FILTERS', payload: {} });
  }, [dispatch]);

  const filteredCatalogs = useMemo(() => {
    let filtered = [...state.catalogs];

    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(catalog =>
        catalog.name.toLowerCase().includes(search) ||
        catalog.instructor.toLowerCase().includes(search) ||
        catalog.description.toLowerCase().includes(search)
      );
    }

    if (state.filters.type) {
      filtered = filtered.filter(catalog => catalog.type === state.filters.type);
    }

    if (state.filters.status) {
      const isActive = state.filters.status === 'active';
      filtered = filtered.filter(catalog => catalog.active === isActive);
    }

    if (state.filters.instructor) {
      filtered = filtered.filter(catalog => 
        catalog.instructor.toLowerCase().includes(state.filters.instructor!.toLowerCase())
      );
    }

    return filtered;
  }, [state.catalogs, state.filters]);

  const filteredEnrollments = useMemo(() => {
    let filtered = [...state.enrollments];

    if (state.filters.status) {
      filtered = filtered.filter(enrollment => enrollment.status === state.filters.status);
    }

    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(enrollment =>
        enrollment.mentoring.name.toLowerCase().includes(search) ||
        enrollment.responsibleMentor.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [state.enrollments, state.filters]);

  const filteredSessions = useMemo(() => {
    let filtered = [...state.sessions];

    if (state.filters.status) {
      filtered = filtered.filter(session => session.status === state.filters.status);
    }

    if (state.filters.type) {
      filtered = filtered.filter(session => session.type === state.filters.type);
    }

    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(search)
      );
    }

    if (state.filters.dateRange) {
      const { start, end } = state.filters.dateRange;
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate >= start && sessionDate <= end;
      });
    }

    return filtered;
  }, [state.sessions, state.filters]);

  return {
    filters: state.filters,
    setFilters,
    clearFilters,
    filteredCatalogs,
    filteredEnrollments,
    filteredSessions,
    hasActiveFilters: Object.keys(state.filters).length > 0
  };
};
