
import React from "react";
import { toast } from "sonner";
import { useSuppliersList } from "@/hooks/suppliers/useSuppliersList";
import { useSupplierOperations } from "@/hooks/suppliers/useSupplierOperations";
import { SupplierHeader } from "@/components/student/suppliers/SupplierHeader";
import { SupplierContent } from "@/components/student/suppliers/SupplierContent";

const Suppliers = () => {
  // Usar nossos hooks personalizados
  const {
    suppliers,
    setSuppliers,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedTypes,
    selectedBrands,
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
    handleSort
  } = useSuppliersList();

  const {
    selectedSupplier,
    setSelectedSupplier,
    handleUpdateSupplier
  } = useSupplierOperations(suppliers, setSuppliers);

  // Wrapper para adicionar toast na atualização do fornecedor
  const handleSupplierUpdate = (updatedSupplier) => {
    handleUpdateSupplier(updatedSupplier);
    toast.success("Avaliação enviada com sucesso!");
  };

  return (
    <div className="px-6 py-6 w-full">
      {!selectedSupplier && (
        <SupplierHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          selectedTypes={selectedTypes}
          allBrands={allBrands}
          toggleCategoryFilter={toggleCategoryFilter}
          toggleTypeFilter={toggleTypeFilter}
          toggleBrandFilter={toggleBrandFilter}
        />
      )}
      
      <SupplierContent
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        handleUpdateSupplier={handleSupplierUpdate}
        paginatedSuppliers={paginatedSuppliers}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
      />
    </div>
  );
};

export default Suppliers;
