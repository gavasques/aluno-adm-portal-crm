
import { useMemo, useCallback } from 'react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface CatalogFilters {
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
}

export const useMentoringCatalogFilters = (
  catalogs: MentoringCatalog[], 
  filters: CatalogFilters
) => {
  const filteredCatalogs = useMemo(() => {
    return catalogs.filter(catalog => {
      const matchesSearch = !filters.searchTerm || 
        catalog.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        catalog.instructor.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        catalog.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesType = !filters.typeFilter || catalog.type === filters.typeFilter;
      const matchesStatus = !filters.statusFilter || 
        (filters.statusFilter === 'active' && catalog.active) ||
        (filters.statusFilter === 'inactive' && !catalog.active);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [catalogs, filters.searchTerm, filters.typeFilter, filters.statusFilter]);

  const stats = useMemo(() => ({
    total: catalogs.length,
    filtered: filteredCatalogs.length,
    active: catalogs.filter(c => c.active).length,
    individual: catalogs.filter(c => c.type === 'Individual').length,
    group: catalogs.filter(c => c.type === 'Grupo').length
  }), [catalogs, filteredCatalogs.length]);

  return {
    filteredCatalogs,
    stats
  };
};
