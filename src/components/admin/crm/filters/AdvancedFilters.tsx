
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle, X, Tag } from 'lucide-react';
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
  return (
    <>
      {/* Filtro de contatos */}
      <Select 
        value={filters.contact_filter || 'all'} 
        onValueChange={(value) => updateFilter('contact_filter', value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por contatos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os contatos</SelectItem>
          <SelectItem value="today">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              Contatos para Hoje
            </div>
          </SelectItem>
          <SelectItem value="tomorrow">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Contatos para Amanhã
            </div>
          </SelectItem>
          <SelectItem value="overdue">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Contatos Atrasados
            </div>
          </SelectItem>
          <SelectItem value="no_contact">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-gray-600" />
              Sem Contato Agendado
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Coluna */}
      <Select 
        value={filters.column_id || 'all'} 
        onValueChange={(value) => updateFilter('column_id', value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por coluna" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as colunas</SelectItem>
          {pipelineColumns.map(column => (
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

      {/* Responsável */}
      <Select 
        value={filters.responsible_id || 'all'} 
        onValueChange={(value) => updateFilter('responsible_id', value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os responsáveis</SelectItem>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filtro por Tags */}
      <Select 
        value={filters.tag_ids?.length ? 'selected' : 'all'} 
        onValueChange={(value) => {
          if (value === 'all') {
            handleTagsChange([]);
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as tags</SelectItem>
          {tags.map(tag => (
            <SelectItem 
              key={tag.id} 
              value={tag.id}
              onSelect={() => {
                const currentTags = filters.tag_ids || [];
                const newTags = currentTags.includes(tag.id) 
                  ? currentTags.filter(id => id !== tag.id)
                  : [...currentTags, tag.id];
                handleTagsChange(newTags);
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
