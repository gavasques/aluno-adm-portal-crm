
import React from "react";
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SupplierTableHeaderProps {
  isAdmin?: boolean;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  onSort: (field: "name" | "category") => void;
}

const SupplierTableHeader: React.FC<SupplierTableHeaderProps> = ({
  isAdmin = false,
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b bg-gray-50/50">
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => onSort("name")} 
            className="flex items-center gap-1 font-semibold text-gray-900 hover:bg-transparent p-0"
          >
            Nome 
            <ArrowUpDown className={`h-4 w-4 ${sortField === "name" ? "text-blue-600" : "text-gray-400"}`} />
            {sortField === "name" && (
              <span className="text-xs text-blue-600">
                {sortDirection === "asc" ? "↑" : "↓"}
              </span>
            )}
          </Button>
        </TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => onSort("category")} 
            className="flex items-center gap-1 font-semibold text-gray-900 hover:bg-transparent p-0"
          >
            Categoria 
            <ArrowUpDown className={`h-4 w-4 ${sortField === "category" ? "text-blue-600" : "text-gray-400"}`} />
            {sortField === "category" && (
              <span className="text-xs text-blue-600">
                {sortDirection === "asc" ? "↑" : "↓"}
              </span>
            )}
          </Button>
        </TableHead>
        <TableHead className="font-semibold text-gray-900">Tipo</TableHead>
        <TableHead className="font-semibold text-gray-900">Marcas</TableHead>
        <TableHead className="font-semibold text-gray-900">Avaliação</TableHead>
        <TableHead className="font-semibold text-gray-900">Comentários</TableHead>
        {isAdmin && <TableHead className="font-semibold text-gray-900">Status</TableHead>}
        {isAdmin && <TableHead className="font-semibold text-gray-900 text-right">Ações</TableHead>}
      </TableRow>
    </TableHeader>
  );
};

export default SupplierTableHeader;
