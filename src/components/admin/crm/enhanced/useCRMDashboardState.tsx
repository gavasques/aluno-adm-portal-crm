
import { useState, useCallback, useMemo, useRef } from 'react';
import { CRMFilters } from '@/types/crm.types';
import { useCRMFiltersState } from '@/hooks/crm/useCRMFiltersState';
import { isEqual } from 'lodash';

export const useCRMDashboardState = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'analytics' | 'settings'>('dashboard');
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>();
  const [filters, setFilters] = useState<CRMFilters>({});

  // Refs para controle de estabilidade
  const lastEffectiveFiltersRef = useRef<CRMFilters>({});
  const isInitializedRef = useRef(false);

  // Hook para gerenciar filtros
  const {
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter,
    clearAllFilters
  } = useCRMFiltersState(filters, setFilters);

  // Filtros efetivos - estabilizado com referência
  const effectiveFilters: CRMFilters = useMemo(() => {
    const newFilters = {
      ...filters,
      pipeline_id: selectedPipelineId || filters.pipeline_id
    };
    
    // Só recalcula se realmente mudou
    if (!isEqual(newFilters, lastEffectiveFiltersRef.current)) {
      console.log('🔧 [DASHBOARD_STATE] EffectiveFilters recalculado:', {
        selectedPipelineId,
        filters,
        newFilters,
        changed: !isEqual(newFilters, lastEffectiveFiltersRef.current)
      });
      
      lastEffectiveFiltersRef.current = newFilters;
    }
    
    return lastEffectiveFiltersRef.current;
  }, [filters, selectedPipelineId]);

  // Handlers estabilizados com useCallback
  const handleCreateLead = useCallback((columnId?: string) => {
    console.log('🆕 [DASHBOARD_STATE] Creating lead for column:', columnId);
    setSelectedColumnId(columnId);
    setShowLeadForm(true);
  }, []);

  const handleLeadFormSuccess = useCallback(() => {
    console.log('✅ [DASHBOARD_STATE] Lead form success');
    setShowLeadForm(false);
    setSelectedColumnId(undefined);
  }, []);

  const handleTagsChange = useCallback((tagIds: string[]) => {
    console.log('🏷️ [DASHBOARD_STATE] Tags changed:', tagIds);
    updateFilter('tag_ids', tagIds);
  }, [updateFilter]);

  // Handler para mudança de pipeline com validação
  const handlePipelineChange = useCallback((pipelineId: string) => {
    console.log('📋 [DASHBOARD_STATE] Pipeline changing:', { from: selectedPipelineId, to: pipelineId });
    
    // Só atualizar se realmente mudou
    if (selectedPipelineId !== pipelineId) {
      setSelectedPipelineId(pipelineId);
    }
  }, [selectedPipelineId]);

  // Handler para mudança de view estabilizado
  const handleViewChange = useCallback((view: 'kanban' | 'list') => {
    console.log('👀 [DASHBOARD_STATE] View changing:', { from: activeView, to: view });
    
    // Só atualizar se realmente mudou
    if (activeView !== view) {
      setActiveView(view);
    }
  }, [activeView]);

  return {
    // Estados
    activeTab,
    setActiveTab,
    activeView,
    setActiveView: handleViewChange,
    showFilters,
    setShowFilters,
    selectedPipelineId,
    setSelectedPipelineId: handlePipelineChange,
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
    handleTagsChange,
    
    // Control flags
    isInitialized: isInitializedRef.current
  };
};
