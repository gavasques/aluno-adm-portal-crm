
import React from 'react';
import { Search, Users, Calendar, Clock, CheckCircle, Pause, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Statistics {
  total: number;
  active: number;
  completed: number;
  paused: number;
  cancelled: number;
  withExtensions: number;
  expiringSoon: number;
}

interface OptimizedIndividualEnrollmentsHeaderProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  viewMode: 'cards' | 'list';
  statistics: Statistics;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onViewModeChange: (mode: 'cards' | 'list') => void;
  onAddEnrollment: () => void;
  onClearFilters: () => void;
}

const OptimizedIndividualEnrollmentsHeader: React.FC<OptimizedIndividualEnrollmentsHeaderProps> = ({
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
  console.log('OptimizedIndividualEnrollmentsHeader - statusFilter:', statusFilter, 'typeFilter:', typeFilter);
  
  // Garantir que os filtros nunca sejam vazios
  const safeStatusFilter = statusFilter || "all";
  const safeTypeFilter = typeFilter || "all";
  
  console.log('Safe filters - statusFilter:', safeStatusFilter, 'typeFilter:', safeTypeFilter);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
            <div className="text-sm text-gray-600">Ativas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{statistics.completed}</div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Pause className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">{statistics.paused}</div>
            <div className="text-sm text-gray-600">Pausadas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">{statistics.cancelled}</div>
            <div className="text-sm text-gray-600">Canceladas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Plus className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{statistics.withExtensions}</div>
            <div className="text-sm text-gray-600">Com Extensões</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{statistics.expiringSoon}</div>
            <div className="text-sm text-gray-600">Expirando</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por aluno, mentoria ou mentor..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <Select value={safeStatusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={safeTypeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="group">Grupo</SelectItem>
              </SelectContent>
            </Select>
            
            {(safeStatusFilter !== "all" || safeTypeFilter !== "all" || searchTerm) && (
              <Button variant="outline" onClick={onClearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('cards')}
              className="rounded-none"
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none"
            >
              Lista
            </Button>
          </div>
          
          <Button onClick={onAddEnrollment} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Inscrição
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedIndividualEnrollmentsHeader;
