
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, LayoutGrid, X } from 'lucide-react';
import { CRMFilters, CRMPipelineColumn, CRMUser, CRMTag } from '@/types/crm.types';
import { TagsDropdownFilter } from './TagsDropdownFilter';
import StatusFilter from './StatusFilter';

interface MainFiltersProps {
  filters: CRMFilters;
  updateFilter: (key: keyof CRMFilters, value: any) => void;
  removeFilter: (key: keyof CRMFilters) => void;
  pipelineColumns: CRMPipelineColumn[];
  users: CRMUser[];
  tags: CRMTag[];
  activeFiltersCount: number;
  clearAllFilters: () => void;
}

export const MainFilters: React.FC<MainFiltersProps> = ({
  filters,
  updateFilter,
  removeFilter,
  pipelineColumns,
  users,
  tags,
  activeFiltersCount,
  clearAllFilters
}) => {
  return (
    <div className="flex items-end gap-4 flex-wrap">
      {/* Filtro por Estágio/Etapa - DESTACADO */}
      <div className="min-w-[180px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Estágio</label>
        <Select 
          value={filters.column_id || 'all'} 
          onValueChange={(value) => updateFilter('column_id', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="border-2 border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 h-9 bg-blue-50/50 font-medium shadow-sm">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-600" />
              <SelectValue placeholder="Estágio" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">Todos os estágios</SelectItem>
            {pipelineColumns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  {column.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Responsável */}
      <div className="min-w-[160px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Responsável</label>
        <Select 
          value={filters.responsible_id || 'all'} 
          onValueChange={(value) => updateFilter('responsible_id', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Todos
              </div>
            </SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Próximo Contato */}
      <div className="min-w-[160px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Próximo Contato</label>
        <Select 
          value={filters.contact_filter || 'all'} 
          onValueChange={(value) => updateFilter('contact_filter', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 bg-white">
            <SelectValue placeholder="Próximo Contato" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Todos
              </div>
            </SelectItem>
            <SelectItem value="today">Contatos hoje</SelectItem>
            <SelectItem value="tomorrow">Contatos amanhã</SelectItem>
            <SelectItem value="overdue">Contatos atrasados</SelectItem>
            <SelectItem value="no_contact">Sem contatos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Tags - DROPDOWN COMPACTO */}
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
        <TagsDropdownFilter
          selectedTags={filters.tag_ids || []}
          onTagsChange={(tagIds) => updateFilter('tag_ids', tagIds.length > 0 ? tagIds : undefined)}
          tags={tags}
        />
      </div>

      {/* Filtro por Status - ADICIONADO NA MESMA LINHA */}
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
        <StatusFilter
          value={filters.status}
          onValueChange={(status) => updateFilter('status', status)}
        />
      </div>

      {/* Botão Limpar Filtros */}
      {activeFiltersCount > 0 && (
        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2 h-9 text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
            Limpar
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
};
