
import React from "react";
import { motion } from "framer-motion";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, Star, MessageSquare } from "lucide-react";
import { Supplier } from "@/types/supplier.types";

interface SupplierTableRowProps {
  supplier: Supplier;
  isAdmin?: boolean;
  onSelectSupplier: (supplier: Supplier) => void;
  onRemoveSupplier?: (id: number | string) => void;
  index?: number;
}

const SupplierTableRow: React.FC<SupplierTableRowProps> = ({
  supplier,
  isAdmin = false,
  onSelectSupplier,
  onRemoveSupplier,
  index = 0,
}) => {
  // Function for rendering brands as tags with limit
  const renderBrandTags = (brands?: string[]) => {
    if (!brands || brands.length === 0) return <span className="text-gray-400">Nenhuma</span>;
    
    // Mostrar apenas 2 marcas e indicar se há mais
    const visibleBrands = brands.slice(0, 2);
    const hasMore = brands.length > 2;
    
    return (
      <div className="flex flex-wrap gap-1">
        {visibleBrands.map((brand, index) => (
          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            {brand}
          </Badge>
        ))}
        {hasMore && (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
            +{brands.length - 2}
          </Badge>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-700 border-green-200";
      case "Inativo":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="cursor-pointer hover:bg-blue-50/50 transition-colors border-b border-gray-100"
      onClick={() => onSelectSupplier(supplier)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
            {supplier.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900">{supplier.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          {supplier.category}
        </Badge>
      </TableCell>
      <TableCell>
        {supplier.type ? (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {supplier.type}
          </Badge>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </TableCell>
      <TableCell>{renderBrandTags(supplier.brands)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{supplier.rating.toFixed(1)}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{supplier.comments}</span>
        </div>
      </TableCell>
      {isAdmin && (
        <TableCell>
          <Badge 
            variant="outline" 
            className={getStatusColor(supplier.status || "Ativo")}
          >
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
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </TableCell>
      )}
    </motion.tr>
  );
};

export default SupplierTableRow;
