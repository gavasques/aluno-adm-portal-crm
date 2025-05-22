
import React from "react";
import SuppliersTable from "@/components/admin/SuppliersTable";
import SupplierFilters from "./SupplierFilters";
import SupplierActions from "./SupplierActions";
import SupplierDeleteDialog from "./SupplierDeleteDialog";

interface SuppliersContentProps {
  suppliers: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  selectedTypes: string[];
  selectedBrands: string[];
  selectedStatus: string[];
  allBrands: string[];
  toggleCategoryFilter: (category: string) => void;
  toggleTypeFilter: (type: string) => void;
  toggleBrandFilter: (brand: string) => void;
  toggleStatusFilter: (status: string) => void;
  paginatedSuppliers: any[];
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  handleSort: (field: "name" | "category") => void;
  setSelectedSupplier: (supplier: any) => void;
  handleRemoveSupplier: (id: number | string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  handleAddSupplier: (newSupplier: any) => void;
  handleImportSuppliers: (suppliers: any[]) => void;
  removeSupplierAlert: any | null;
  setRemoveSupplierAlert: (supplier: any | null) => void;
  confirmRemoveSupplier: () => void;
}

const SuppliersContent: React.FC<SuppliersContentProps> = ({
  suppliers,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  selectedTypes,
  selectedBrands,
  selectedStatus,
  allBrands,
  toggleCategoryFilter,
  toggleTypeFilter,
  toggleBrandFilter,
  toggleStatusFilter,
  paginatedSuppliers,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  sortField,
  sortDirection,
  handleSort,
  setSelectedSupplier,
  handleRemoveSupplier,
  isDialogOpen,
  setIsDialogOpen,
  handleAddSupplier,
  handleImportSuppliers,
  removeSupplierAlert,
  setRemoveSupplierAlert,
  confirmRemoveSupplier,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <SupplierFilters
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
        />
        
        <SupplierActions
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleAddSupplier={handleAddSupplier}
          handleImportSuppliers={handleImportSuppliers}
          existingSuppliers={suppliers}
        />
      </div>
      
      <SuppliersTable 
        suppliers={paginatedSuppliers}
        isAdmin={true}
        onSelectSupplier={setSelectedSupplier}
        onRemoveSupplier={handleRemoveSupplier}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      
      <SupplierDeleteDialog
        removeSupplierAlert={removeSupplierAlert}
        setRemoveSupplierAlert={setRemoveSupplierAlert}
        confirmRemoveSupplier={confirmRemoveSupplier}
      />
    </>
  );
};

export default SuppliersContent;
