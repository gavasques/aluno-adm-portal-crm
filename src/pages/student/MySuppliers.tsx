
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SupplierForm } from "@/components/student/my-suppliers/SupplierForm";
import { SuppliersList } from "@/components/student/my-suppliers/SuppliersList";
import { SuppliersFilter } from "@/components/student/my-suppliers/SuppliersFilter";
import { OptimizedPagination } from "@/components/student/my-suppliers/OptimizedPagination";
import { ErrorState } from "@/components/student/my-suppliers/ErrorState";
import { LoadingState } from "@/components/student/my-suppliers/LoadingState";
import SupplierDetail from "@/components/student/SupplierDetail";
import StudentRouteGuard from "@/components/student/RouteGuard";
import { useOptimizedMySuppliers } from "@/hooks/student/my-suppliers/useOptimizedMySuppliers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MySuppliers = () => {
  const {
    suppliers,
    allSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    showForm,
    setShowForm,
    isSubmitting,
    loading,
    error,
    retryCount,
    nameFilter,
    setNameFilter,
    cnpjFilter,
    setCnpjFilter,
    brandFilter,
    setBrandFilter,
    contactFilter,
    setContactFilter,
    sortField,
    sortDirection,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    pageInfo,
    hasActiveFilters,
    handleSort,
    handleAddSupplier,
    handleDeleteSupplier,
    handleSubmit,
    handleCancel,
    handleUpdateSupplier,
    handleRetry,
    clearFilters
  } = useOptimizedMySuppliers();

  // Loading state
  if (loading) {
    return (
      <StudentRouteGuard requiredMenuKey="my-suppliers">
        <LoadingState />
      </StudentRouteGuard>
    );
  }

  // Error state
  if (error) {
    return (
      <StudentRouteGuard requiredMenuKey="my-suppliers">
        <ErrorState 
          error={error} 
          retryCount={retryCount} 
          onRetry={handleRetry} 
        />
      </StudentRouteGuard>
    );
  }

  return (
    <StudentRouteGuard requiredMenuKey="my-suppliers">
      <div className="container mx-auto py-6 space-y-8">
        <AnimatePresence mode="wait">
          {!selectedSupplier ? (
            <motion.div
              key="suppliers-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meus Fornecedores</h1>
                    <p className="text-gray-600 mt-2">
                      Gerencie seus fornecedores pessoais e mantenha seus dados organizados.
                    </p>
                  </div>
                  <Button
                    onClick={handleAddSupplier}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Fornecedor
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <SuppliersFilter
                  nameFilter={nameFilter}
                  setNameFilter={setNameFilter}
                  cnpjFilter={cnpjFilter}
                  setCnpjFilter={setCnpjFilter}
                  brandFilter={brandFilter}
                  setBrandFilter={setBrandFilter}
                  contactFilter={contactFilter}
                  setContactFilter={setContactFilter}
                  clearFilters={clearFilters}
                  onAddSupplier={handleAddSupplier}
                  hasActiveFilters={hasActiveFilters}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SuppliersList
                  suppliers={suppliers}
                  onSelectSupplier={setSelectedSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onAddSupplier={handleAddSupplier}
                />
              </motion.div>

              {allSuppliers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <OptimizedPagination
                    currentPage={pageInfo.currentPage}
                    totalPages={pageInfo.totalPages}
                    pageSize={pageSize}
                    totalItems={pageInfo.totalItems}
                    startIndex={pageInfo.startIndex}
                    endIndex={pageInfo.endIndex}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="supplier-detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <SupplierDetail
                supplier={selectedSupplier}
                onBack={() => setSelectedSupplier(null)}
                onUpdate={handleUpdateSupplier}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog open={showForm} onOpenChange={(open: boolean) => setShowForm(open)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Fornecedor</DialogTitle>
            </DialogHeader>
            <SupplierForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </StudentRouteGuard>
  );
};

export default MySuppliers;
