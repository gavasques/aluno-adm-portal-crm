
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Supplier } from "@/types/supplier.types";
import SuppliersTable from "@/components/admin/SuppliersTable";
import SupplierDetail from "@/components/admin/SupplierDetail";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento para mostrar o skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!selectedSupplier ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-white to-portal-light/20 rounded-lg shadow-md p-1"
        >
          {isLoading ? (
            <div className="p-6 space-y-4 bg-white rounded-lg">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ) : (
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
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SupplierDetail 
            supplier={selectedSupplier}
            onBack={() => setSelectedSupplier(null)}
            onUpdate={handleUpdateSupplier}
            isAdmin={false}
          />
        </motion.div>
      )}
    </>
  );
}
