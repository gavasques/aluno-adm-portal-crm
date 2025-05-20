
import React from "react";
import { Supplier } from "@/types/supplier.types";
import SuppliersTable from "@/components/admin/SuppliersTable";
import SupplierDetail from "@/components/admin/SupplierDetail";

interface SupplierContentProps {
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (supplier: Supplier | null) => void;
  handleUpdateSupplier: (updatedSupplier: Supplier) => void;
  paginatedSuppliers: Supplier[];
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  handleSort: (field: "name" | "category") => void;
}

export function SupplierContent({
  selectedSupplier,
  setSelectedSupplier,
  handleUpdateSupplier,
  paginatedSuppliers,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  sortField,
  sortDirection,
  handleSort
}: SupplierContentProps) {
  return (
    <>
      {!selectedSupplier ? (
        <SuppliersTable 
          suppliers={paginatedSuppliers}
          isAdmin={false}
          onSelectSupplier={setSelectedSupplier}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier}
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
          isAdmin={false}
        />
      )}
    </>
  );
}
