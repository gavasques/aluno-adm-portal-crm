
import React from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSuppliersList } from "@/hooks/suppliers/useSuppliersList";
import { useSupplierOperations } from "@/hooks/suppliers/useSupplierOperations";
import { SupplierHeader } from "@/components/student/suppliers/SupplierHeader";
import { SupplierContent } from "@/components/student/suppliers/SupplierContent";
import { Toaster } from "@/components/ui/sonner";

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
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 px-4"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 40%, rgba(251, 254, 207, 0.04), rgba(255, 255, 255, 0) 25%)"
      }}
    >
      <AnimatePresence mode="wait">
        {!selectedSupplier && (
          <motion.div
            key="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
      </motion.div>

      <Toaster />
    </motion.div>
  );
};

export default Suppliers;
