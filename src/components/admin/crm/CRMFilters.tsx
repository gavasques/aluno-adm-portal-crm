
import React from 'react';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { useOptimizedCRMTags } from '@/hooks/crm/useOptimizedCRMTags';
import { useCRMFiltersState } from '@/hooks/crm/useCRMFiltersState';
import { PrimaryFilters } from './filters/PrimaryFilters';
import { AdvancedFilters } from './filters/AdvancedFilters';
import { ActiveFilters } from './filters/ActiveFilters';
import { Separator } from '@/components/ui/separator';

interface CRMFiltersProps {
  filters: CRMFiltersType;
  onFiltersChange: (filters: CRMFiltersType) => void;
  pipelineId: string;
  onPipelineChange: (pipelineId: string) => void;
}

const CRMFilters: React.FC<CRMFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  pipelineId, 
  onPipelineChange 
}) => {
  const { pipelines, columns } = useCRMPipelines();
  const { users } = useCRMUsers();
  const { tags } = useOptimizedCRMTags();
  
  const {
    searchValue,
    setSearchValue,
    isDebouncing,
    updateFilter,
    removeFilter,
    clearAllFilters,
    getActiveFiltersCount
  } = useCRMFiltersState(filters, onFiltersChange);

  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  const handleTagsChange = (tagIds: string[]) => {
    if (tagIds.length === 0) {
      removeFilter('tag_ids');
    } else {
      updateFilter('tag_ids', tagIds);
    }
  };

  return (
    <div className="space-y-4">
      {/* Linha Principal de Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <PrimaryFilters
          pipelineId={pipelineId}
          onPipelineChange={onPipelineChange}
          pipelines={pipelines}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isDebouncing={isDebouncing}
        />
        
        <div className="h-8 w-px bg-gray-200" />
        
        <AdvancedFilters
          filters={filters}
          updateFilter={updateFilter}
          pipelineColumns={pipelineColumns}
          users={users}
          tags={tags}
          handleTagsChange={handleTagsChange}
        />
      </div>

      {/* Filtros Ativos */}
      <ActiveFilters
        filters={filters}
        activeFiltersCount={getActiveFiltersCount()}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        pipelineColumns={pipelineColumns}
        users={users}
      />
    </div>
  );
};

export default CRMFilters;
