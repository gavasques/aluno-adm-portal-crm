
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';

interface CRMFiltersProps {
  filters: CRMFiltersType;
  onFiltersChange: (filters: CRMFiltersType) => void;
  pipelineId: string;
  onPipelineChange: (pipelineId: string) => void;
}

const CRMFilters = ({ filters, onFiltersChange, pipelineId, onPipelineChange }: CRMFiltersProps) => {
  const { pipelines, columns } = useCRMPipelines();
  const { users } = useCRMUsers();

  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  const updateFilter = (key: keyof CRMFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: keyof CRMFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({ pipeline_id: filters.pipeline_id });
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => 
      key !== 'pipeline_id' && filters[key as keyof CRMFiltersType]
    ).length;
  };

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

  return (
    <div className="space-y-4">
      {/* Filtros principais */}
      <div className="flex flex-wrap gap-3">
        {/* Pipeline */}
        <Select value={pipelineId} onValueChange={onPipelineChange}>
          <SelectTrigger className="w-[200px]">
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

        {/* Busca */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro de contatos */}
        <Select 
          value={filters.contact_filter || ''} 
          onValueChange={(value) => updateFilter('contact_filter', value || undefined)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por contatos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os contatos</SelectItem>
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
          value={filters.column_id || ''} 
          onValueChange={(value) => updateFilter('column_id', value || undefined)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por coluna" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as colunas</SelectItem>
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
          value={filters.responsible_id || ''} 
          onValueChange={(value) => updateFilter('responsible_id', value || undefined)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os responsáveis</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtros ativos */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            Filtros ativos:
          </div>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.search}
              <button onClick={() => removeFilter('search')}>
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

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
};

export default CRMFilters;
