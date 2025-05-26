
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, Users, Star } from "lucide-react";
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
  // Calculate stats
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status !== "Inativo").length;
  const averageRating = suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length || 0;
  const topCategories = [...new Set(suppliers.map(s => s.category))].length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{totalSuppliers}</div>
                    <div className="text-sm text-gray-600">Total de Fornecedores</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{activeSuppliers}</div>
                    <div className="text-sm text-gray-600">Fornecedores Ativos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Avaliação Média</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{topCategories}</div>
                    <div className="text-sm text-gray-600">Categorias</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Filters and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Suppliers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Fornecedores
              <Badge variant="secondary" className="ml-2">
                {paginatedSuppliers.length} de {suppliers.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      </motion.div>
      
      <SupplierDeleteDialog
        removeSupplierAlert={removeSupplierAlert}
        setRemoveSupplierAlert={setRemoveSupplierAlert}
        confirmRemoveSupplier={confirmRemoveSupplier}
      />
    </div>
  );
};

export default SuppliersContent;
