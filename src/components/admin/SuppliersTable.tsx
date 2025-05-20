
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { SuppliersTableProps } from "@/types/supplier.types";
import SupplierTableHeader from "./suppliers/SupplierTableHeader";
import SupplierTableRow from "./suppliers/SupplierTableRow";
import SupplierTablePagination from "./suppliers/SupplierTablePagination";
import PageSizeSelector from "./suppliers/PageSizeSelector";
import EmptyTableMessage from "./suppliers/EmptyTableMessage";

const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  isAdmin = false,
  onSelectSupplier,
  onRemoveSupplier,
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageSizeSelector 
          pageSize={pageSize} 
          onPageSizeChange={onPageSizeChange} 
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <SupplierTableHeader 
            isAdmin={isAdmin}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody>
            {suppliers.length === 0 ? (
              <EmptyTableMessage colSpan={isAdmin ? 8 : 6} />
            ) : (
              suppliers.map((supplier) => (
                <SupplierTableRow 
                  key={supplier.id} 
                  supplier={supplier}
                  isAdmin={isAdmin}
                  onSelectSupplier={onSelectSupplier}
                  onRemoveSupplier={onRemoveSupplier}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <SupplierTablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        totalItems={totalPages * pageSize}
      />
    </div>
  );
};

export default SuppliersTable;
