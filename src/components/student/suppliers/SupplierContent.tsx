
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Supplier } from "@/types/supplier.types";
import SuppliersTable from "@/components/admin/SuppliersTable";
import SupplierDetail from "@/components/admin/SupplierDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-amber-50">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Fornecedores</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                  {paginatedSuppliers.length} encontrado(s)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
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
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-amber-100"
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
