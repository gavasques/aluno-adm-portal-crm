
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle, X, Tag, Users, Layers } from 'lucide-react';
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
    <div className="flex items-center gap-3">
      {/* Filtro de contatos */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <Select 
          value={filters.contact_filter || 'all'} 
          onValueChange={(value) => updateFilter('contact_filter', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[160px] border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Contatos" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="today">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-orange-600" />
                <span className="text-sm">Hoje</span>
              </div>
            </SelectItem>
            <SelectItem value="tomorrow">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-yellow-600" />
                <span className="text-sm">Amanhã</span>
              </div>
            </SelectItem>
            <SelectItem value="overdue">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span className="text-sm">Atrasados</span>
              </div>
            </SelectItem>
            <SelectItem value="no_contact">
              <div className="flex items-center gap-2">
                <X className="h-3 w-3 text-gray-600" />
                <span className="text-sm">Sem contato</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coluna */}
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-gray-500" />
        <Select 
          value={filters.column_id || 'all'} 
          onValueChange={(value) => updateFilter('column_id', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[140px] border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Coluna" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">Todas</SelectItem>
            {pipelineColumns.map(column => (
              <SelectItem key={column.id} value={column.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="text-sm">{column.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Responsável */}
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-500" />
        <Select 
          value={filters.responsible_id || 'all'} 
          onValueChange={(value) => updateFilter('responsible_id', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-[140px] border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">Todos</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                <span className="text-sm">{user.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <Select 
          value={filters.tag_ids?.length ? 'selected' : 'all'} 
          onValueChange={(value) => {
            if (value === 'all') {
              handleTagsChange([]);
            }
          }}
        >
          <SelectTrigger className="w-[120px] border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Tags" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">Todas</SelectItem>
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
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm">{tag.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
