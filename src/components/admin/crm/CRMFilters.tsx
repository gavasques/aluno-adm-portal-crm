
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Search, Users, Calendar } from 'lucide-react';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import StatusFilter from './filters/StatusFilter';

interface CRMFiltersProps {
  filters: CRMFiltersType;
  onFiltersChange: (filters: CRMFiltersType) => void;
  pipelineId?: string;
  onPipelineChange?: (pipelineId: string) => void;
}

const CRMFilters: React.FC<CRMFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  pipelineId,
  onPipelineChange 
}) => {
  const { columns } = useCRMPipelines();
  const { users } = useCRMUsers();

  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  const handleFilterChange = (key: keyof CRMFiltersType, value: any) => {
    console.log('🔧 [CRM_FILTERS] Alterando filtro:', key, value);
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    console.log('🧹 [CRM_FILTERS] Limpando filtros');
    onFiltersChange({
      pipeline_id: filters.pipeline_id,
      status: 'aberto' // Manter apenas status padrão, sem column_id
    });
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    if (key === 'pipeline_id') return false;
    if (key === 'status' && filters[key] === 'aberto') return false; // Não contar status padrão
    if (key === 'column_id' && !filters[key]) return false; // Não contar quando não há estágio
    return filters[key as keyof CRMFiltersType];
  }).length;

  return (
    <div className="space-y-4">
      {/* Linha principal de filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Busca */}
        <div className="relative min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
            className="pl-10"
          />
        </div>

        {/* Filtro por Status */}
        <StatusFilter
          value={filters.status}
          onValueChange={(status) => handleFilterChange('status', status)}
        />

        {/* Filtro por Coluna/Etapa - CORRIGIDO */}
        <Select 
          value={filters.column_id || 'all'} 
          onValueChange={(value) => handleFilterChange('column_id', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos os estágios" />
          </SelectTrigger>
          <SelectContent>
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

        {/* Filtro por Responsável */}
        <Select 
          value={filters.responsible_id || 'all'} 
          onValueChange={(value) => handleFilterChange('responsible_id', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Todos os responsáveis
              </div>
            </SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por Contatos */}
        <Select 
          value={filters.contact_filter || 'all'} 
          onValueChange={(value) => handleFilterChange('contact_filter', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Contatos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Todos os contatos
              </div>
            </SelectItem>
            <SelectItem value="today">Contatos hoje</SelectItem>
            <SelectItem value="tomorrow">Contatos amanhã</SelectItem>
            <SelectItem value="overdue">Contatos atrasados</SelectItem>
            <SelectItem value="no_contact">Sem contatos</SelectItem>
          </SelectContent>
        </Select>

        {/* Botão limpar filtros */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CRMFilters;
