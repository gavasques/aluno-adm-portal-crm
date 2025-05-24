
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { memo } from "react";

interface SupplierTableHeaderProps {
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  onSort: (field: "name" | "category") => void;
}

export const SupplierTableHeader = memo(({ sortField, sortDirection, onSort }: SupplierTableHeaderProps) => {
  return (
    <TableHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
      <TableRow className="hover:bg-transparent border-purple-200">
        <TableHead className="w-[40%] font-semibold text-purple-900">
          <Button 
            variant="ghost" 
            onClick={() => onSort("name")}
            className="flex items-center gap-1 font-medium text-purple-900 hover:text-purple-700 hover:bg-purple-100/50"
          >
            Nome {" "}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: sortField === "name" ? (sortDirection === "asc" ? 0 : 180) : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpDown className={`h-4 w-4 ${sortField === "name" ? "text-purple-600" : ""}`} />
            </motion.div>
          </Button>
        </TableHead>
        <TableHead className="w-[15%] font-semibold text-purple-900">
          <Button 
            variant="ghost" 
            onClick={() => onSort("category")}
            className="flex items-center gap-1 font-medium text-purple-900 hover:text-purple-700 hover:bg-purple-100/50"
          >
            Categoria {" "}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: sortField === "category" ? (sortDirection === "asc" ? 0 : 180) : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpDown className={`h-4 w-4 ${sortField === "category" ? "text-purple-600" : ""}`} />
            </motion.div>
          </Button>
        </TableHead>
        <TableHead className="w-[15%] font-semibold text-purple-900">CNPJ</TableHead>
        <TableHead className="w-[20%] font-semibold text-purple-900">Marcas</TableHead>
        <TableHead className="w-[10%] text-right font-semibold text-purple-900">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
});

SupplierTableHeader.displayName = "SupplierTableHeader";
