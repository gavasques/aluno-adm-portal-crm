
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Check, Tags } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';
import { cn } from '@/lib/utils';

interface CRMFiltersProps {
  filters: CRMFiltersType;
  onFiltersChange: (filters: CRMFiltersType) => void;
  pipelineId: string;
  onPipelineChange: (pipelineId: string) => void;
}

const CRMFilters = ({ filters, onFiltersChange, pipelineId, onPipelineChange }: CRMFiltersProps) => {
  const [tagsOpen, setTagsOpen] = useState(false);
  const { columns, pipelines } = useCRMPipelines();
  const { users } = useCRMUsers();
  const { tags } = useCRMTags();

  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleColumnChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      column_id: value === 'all' ? undefined : value 
    });
  };

  const handleResponsibleChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      responsible_id: value === 'all' ? undefined : value 
    });
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = filters.tags || [];
    const updatedTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    onFiltersChange({ 
      ...filters, 
      tags: updatedTags.length > 0 ? updatedTags : undefined 
    });
  };

  const clearFilters = () => {
    onFiltersChange({ pipeline_id: filters.pipeline_id });
  };

  const clearTagsFilter = () => {
    onFiltersChange({ ...filters, tags: undefined });
  };

  const hasActiveFilters = !!(
    filters.search || 
    filters.column_id || 
    filters.responsible_id || 
    (filters.tags && filters.tags.length > 0)
  );

  const selectedTags = tags.filter(tag => filters.tags?.includes(tag.id)) || [];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tags Multi-Select */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={tagsOpen}
                className="w-full md:w-48 justify-between"
              >
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  {selectedTags.length > 0 ? (
                    <span className="truncate">
                      {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    "Filtrar por tags"
                  )}
                </div>
                <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar tags..." />
                <CommandList>
                  <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
                  <CommandGroup>
                    {tags.map((tag) => {
                      const isSelected = filters.tags?.includes(tag.id);
                      return (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleTagToggle(tag.id)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleTagToggle(tag.id)}
                            className="mr-2"
                          />
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="flex-1">{tag.name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  {selectedTags.length > 0 && (
                    <CommandGroup>
                      <CommandItem
                        onSelect={clearTagsFilter}
                        className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        <span>Limpar tags selecionadas</span>
                      </CommandItem>
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTags.slice(0, 2).map(tag => (
                <Badge
                  key={tag.id}
                  variant="default"
                  className="cursor-pointer text-xs px-2 py-1"
                  style={{
                    backgroundColor: tag.color,
                    color: 'white'
                  }}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {selectedTags.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{selectedTags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      <Select
        value={pipelineId || 'all'}
        onValueChange={(value) => value !== 'all' && onPipelineChange(value)}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Selecionar pipeline" />
        </SelectTrigger>
        <SelectContent>
          {pipelines.map(pipeline => (
            <SelectItem key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.column_id || 'all'}
        onValueChange={handleColumnChange}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Todas as colunas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as colunas</SelectItem>
          {pipelineColumns.map(column => (
            <SelectItem key={column.id} value={column.id}>
              {column.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.responsible_id || 'all'}
        onValueChange={handleResponsibleChange}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Todos os responsáveis" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os responsáveis</SelectItem>
          <SelectItem value="unassigned">Sem responsável</SelectItem>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      )}
    </div>
  );
};

export default CRMFilters;
