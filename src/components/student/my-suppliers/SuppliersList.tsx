
import { MySupplier } from "@/types/my-suppliers.types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SupplierTableHeader } from "./SupplierTableHeader";
import { SupplierTableRow } from "./SupplierTableRow";
import { EmptyState } from "./EmptyState";

interface SuppliersListProps {
  suppliers: MySupplier[];
  onSelectSupplier: (supplier: MySupplier) => void;
  onDeleteSupplier: (id: number) => void;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  onSort: (field: "name" | "category") => void;
  onAddSupplier: () => void;
}

export function SuppliersList({
  suppliers,
  onSelectSupplier,
  onDeleteSupplier,
  sortField,
  sortDirection,
  onSort,
  onAddSupplier
}: SuppliersListProps) {
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg border-purple-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="overflow-x-auto">
        <Table>
          <SupplierTableHeader 
            sortField={sortField} 
            sortDirection={sortDirection} 
            onSort={onSort} 
          />
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyState onAddSupplier={onAddSupplier} />
                </TableCell>
              </TableRow>
            ) : (
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {suppliers.map((supplier, index) => (
                  <SupplierTableRow
                    key={supplier.id}
                    supplier={supplier}
                    index={index}
                    onSelectSupplier={onSelectSupplier}
                    onDeleteSupplier={onDeleteSupplier}
                  />
                ))}
              </motion.tbody>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
