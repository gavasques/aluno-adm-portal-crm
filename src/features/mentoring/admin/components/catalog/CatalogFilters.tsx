
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface CatalogFiltersProps {
  typeFilter: string;
  statusFilter: string;
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  typeFilter,
  statusFilter,
  onTypeFilterChange,
  onStatusFilterChange,
  hasActiveFilters,
  onClearFilters
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          <SelectItem value="Individual">Individual</SelectItem>
          <SelectItem value="Grupo">Grupo</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value="active">Ativas</SelectItem>
          <SelectItem value="inactive">Inativas</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters}
          className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900"
        >
          <Filter className="h-3 w-3 mr-1" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};
