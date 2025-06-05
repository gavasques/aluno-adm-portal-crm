
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Tag, User, Layers, Calendar } from 'lucide-react';
import { CRMFilters, CRMPipelineColumn, CRMUser, CRMTag } from '@/types/crm.types';

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
  const [isOpen, setIsOpen] = useState(false);

  const handleColumnChange = (columnId: string) => {
    if (columnId === 'all') {
      updateFilter('column_id', undefined);
    } else {
      updateFilter('column_id', columnId);
    }
  };

  const handleResponsibleChange = (userId: string) => {
    if (userId === 'all') {
      updateFilter('responsible_id', undefined);
    } else {
      updateFilter('responsible_id', userId);
    }
  };

  const handleContactFilterChange = (contactFilter: string) => {
    if (contactFilter === 'all') {
      updateFilter('contact_filter', undefined);
    } else {
      updateFilter('contact_filter', contactFilter);
    }
  };

  const handleTagSelection = (tagId: string, checked: boolean) => {
    const currentTags = filters.tag_ids || [];
    let newTags: string[];

    if (checked) {
      newTags = [...currentTags, tagId];
    } else {
      newTags = currentTags.filter(id => id !== tagId);
    }

    handleTagsChange(newTags);
  };

  const clearAllFilters = () => {
    updateFilter('column_id', undefined);
    updateFilter('responsible_id', undefined);
    updateFilter('contact_filter', undefined);
    handleTagsChange([]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.column_id) count++;
    if (filters.responsible_id) count++;
    if (filters.contact_filter) count++;
    if (filters.tag_ids && filters.tag_ids.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3 border-gray-300 text-gray-600 relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge 
              variant="default" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-600"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Filtros Avançados</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 h-auto p-1"
              >
                Limpar tudo
              </Button>
            )}
          </div>

          {/* Filtro por Coluna/Estágio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Estágio</label>
            </div>
            <Select value={filters.column_id || 'all'} onValueChange={handleColumnChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os estágios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estágios</SelectItem>
                {pipelineColumns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Responsável</label>
            </div>
            <Select value={filters.responsible_id || 'all'} onValueChange={handleResponsibleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os responsáveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os responsáveis</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Status de Contato */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Status de Contato</label>
            </div>
            <Select value={filters.contact_filter || 'all'} onValueChange={handleContactFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="today">Contato hoje</SelectItem>
                <SelectItem value="tomorrow">Contato amanhã</SelectItem>
                <SelectItem value="overdue">Contatos atrasados</SelectItem>
                <SelectItem value="no_contact">Sem contato agendado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Tags</label>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-2 border rounded-md p-2">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">Nenhuma tag disponível</p>
              ) : (
                tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag.id}
                      checked={(filters.tag_ids || []).includes(tag.id)}
                      onCheckedChange={(checked) => handleTagSelection(tag.id, checked as boolean)}
                    />
                    <label
                      htmlFor={tag.id}
                      className="text-sm flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Filtros Ativos */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <label className="text-sm font-medium text-gray-700">Filtros Ativos</label>
              <div className="flex flex-wrap gap-1">
                {filters.column_id && (
                  <Badge variant="secondary" className="text-xs">
                    Estágio: {pipelineColumns.find(c => c.id === filters.column_id)?.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => updateFilter('column_id', undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.responsible_id && (
                  <Badge variant="secondary" className="text-xs">
                    Responsável: {users.find(u => u.id === filters.responsible_id)?.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => updateFilter('responsible_id', undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.contact_filter && (
                  <Badge variant="secondary" className="text-xs">
                    Contato: {filters.contact_filter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => updateFilter('contact_filter', undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.tag_ids && filters.tag_ids.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Tags: {filters.tag_ids.length}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => handleTagsChange([])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
