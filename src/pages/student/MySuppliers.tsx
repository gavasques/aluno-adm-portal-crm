
import React from "react";
import { AnimatePresence } from "framer-motion";
import { MySuppliersListView } from "@/components/student/my-suppliers/MySuppliersList";
import { MySupplierDetailView } from "@/components/student/my-suppliers/MySupplierDetailView";
import { MySupplierFormDialog } from "@/components/student/my-suppliers/MySupplierForm";
import { ErrorState } from "@/components/student/my-suppliers/ErrorState";
import { LoadingState } from "@/components/student/my-suppliers/LoadingState";
import StudentRouteGuard from "@/components/student/RouteGuard";
import { useMySuppliers } from "@/hooks/student/useMySuppliers";

const MySuppliers = () => {
  const {
    suppliers,
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
    handleSort,
    handleAddSupplier,
    handleDeleteSupplier,
    handleSubmit,
    handleCancel,
    handleUpdateSupplier,
    handleRetry,
    clearFilters
  } = useMySuppliers();

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

  const handleDialogOpenChange = (open: boolean) => {
    setShowForm(open);
  };

  return (
    <StudentRouteGuard requiredMenuKey="my-suppliers">
      <div className="container mx-auto py-6 space-y-8">
        <AnimatePresence mode="wait">
          {!selectedSupplier ? (
            <MySuppliersListView
              suppliers={suppliers}
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              cnpjFilter={cnpjFilter}
              setCnpjFilter={setCnpjFilter}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              contactFilter={contactFilter}
              setContactFilter={setContactFilter}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleAddSupplier={handleAddSupplier}
              handleDeleteSupplier={handleDeleteSupplier}
              onSelectSupplier={setSelectedSupplier}
              clearFilters={clearFilters}
            />
          ) : (
            <MySupplierDetailView
              supplier={selectedSupplier}
              onBack={() => setSelectedSupplier(null)}
              onUpdate={handleUpdateSupplier}
            />
          )}
        </AnimatePresence>

        <MySupplierFormDialog
          showForm={showForm}
          onOpenChange={handleDialogOpenChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </StudentRouteGuard>
  );
};

export default MySuppliers;
