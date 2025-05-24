
import React from "react";
import { motion } from "framer-motion";
import { SupplierHeader } from "@/components/student/suppliers/SupplierHeader";
import { SupplierContent } from "@/components/student/suppliers/SupplierContent";
import StudentRouteGuard from "@/components/student/RouteGuard";
import { useSuppliersList } from "@/hooks/suppliers/useSuppliersList";

const Suppliers = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedBrands,
    selectedTypes,
    allBrands,
    toggleCategoryFilter,
    toggleTypeFilter,
    toggleBrandFilter,
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
  } = useSuppliersList();

  return (
    <StudentRouteGuard requiredMenuKey="suppliers">
      <div className="w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fornecedores</h1>
              <p className="text-gray-600 mt-2">
                Explore nossa base de fornecedores disponíveis para seu negócio.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SupplierContent
            selectedSupplier={selectedSupplier}
            setSelectedSupplier={setSelectedSupplier}
            handleUpdateSupplier={handleUpdateSupplier}
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
      </div>
    </StudentRouteGuard>
  );
};

export default Suppliers;
