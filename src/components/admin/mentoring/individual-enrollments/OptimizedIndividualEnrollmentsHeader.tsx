
import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, LayoutGrid, List, Users } from 'lucide-react';

interface EnrollmentStats {
  total: number;
  filtered: number;
  active: number;
  completed: number;
  cancelled: number;
  paused: number;
}

interface OptimizedIndividualEnrollmentsHeaderProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  viewMode: 'cards' | 'list';
  statistics: EnrollmentStats;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onViewModeChange: (mode: 'cards' | 'list') => void;
  onAddEnrollment: () => void;
  onClearFilters?: () => void;
}

const OptimizedIndividualEnrollmentsHeader = memo<OptimizedIndividualEnrollmentsHeaderProps>(({
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
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleClearFilters = useCallback(() => {
    onClearFilters?.();
  }, [onClearFilters]);

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inscrições Individuais</h1>
            <p className="text-gray-600">
              {statistics.filtered} de {statistics.total} inscrições
            </p>
          </div>
        </div>
        <Button onClick={onAddEnrollment} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Inscrição
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              <p className="text-sm text-blue-600">Total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
              <p className="text-sm text-green-600">Ativas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">{statistics.completed}</p>
              <p className="text-sm text-purple-600">Concluídas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-900">{statistics.cancelled}</p>
              <p className="text-sm text-yellow-600">Canceladas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Controles */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por mentoria ou mentor..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || statusFilter || typeFilter) && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Controles de Visualização */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-md border">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('cards')}
                  className="rounded-r-none border-r-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {statistics.filtered !== statistics.total && (
                <Badge variant="secondary" className="ml-2">
                  {statistics.filtered} filtrados
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

OptimizedIndividualEnrollmentsHeader.displayName = 'OptimizedIndividualEnrollmentsHeader';

export default OptimizedIndividualEnrollmentsHeader;
