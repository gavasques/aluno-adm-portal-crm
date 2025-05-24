
import React from "react";
import { motion } from "framer-motion";
import { MySupplier } from "@/types/my-suppliers.types";
import { SuppliersFilter } from "./SuppliersFilter";
import { SuppliersList } from "./SuppliersList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MySuppliersListProps {
  suppliers: MySupplier[];
  nameFilter: string;
  setNameFilter: (value: string) => void;
  cnpjFilter: string;
  setCnpjFilter: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  contactFilter: string;
  setContactFilter: (value: string) => void;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  handleSort: (field: "name" | "category") => void;
  handleAddSupplier: () => void;
  handleDeleteSupplier: (id: string) => void;
  onSelectSupplier: (supplier: MySupplier) => void;
  clearFilters: () => void;
}

export const MySuppliersListView: React.FC<MySuppliersListProps> = ({
  suppliers,
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
  onSelectSupplier,
  clearFilters
}) => {
  return (
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
          hasActiveFilters={nameFilter !== "" || cnpjFilter !== "" || brandFilter !== "" || contactFilter !== ""}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SuppliersList
          suppliers={suppliers}
          onSelectSupplier={onSelectSupplier}
          onDeleteSupplier={handleDeleteSupplier}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onAddSupplier={handleAddSupplier}
        />
      </motion.div>
    </motion.div>
  );
};
