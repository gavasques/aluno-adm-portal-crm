
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
      <TableRow>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => onSort("name")} 
            className="flex items-center gap-1 font-medium"
          >
            Nome 
            <ArrowUpDown className={`h-4 w-4 ${sortField === "name" ? "text-portal-primary" : ""}`} />
          </Button>
        </TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => onSort("category")} 
            className="flex items-center gap-1 font-medium"
          >
            Categoria 
            <ArrowUpDown className={`h-4 w-4 ${sortField === "category" ? "text-portal-primary" : ""}`} />
          </Button>
        </TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead>Marcas</TableHead>
        <TableHead>Avaliação</TableHead>
        <TableHead>Comentários</TableHead>
        {isAdmin && <TableHead>Status</TableHead>}
        {isAdmin && <TableHead className="text-right">Ações</TableHead>}
      </TableRow>
    </TableHeader>
  );
};

export default SupplierTableHeader;
