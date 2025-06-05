
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

  // Inicializar filtros apenas com status "aberto" por padrão, SEM forçar estágio
  React.useEffect(() => {
    const needsStatusDefault = !filters.status;
    
    if (needsStatusDefault) {
      const newFilters = { ...filters };
      
      // Definir status "aberto" como padrão se não existe
      if (!filters.status) {
        newFilters.status = 'aberto';
      }
      
      console.log('🔧 [CRM_FILTERS_STATE] Inicializando filtros padrão:', newFilters);
      onFiltersChange(newFilters);
    }
  }, [filters, onFiltersChange]);

  // Sincronizar debounced search com filters
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      console.log('🔍 [CRM_FILTERS_STATE] Atualizando search:', debouncedSearch);
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const updateFilter = (key: keyof CRMFiltersType, value: any) => {
    console.log('🔧 [CRM_FILTERS_STATE] Atualizando filtro:', key, value);
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: keyof CRMFiltersType) => {
    console.log('🗑️ [CRM_FILTERS_STATE] Removendo filtro:', key);
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    console.log('🧹 [CRM_FILTERS_STATE] Limpando todos os filtros');
    setSearchValue('');
    const baseFilters: CRMFiltersType = { 
      pipeline_id: filters.pipeline_id,
      status: 'aberto' // Manter apenas status "aberto" ao limpar filtros
      // column_id removido - permitir "Todos os estágios"
    };
    
    onFiltersChange(baseFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      if (key === 'pipeline_id') return false;
      if (key === 'status' && filters[key] === 'aberto') return false; // Não contar status padrão
      if (key === 'column_id' && !filters[key]) return false; // Não contar quando não há estágio selecionado
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
