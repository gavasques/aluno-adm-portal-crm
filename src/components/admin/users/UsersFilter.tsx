
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
import { Search, Clock, Users, Filter } from "lucide-react";

interface UsersFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  groupFilter: string;
  onGroupFilterChange: (group: string) => void;
  pendingCount: number;
  totalCount: number;
}

const UsersFilter: React.FC<UsersFilterProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  groupFilter,
  onGroupFilterChange,
  pendingCount,
  totalCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Estatísticas rápidas */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600">Total: </span>
          <Badge variant="outline">{totalCount}</Badge>
        </div>
        
        {pendingCount > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-gray-600">Pendentes: </span>
            <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
              {pendingCount}
            </Badge>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={groupFilter} onValueChange={onGroupFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os grupos</SelectItem>
            <SelectItem value="pending">Pendentes (Geral)</SelectItem>
            <SelectItem value="assigned">Com grupo definido</SelectItem>
          </SelectContent>
        </Select>

        {(statusFilter !== "all" || groupFilter !== "all" || searchQuery) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onSearchChange("");
              onStatusFilterChange("all");
              onGroupFilterChange("all");
            }}
          >
            <Filter className="h-4 w-4 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default UsersFilter;
