
import { useCallback, useMemo } from 'react';
import { useMentoringContext } from '../contexts/MentoringContext';
import { MentoringFilters } from '../types/contracts.types';
import { MentoringCatalog, StudentMentoringEnrollment, MentoringSession } from '@/types/mentoring.types';

interface AdvancedFilterOptions {
  priceRange?: { min: number; max: number };
  durationRange?: { min: number; max: number };
  sessionsRange?: { min: number; max: number };
  enrollmentStatus?: string[];
  sessionTypes?: string[];
  includeInactive?: boolean;
  sortBy?: 'name' | 'price' | 'date' | 'instructor' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export const useMentoringAdvancedFilters = () => {
  const { state, dispatch } = useMentoringContext();

  const setAdvancedFilters = useCallback((filters: Partial<MentoringFilters & AdvancedFilterOptions>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, [dispatch]);

  const clearAllFilters = useCallback(() => {
    dispatch({ type: 'SET_FILTERS', payload: {} });
  }, [dispatch]);

  // Filtro avançado para catálogos
  const getFilteredCatalogs = useCallback((additionalFilters: AdvancedFilterOptions = {}) => {
    let filtered = [...state.catalogs];
    const filters = { ...state.filters, ...additionalFilters };

    // Filtro por texto (busca em múltiplos campos)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(catalog =>
        catalog.name.toLowerCase().includes(search) ||
        catalog.instructor.toLowerCase().includes(search) ||
        catalog.description.toLowerCase().includes(search) ||
        catalog.type.toLowerCase().includes(search)
      );
    }

    // Filtro por tipo
    if (filters.type) {
      filtered = filtered.filter(catalog => catalog.type === filters.type);
    }

    // Filtro por instrutor
    if (filters.instructor) {
      filtered = filtered.filter(catalog => 
        catalog.instructor.toLowerCase().includes(filters.instructor!.toLowerCase())
      );
    }

    // Filtro por status (ativo/inativo)
    if (filters.status) {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(catalog => catalog.active === isActive);
    }

    // Filtros avançados
    if (filters.priceRange) {
      filtered = filtered.filter(catalog => 
        catalog.price >= filters.priceRange!.min && 
        catalog.price <= filters.priceRange!.max
      );
    }

    if (filters.durationRange) {
      filtered = filtered.filter(catalog => 
        catalog.durationMonths >= filters.durationRange!.min && 
        catalog.durationMonths <= filters.durationRange!.max
      );
    }

    if (filters.sessionsRange) {
      filtered = filtered.filter(catalog => 
        catalog.numberOfSessions >= filters.sessionsRange!.min && 
        catalog.numberOfSessions <= filters.sessionsRange!.max
      );
    }

    // Incluir/excluir inativos
    if (!filters.includeInactive) {
      filtered = filtered.filter(catalog => catalog.active);
    }

    // Ordenação
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let valueA: any, valueB: any;

        switch (filters.sortBy) {
          case 'name':
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
            break;
          case 'price':
            valueA = a.price;
            valueB = b.price;
            break;
          case 'date':
            valueA = new Date(a.createdAt);
            valueB = new Date(b.createdAt);
            break;
          case 'instructor':
            valueA = a.instructor.toLowerCase();
            valueB = b.instructor.toLowerCase();
            break;
          default:
            return 0;
        }

        if (valueA < valueB) return filters.sortOrder === 'desc' ? 1 : -1;
        if (valueA > valueB) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  }, [state.catalogs, state.filters]);

  // Filtro avançado para matrículas
  const getFilteredEnrollments = useCallback((additionalFilters: AdvancedFilterOptions = {}) => {
    let filtered = [...state.enrollments];
    const filters = { ...state.filters, ...additionalFilters };

    // Filtro por status da matrícula
    if (filters.status) {
      filtered = filtered.filter(enrollment => enrollment.status === filters.status);
    }

    // Filtro por status múltiplos
    if (filters.enrollmentStatus && filters.enrollmentStatus.length > 0) {
      filtered = filtered.filter(enrollment => 
        filters.enrollmentStatus!.includes(enrollment.status)
      );
    }

    // Filtro por busca
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(enrollment =>
        enrollment.mentoring.name.toLowerCase().includes(search) ||
        enrollment.responsibleMentor.toLowerCase().includes(search) ||
        enrollment.observations.toLowerCase().includes(search)
      );
    }

    // Filtro por data
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(enrollment => {
        const enrollmentDate = new Date(enrollment.startDate);
        return enrollmentDate >= start && enrollmentDate <= end;
      });
    }

    return filtered;
  }, [state.enrollments, state.filters]);

  // Filtro avançado para sessões
  const getFilteredSessions = useCallback((additionalFilters: AdvancedFilterOptions = {}) => {
    let filtered = [...state.sessions];
    const filters = { ...state.filters, ...additionalFilters };

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(session => session.status === filters.status);
    }

    // Filtro por tipo
    if (filters.type) {
      filtered = filtered.filter(session => session.type === filters.type);
    }

    // Filtro por tipos múltiplos
    if (filters.sessionTypes && filters.sessionTypes.length > 0) {
      filtered = filtered.filter(session => 
        filters.sessionTypes!.includes(session.type)
      );
    }

    // Filtro por busca
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(search) ||
        (session.mentorNotes && session.mentorNotes.toLowerCase().includes(search))
      );
    }

    // Filtro por data
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate >= start && sessionDate <= end;
      });
    }

    return filtered;
  }, [state.sessions, state.filters]);

  // Estatísticas dos filtros aplicados
  const filterStats = useMemo(() => {
    const totalCatalogs = state.catalogs.length;
    const totalEnrollments = state.enrollments.length;
    const totalSessions = state.sessions.length;

    const filteredCatalogs = getFilteredCatalogs();
    const filteredEnrollments = getFilteredEnrollments();
    const filteredSessions = getFilteredSessions();

    return {
      catalogs: {
        total: totalCatalogs,
        filtered: filteredCatalogs.length,
        percentage: totalCatalogs > 0 ? Math.round((filteredCatalogs.length / totalCatalogs) * 100) : 0
      },
      enrollments: {
        total: totalEnrollments,
        filtered: filteredEnrollments.length,
        percentage: totalEnrollments > 0 ? Math.round((filteredEnrollments.length / totalEnrollments) * 100) : 0
      },
      sessions: {
        total: totalSessions,
        filtered: filteredSessions.length,
        percentage: totalSessions > 0 ? Math.round((filteredSessions.length / totalSessions) * 100) : 0
      }
    };
  }, [state, getFilteredCatalogs, getFilteredEnrollments, getFilteredSessions]);

  // Filtros predefinidos comuns
  const presetFilters = {
    activeMentorings: () => setAdvancedFilters({ status: 'active', includeInactive: false }),
    highValueMentorings: () => setAdvancedFilters({ priceRange: { min: 500, max: Infinity } }),
    shortTermMentorings: () => setAdvancedFilters({ durationRange: { min: 1, max: 8 } }),
    groupMentorings: () => setAdvancedFilters({ type: 'Grupo' }),
    individualMentorings: () => setAdvancedFilters({ type: 'Individual' }),
    upcomingSessions: () => setAdvancedFilters({ 
      dateRange: { 
        start: new Date(), 
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // próximos 30 dias
      }
    }),
    completedSessions: () => setAdvancedFilters({ status: 'realizada' }),
    pendingSessions: () => setAdvancedFilters({ status: 'agendada' })
  };

  return {
    filters: state.filters,
    setAdvancedFilters,
    clearAllFilters,
    getFilteredCatalogs,
    getFilteredEnrollments,
    getFilteredSessions,
    filterStats,
    presetFilters,
    hasActiveFilters: Object.keys(state.filters).length > 0
  };
};
