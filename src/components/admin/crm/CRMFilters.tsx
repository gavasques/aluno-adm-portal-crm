
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';

interface CRMFiltersProps {
  filters: CRMFiltersType;
  onFiltersChange: (filters: CRMFiltersType) => void;
  pipelineId: string;
}

const CRMFilters = ({ filters, onFiltersChange, pipelineId }: CRMFiltersProps) => {
  const { columns } = useCRMPipelines();
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

  const hasActiveFilters = !!(
    filters.search || 
    filters.column_id || 
    filters.responsible_id || 
    (filters.tags && filters.tags.length > 0)
  );

  return (
    <div className="space-y-4">
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

      {tags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => {
              const isSelected = filters.tags?.includes(tag.id);
              return (
                <Badge
                  key={tag.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? tag.color : 'transparent',
                    borderColor: tag.color,
                    color: isSelected ? 'white' : tag.color
                  }}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMFilters;
