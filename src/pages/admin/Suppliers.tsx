import React from "react";
import SupplierDetail from "@/components/admin/SupplierDetail";
import SuppliersContent from "@/components/admin/suppliers/SuppliersContent";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

// Importar hooks
import { useSuppliersList } from "@/hooks/suppliers/useSuppliersList";
import { useSupplierOperations } from "@/hooks/suppliers/useSupplierOperations";

const AdminSuppliers = () => {
  // Usar nossos hooks personalizados
  const {
    suppliers,
    setSuppliers,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedTypes,
    selectedBrands,
    selectedStatus,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedSuppliers,
    sortField,
    sortDirection,
    allBrands,
    toggleCategoryFilter,
    toggleTypeFilter,
    toggleBrandFilter,
    toggleStatusFilter,
    handleSort
  } = useSuppliersList();

  const {
    selectedSupplier,
    setSelectedSupplier,
    isDialogOpen,
    setIsDialogOpen,
    removeSupplierAlert,
    setRemoveSupplierAlert,
    handleAddSupplier,
    handleUpdateSupplier,
    handleRemoveSupplier,
    confirmRemoveSupplier,
    handleImportSuppliers
  } = useSupplierOperations(suppliers, setSuppliers);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Geral ADM', href: '/admin/geral' },
    { label: 'Fornecedores' }
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/geral"
        className="mb-6"
      />

      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Fornecedores</h1>
      
      {!selectedSupplier ? (
        <SuppliersContent
          suppliers={suppliers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategories={selectedCategories}
          selectedTypes={selectedTypes}
          selectedBrands={selectedBrands}
          selectedStatus={selectedStatus}
          allBrands={allBrands}
          toggleCategoryFilter={toggleCategoryFilter}
          toggleTypeFilter={toggleTypeFilter}
          toggleBrandFilter={toggleBrandFilter}
          toggleStatusFilter={toggleStatusFilter}
          paginatedSuppliers={paginatedSuppliers}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          setSelectedSupplier={setSelectedSupplier}
          handleRemoveSupplier={handleRemoveSupplier}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleAddSupplier={handleAddSupplier}
          handleImportSuppliers={handleImportSuppliers}
          removeSupplierAlert={removeSupplierAlert}
          setRemoveSupplierAlert={setRemoveSupplierAlert}
          confirmRemoveSupplier={confirmRemoveSupplier}
        />
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier}
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default AdminSuppliers;
