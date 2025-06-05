
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, User, Calendar, Tag } from 'lucide-react';
import { CRMFilters, CRMUser, CRMTag } from '@/types/crm.types';
import StatusFilter from './StatusFilter';

interface InlineFiltersProps {
  filters: CRMFilters;
  updateFilter: (key: keyof CRMFilters, value: any) => void;
  users: CRMUser[];
  tags: CRMTag[];
  handleTagsChange: (tagIds: string[]) => void;
}

export const InlineFilters: React.FC<InlineFiltersProps> = ({
  filters,
  updateFilter,
  users,
  tags,
  handleTagsChange
}) => {
  const contactStatusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'completed', label: 'Concluído' },
    { value: 'overdue', label: 'Em Atraso' }
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Filtro de Estágio */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">Estágio:</span>
        <StatusFilter 
          value={filters.status}
          onValueChange={(status) => updateFilter('status', status)}
        />
      </div>

      {/* Filtro de Responsável */}
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <Select
          value={filters.responsible_id || ''}
          onValueChange={(value) => updateFilter('responsible_id', value || undefined)}
        >
          <SelectTrigger className="w-40 h-9 border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="">Todos</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Status de Contato */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <Select
          value={filters.contact_filter || ''}
          onValueChange={(value) => updateFilter('contact_filter', value || undefined)}
        >
          <SelectTrigger className="w-40 h-9 border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Contatos" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="">Todos</SelectItem>
            {contactStatusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Tags */}
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <Select
          value=""
          onValueChange={(tagId) => {
            if (tagId && !filters.tag_ids?.includes(tagId)) {
              handleTagsChange([...(filters.tag_ids || []), tagId]);
            }
          }}
        >
          <SelectTrigger className="w-32 h-9 border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Tags" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {tags.map(tag => (
              <SelectItem 
                key={tag.id} 
                value={tag.id}
                disabled={filters.tag_ids?.includes(tag.id)}
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
      </div>

      {/* Tags Selecionadas */}
      {filters.tag_ids && filters.tag_ids.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {filters.tag_ids.map(tagId => {
            const tag = tags.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge 
                key={tagId} 
                variant="secondary" 
                className="flex items-center gap-1 px-2 py-1"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => {
                    const newTagIds = filters.tag_ids?.filter(id => id !== tagId) || [];
                    handleTagsChange(newTagIds);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};
