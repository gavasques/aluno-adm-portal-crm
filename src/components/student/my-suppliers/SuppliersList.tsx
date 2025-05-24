
import { MySupplier } from "@/types/my-suppliers.types";
import { Table, TableBody } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { SupplierTableHeader } from "./list/SupplierTableHeader";
import { SupplierTableRow } from "./list/SupplierTableRow";
import { EmptySuppliersList } from "./list/EmptySuppliersList";
import { memo } from "react";

interface SuppliersListProps {
  suppliers: MySupplier[];
  onSelectSupplier: (supplier: MySupplier) => void;
  onDeleteSupplier: (id: string) => void;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  onSort: (field: "name" | "category") => void;
  onAddSupplier: () => void;
}

export const SuppliersList = memo(({
  suppliers,
  onSelectSupplier,
  onDeleteSupplier,
  sortField,
  sortDirection,
  onSort,
  onAddSupplier
}: SuppliersListProps) => {
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
              <EmptySuppliersList onAddSupplier={onAddSupplier} />
            ) : (
              suppliers.map((supplier, index) => (
                <SupplierTableRow
                  key={supplier.id}
                  supplier={supplier}
                  index={index}
                  onSelectSupplier={onSelectSupplier}
                  onDeleteSupplier={onDeleteSupplier}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
});

SuppliersList.displayName = "SuppliersList";
