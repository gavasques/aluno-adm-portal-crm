
import { useState, useCallback, useMemo } from 'react';
import { CRMFilters } from '@/types/crm.types';
import { useCRMFiltersState } from '@/hooks/crm/useCRMFiltersState';

export const useCRMDashboardState = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'analytics' | 'settings'>('dashboard');
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>();
  const [filters, setFilters] = useState<CRMFilters>({});

  // Hook para gerenciar filtros
  const {
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter,
    clearAllFilters
  } = useCRMFiltersState(filters, setFilters);

  // Filtros efetivos
  const effectiveFilters: CRMFilters = useMemo(() => ({
    ...filters,
    pipeline_id: selectedPipelineId || filters.pipeline_id
  }), [filters, selectedPipelineId]);

  // Handlers
  const handleCreateLead = useCallback((columnId?: string) => {
    setSelectedColumnId(columnId);
    setShowLeadForm(true);
  }, []);

  const handleLeadFormSuccess = useCallback(() => {
    setShowLeadForm(false);
    setSelectedColumnId(undefined);
  }, []);

  const handleTagsChange = useCallback((tagIds: string[]) => {
    updateFilter('tag_ids', tagIds);
  }, [updateFilter]);

  return {
    // Estados
    activeTab,
    setActiveTab,
    activeView,
    setActiveView,
    showFilters,
    setShowFilters,
    selectedPipelineId,
    setSelectedPipelineId,
    showLeadForm,
    setShowLeadForm,
    selectedColumnId,
    setSelectedColumnId,
    filters,
    setFilters,
    
    // Filtros
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter,
    clearAllFilters,
    effectiveFilters,
    
    // Handlers
    handleCreateLead,
    handleLeadFormSuccess,
    handleTagsChange
  };
};
