
import { useState } from "react";
import { Supplier } from "@/types/supplier.types";
import { toast } from "sonner";

export const useSupplierOperations = (
  suppliers: Supplier[],
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>
) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removeSupplierAlert, setRemoveSupplierAlert] = useState<Supplier | null>(null);

  // Manipulação de fornecedores
  const handleAddSupplier = (newSupplier: Partial<Supplier>) => {
    const id = Math.max(...suppliers.map(s => Number(s.id)), 0) + 1;
    const supplierWithId = { 
      ...newSupplier, 
      id, 
      rating: 0, 
      comments: 0,
      brands: [],
      status: "Ativo"
    } as Supplier;
    setSuppliers([...suppliers, supplierWithId]);
    setIsDialogOpen(false);
    toast.success("Fornecedor adicionado com sucesso!");
  };
  
  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
    setSelectedSupplier(updatedSupplier);
    toast.success("Fornecedor atualizado com sucesso!");
  };
  
  const handleRemoveSupplier = (id: number | string) => {
    const supplierToRemove = suppliers.find(s => s.id === id);
    if (supplierToRemove) {
      setRemoveSupplierAlert(supplierToRemove);
    }
  };
  
  const confirmRemoveSupplier = () => {
    if (removeSupplierAlert) {
      setSuppliers(suppliers.filter(s => s.id !== removeSupplierAlert.id));
      toast.success("Fornecedor removido com sucesso!");
      setRemoveSupplierAlert(null);
    }
  };

  // Função para lidar com a importação de fornecedores via CSV
  const handleImportSuppliers = (newSuppliers: Partial<Supplier>[]) => {
    if (newSuppliers.length === 0) return;
    
    const highestId = Math.max(...suppliers.map(s => Number(s.id)), 0);
    
    const suppliersToAdd = newSuppliers.map((supplier, index) => {
      return {
        ...supplier,
        id: highestId + index + 1,
        rating: 0,
        comments: 0,
        brands: [],
        status: "Ativo"
      } as Supplier;
    });
    
    setSuppliers([...suppliers, ...suppliersToAdd]);
  };

  return {
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
  };
};
