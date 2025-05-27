
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Clock, Users, Filter, AlertCircle } from "lucide-react";
import { UserFilters as UserFiltersType, UserStats } from "@/types/user.types";

interface UserFiltersProps {
  filters: UserFiltersType;
  stats: UserStats;
  onFiltersChange: (filters: Partial<UserFiltersType>) => void;
  onSearch: (query: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  stats,
  onFiltersChange,
  onSearch,
}) => {
  const handlePendingFilter = () => {
    onFiltersChange({ group: "pending", status: "all" });
  };

  const clearAllFilters = () => {
    onSearch("");
    onFiltersChange({ status: "all", group: "all" });
  };

  return (
    <div className="space-y-4">
      {/* Estatísticas rápidas */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600">Total: </span>
          <Badge variant="outline">{stats.total}</Badge>
        </div>
        
        {stats.pending > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-gray-600">Pendentes: </span>
            <Badge 
              variant="outline" 
              className="border-orange-300 text-orange-700 bg-orange-50 cursor-pointer hover:bg-orange-100"
              onClick={handlePendingFilter}
            >
              {stats.pending}
            </Badge>
          </div>
        )}
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filters.group === "pending" ? "default" : "outline"}
          size="sm"
          onClick={handlePendingFilter}
          className="h-8"
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          Pendentes
          {stats.pending > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {stats.pending}
            </Badge>
          )}
        </Button>

        <Button
          variant={filters.group === "assigned" ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({ group: "assigned", status: "all" })}
          className="h-8"
        >
          Validados
        </Button>

        <Button
          variant={filters.status === "ativo" ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({ status: "ativo", group: "all" })}
          className="h-8"
        >
          Ativos
        </Button>
      </div>

      {/* Filtros detalhados */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={filters.search}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filters.status} onValueChange={(value: any) => onFiltersChange({ status: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.group} onValueChange={(value: any) => onFiltersChange({ group: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os grupos</SelectItem>
            <SelectItem value="pending">Pendentes (Geral)</SelectItem>
            <SelectItem value="assigned">Com grupo definido</SelectItem>
          </SelectContent>
        </Select>

        {(filters.status !== "all" || filters.group !== "all" || filters.search) && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
          >
            <Filter className="h-4 w-4 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};
