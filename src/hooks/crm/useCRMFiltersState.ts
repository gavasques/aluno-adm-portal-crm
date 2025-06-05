
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

  // Encontrar coluna "Abertos" por padrão
  const defaultOpenColumn = React.useMemo(() => {
    return columns.find(col => 
      col.name.toLowerCase().includes('aberto') || 
      col.name.toLowerCase().includes('novo') ||
      col.name.toLowerCase().includes('lead')
    );
  }, [columns]);

  // Inicializar filtros com estágio padrão e status "aberto"
  React.useEffect(() => {
    const needsDefaults = (!filters.column_id && columns.length > 0) || !filters.status;
    
    if (needsDefaults) {
      const newFilters = { ...filters };
      
      // Definir coluna padrão se não existe
      if (defaultOpenColumn && !filters.column_id && columns.length > 0) {
        newFilters.column_id = defaultOpenColumn.id;
      }
      
      // Definir status "aberto" como padrão se não existe
      if (!filters.status) {
        newFilters.status = 'aberto';
      }
      
      onFiltersChange(newFilters);
    }
  }, [defaultOpenColumn, filters, columns.length, onFiltersChange]);

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
      status: 'aberto' // Manter status "aberto" ao limpar filtros
    };
    
    // Manter o estágio padrão ao limpar filtros
    if (defaultOpenColumn) {
      baseFilters.column_id = defaultOpenColumn.id;
    }
    
    onFiltersChange(baseFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      if (key === 'pipeline_id') return false;
      if (key === 'column_id' && filters[key] === defaultOpenColumn?.id) return false; // Não contar filtro padrão
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
