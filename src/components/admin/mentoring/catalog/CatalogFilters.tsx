
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Grid3X3, List } from 'lucide-react';

interface CatalogFiltersProps {
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
  totalCatalogs: number;
  filteredCount: number;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  searchTerm,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onClearFilters,
  totalCatalogs,
  filteredCount
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <Filter className="h-3 w-3" />
            </div>
            Filtros
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredCount} de {totalCatalogs} mentorias
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="col-span-2 md:col-span-1">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="w-full h-8 px-2 text-xs border border-gray-200 rounded-lg focus:border-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="Individual">Individual</option>
              <option value="Grupo">Grupo</option>
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full h-8 px-2 text-xs border border-gray-200 rounded-lg focus:border-blue-500"
            >
              <option value="">Todos status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
          </div>

          <div className="col-span-2 md:col-span-2">
            {(typeFilter || statusFilter || searchTerm) && (
              <Button 
                variant="outline" 
                onClick={onClearFilters}
                className="w-full h-8 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-xs"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogFilters;
