
import React from 'react';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export const useCRMFiltersState = (
  filters: CRMFiltersType,
  onFiltersChange: (filters: CRMFiltersType) => void
) => {
  // Debounce search para evitar queries excessivas
  const [searchValue, setSearchValue] = React.useState(filters.search || '');
  const [debouncedSearch, isDebouncing] = useDebouncedValue(searchValue, 300);

  // Sincronizar debounced search com filters
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const updateFilter = (key: keyof CRMFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: keyof CRMFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    onFiltersChange({ pipeline_id: filters.pipeline_id });
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => 
      key !== 'pipeline_id' && filters[key as keyof CRMFiltersType]
    ).length;
  };

  return {
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter,
    removeFilter,
    clearAllFilters,
    getActiveFiltersCount
  };
};
