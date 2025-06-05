
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { CRMFilters, CRMPipelineColumn, CRMUser, CRMTag } from '@/types/crm.types';
import StatusFilter from './StatusFilter';

interface AdvancedFiltersProps {
  filters: CRMFilters;
  updateFilter: (key: keyof CRMFilters, value: any) => void;
  pipelineColumns: CRMPipelineColumn[];
  users: CRMUser[];
  tags: CRMTag[];
  handleTagsChange: (tagIds: string[]) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  updateFilter,
  pipelineColumns,
  users,
  tags,
  handleTagsChange
}) => {
  const removeFilter = (key: keyof CRMFilters) => {
    updateFilter(key, undefined);
  };

  const clearAdvancedFilters = () => {
    // Limpar apenas os filtros avançados, mantendo os principais
    updateFilter('status', undefined);
  };

  // Contar apenas filtros avançados ativos
  const advancedFiltersCount = Object.keys(filters).filter(key => {
    if (['pipeline_id', 'column_id', 'responsible_id', 'contact_filter', 'tag_ids', 'search'].includes(key)) return false;
    return filters[key as keyof CRMFilters];
  }).length;

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filtros Avançados</h3>
        {advancedFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAdvancedFilters}
            className="text-gray-500 hover:text-gray-700 h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar avançados
            <Badge variant="secondary" className="ml-2">
              {advancedFiltersCount}
            </Badge>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro por Status */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Status do Lead</label>
          <StatusFilter
            value={filters.status}
            onValueChange={(status) => updateFilter('status', status)}
          />
        </div>

        {/* Espaço para futuros filtros avançados */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Período de Criação</label>
          <Select disabled>
            <SelectTrigger className="border-gray-300 h-9">
              <SelectValue placeholder="Em breve..." />
            </SelectTrigger>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Valor do Negócio</label>
          <Select disabled>
            <SelectTrigger className="border-gray-300 h-9">
              <SelectValue placeholder="Em breve..." />
            </SelectTrigger>
          </Select>
        </div>
      </div>

      {/* Filtros ativos */}
      {advancedFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-600">Filtros avançados ativos:</span>
          
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <button onClick={() => removeFilter('status')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
