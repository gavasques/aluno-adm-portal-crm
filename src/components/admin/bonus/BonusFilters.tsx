
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { BonusType, AccessPeriod } from "@/types/bonus.types";

interface BonusFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: BonusType | "all";
  onTypeFilterChange: (value: BonusType | "all") => void;
  periodFilter: AccessPeriod | "all";
  onPeriodFilterChange: (value: AccessPeriod | "all") => void;
  onClearFilters: () => void;
}

const BonusFilters: React.FC<BonusFiltersProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  periodFilter,
  onPeriodFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = typeFilter !== "all" || periodFilter !== "all" || searchTerm !== "";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Buscar</label>
          <Input
            placeholder="Nome, ID ou tipo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as BonusType | "all")}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="all">Todos os tipos</option>
            <option value="Software">Software</option>
            <option value="Sistema">Sistema</option>
            <option value="IA">IA</option>
            <option value="Ebook">Ebook</option>
            <option value="Lista">Lista</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Período de Acesso</label>
          <select
            value={periodFilter}
            onChange={(e) => onPeriodFilterChange(e.target.value as AccessPeriod | "all")}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="all">Todos os períodos</option>
            <option value="7 dias">7 dias</option>
            <option value="15 dias">15 dias</option>
            <option value="30 dias">30 dias</option>
            <option value="2 Meses">2 Meses</option>
            <option value="3 Meses">3 Meses</option>
            <option value="6 Meses">6 Meses</option>
            <option value="1 Ano">1 Ano</option>
            <option value="Vitalício">Vitalício</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BonusFilters;
