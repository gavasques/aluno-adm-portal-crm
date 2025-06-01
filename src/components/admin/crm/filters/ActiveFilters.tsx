
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar, Clock, AlertTriangle, Tag } from 'lucide-react';
import { CRMFilters, CRMPipelineColumn, CRMUser } from '@/types/crm.types';

interface ActiveFiltersProps {
  filters: CRMFilters;
  activeFiltersCount: number;
  searchValue: string;
  setSearchValue: (value: string) => void;
  removeFilter: (key: keyof CRMFilters) => void;
  clearAllFilters: () => void;
  pipelineColumns: CRMPipelineColumn[];
  users: CRMUser[];
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  activeFiltersCount,
  searchValue,
  setSearchValue,
  removeFilter,
  clearAllFilters,
  pipelineColumns,
  users
}) => {
  const getContactFilterLabel = (value: string) => {
    switch (value) {
      case 'today': return 'Contatos para Hoje';
      case 'tomorrow': return 'Contatos para Amanhã';
      case 'overdue': return 'Contatos Atrasados';
      case 'no_contact': return 'Sem Contato Agendado';
      default: return value;
    }
  };

  const getContactFilterIcon = (value: string) => {
    switch (value) {
      case 'today': return <Calendar className="h-3 w-3" />;
      case 'tomorrow': return <Clock className="h-3 w-3" />;
      case 'overdue': return <AlertTriangle className="h-3 w-3" />;
      case 'no_contact': return <X className="h-3 w-3" />;
      default: return null;
    }
  };

  if (activeFiltersCount === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Filter className="h-4 w-4" />
        Filtros ativos:
      </div>
      
      {searchValue && (
        <Badge variant="secondary" className="gap-1">
          Busca: {searchValue}
          <button onClick={() => setSearchValue('')}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.contact_filter && (
        <Badge variant="secondary" className="gap-1">
          {getContactFilterIcon(filters.contact_filter)}
          {getContactFilterLabel(filters.contact_filter)}
          <button onClick={() => removeFilter('contact_filter')}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.column_id && (
        <Badge variant="secondary" className="gap-1">
          Coluna: {pipelineColumns.find(c => c.id === filters.column_id)?.name}
          <button onClick={() => removeFilter('column_id')}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.responsible_id && (
        <Badge variant="secondary" className="gap-1">
          Responsável: {users.find(u => u.id === filters.responsible_id)?.name}
          <button onClick={() => removeFilter('responsible_id')}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.tag_ids && filters.tag_ids.length > 0 && (
        <Badge variant="secondary" className="gap-1">
          <Tag className="h-3 w-3" />
          Tags ({filters.tag_ids.length})
          <button onClick={() => removeFilter('tag_ids')}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="text-gray-500 hover:text-gray-700"
      >
        Limpar todos
      </Button>
    </div>
  );
};
