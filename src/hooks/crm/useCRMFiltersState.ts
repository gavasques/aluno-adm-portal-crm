
import React from 'react';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';

export const useCRMFiltersState = (
  filters: CRMFiltersType,
  onFiltersChange: (filters: CRMFiltersType) => void
) => {
  const { columns } = useCRMPipelines();
  
  // Debounce search para evitar queries excessivas
  const [searchValue, setSearchValue] = React.useState(filters.search || '');
  const [debouncedSearch, isDebouncing] = useDebouncedValue(searchValue, 300);

  // Inicializar filtros apenas com status "aberto" por padrão, sem forçar estágio
  React.useEffect(() => {
    const needsStatusDefault = !filters.status;
    
    if (needsStatusDefault) {
      const newFilters = { ...filters };
      
      // Definir status "aberto" como padrão se não existe
      if (!filters.status) {
        newFilters.status = 'aberto';
      }
      
      onFiltersChange(newFilters);
    }
  }, [filters, onFiltersChange]);

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
    const baseFilters: CRMFiltersType = { 
      pipeline_id: filters.pipeline_id,
      status: 'aberto' // Manter apenas status "aberto" ao limpar filtros
    };
    
    onFiltersChange(baseFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      if (key === 'pipeline_id') return false;
      if (key === 'status' && filters[key] === 'aberto') return false; // Não contar status padrão
      return filters[key as keyof CRMFiltersType];
    }).length;
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
