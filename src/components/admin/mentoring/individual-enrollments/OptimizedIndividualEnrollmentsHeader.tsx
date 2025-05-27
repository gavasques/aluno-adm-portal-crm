
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Grid, List, X } from 'lucide-react';

interface OptimizedIndividualEnrollmentsHeaderProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  viewMode: 'cards' | 'list';
  statistics: {
    total: number;
    active: number;
    completed: number;
    paused: number;
    cancelled: number;
    withExtensions: number;
    expiringSoon: number;
  };
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onViewModeChange: (mode: 'cards' | 'list') => void;
  onAddEnrollment: () => void;
  onClearFilters: () => void;
}

export const OptimizedIndividualEnrollmentsHeader = memo<OptimizedIndividualEnrollmentsHeaderProps>(({
  searchTerm,
  statusFilter,
  typeFilter,
  viewMode,
  statistics,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onViewModeChange,
  onAddEnrollment,
  onClearFilters
}) => {
  const hasFilters = searchTerm || statusFilter || typeFilter;

  return (
    <div className="space-y-4">
      {/* Header Principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inscrições Individuais</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as inscrições individuais de mentoria
          </p>
        </div>
        <Button onClick={onAddEnrollment}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Inscrição
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
          <div className="text-sm text-blue-700">Total</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
          <div className="text-sm text-green-700">Ativas</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{statistics.completed}</div>
          <div className="text-sm text-purple-700">Concluídas</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{statistics.paused}</div>
          <div className="text-sm text-yellow-700">Pausadas</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{statistics.cancelled}</div>
          <div className="text-sm text-red-700">Canceladas</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-600">{statistics.withExtensions}</div>
          <div className="text-sm text-indigo-700">c/ Extensões</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{statistics.expiringSoon}</div>
          <div className="text-sm text-orange-700">Expirando</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          {/* Busca */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por aluno, mentoria, mentor..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de Status */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro de Tipo */}
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Grupo">Grupo</SelectItem>
            </SelectContent>
          </Select>

          {/* Limpar Filtros */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Modo de Visualização */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('cards')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtros Aplicados */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Busca: {searchTerm}
            </Badge>
          )}
          {statusFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Status: {statusFilter}
            </Badge>
          )}
          {typeFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Tipo: {typeFilter}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
});

OptimizedIndividualEnrollmentsHeader.displayName = 'OptimizedIndividualEnrollmentsHeader';

export default OptimizedIndividualEnrollmentsHeader;
