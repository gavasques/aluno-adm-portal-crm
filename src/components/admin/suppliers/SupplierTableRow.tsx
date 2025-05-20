
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Supplier } from "@/types/supplier.types";

interface SupplierTableRowProps {
  supplier: Supplier;
  isAdmin?: boolean;
  onSelectSupplier: (supplier: Supplier) => void;
  onRemoveSupplier?: (id: number | string) => void;
}

const SupplierTableRow: React.FC<SupplierTableRowProps> = ({
  supplier,
  isAdmin = false,
  onSelectSupplier,
  onRemoveSupplier,
}) => {
  // Function for rendering brands as tags with limit
  const renderBrandTags = (brands?: string[]) => {
    if (!brands || brands.length === 0) return <span className="text-gray-400">Nenhuma</span>;
    
    // Mostrar apenas 3 marcas e indicar se há mais
    const visibleBrands = brands.slice(0, 3);
    const hasMore = brands.length > 3;
    
    return (
      <div className="flex flex-wrap gap-1">
        {visibleBrands.map((brand, index) => (
          <Badge key={index} variant="outline" className="bg-portal-light/20">
            {brand}
          </Badge>
        ))}
        {hasMore && <span className="text-gray-500">...</span>}
      </div>
    );
  };

  return (
    <TableRow className="cursor-pointer" onClick={() => onSelectSupplier(supplier)}>
      <TableCell className="font-medium">{supplier.name}</TableCell>
      <TableCell>{supplier.category}</TableCell>
      <TableCell>
        {supplier.type ? (
          <Badge variant="outline" className="bg-gray-100">
            {supplier.type}
          </Badge>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </TableCell>
      <TableCell>{renderBrandTags(supplier.brands)}</TableCell>
      <TableCell className="text-yellow-500">
        {supplier.rating.toFixed(1)} ⭐
      </TableCell>
      <TableCell>{supplier.comments}</TableCell>
      {isAdmin && (
        <TableCell>
          <Badge variant={supplier.status === "Inativo" ? "destructive" : "default"}>
            {supplier.status || "Ativo"}
          </Badge>
        </TableCell>
      )}
      {isAdmin && (
        <TableCell className="text-right">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              if (onRemoveSupplier) onRemoveSupplier(supplier.id);
            }}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

export default SupplierTableRow;
