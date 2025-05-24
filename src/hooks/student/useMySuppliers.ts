
import { useState } from "react";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";
import { useSupabaseMySuppliers } from "./useSupabaseMySuppliers";

export const useMySuppliers = () => {
  const {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier
  } = useSupabaseMySuppliers();

  const [selectedSupplier, setSelectedSupplier] = useState<MySupplier | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [cnpjFilter, setCnpjFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [sortField, setSortField] = useState<"name" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filter suppliers based on search filters
  const filteredSuppliers = suppliers.filter(supplier => {
    // Nome do Fornecedor
    const nameMatch = supplier.name.toLowerCase().includes(nameFilter.toLowerCase());
    
    // CNPJ do Fornecedor ou Filial
    const cnpjMatch = (supplier.cnpj || "").replace(/\D/g, "").includes(cnpjFilter.replace(/\D/g, "")) || 
                      supplier.branches.some(branch => 
                        (branch.cnpj || "").replace(/\D/g, "").includes(cnpjFilter.replace(/\D/g, "")));
    
    // Marcas
    const brandMatch = brandFilter === "" || 
                       supplier.brands.some(brand => 
                         brand.name.toLowerCase().includes(brandFilter.toLowerCase()));
    
    // Nome do contato
    const contactMatch = contactFilter === "" || 
                         supplier.contacts.some(contact => 
                           contact.name.toLowerCase().includes(contactFilter.toLowerCase()));
    
    return nameMatch && cnpjMatch && brandMatch && contactMatch;
  });
  
  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === "asc" 
        ? a.category.localeCompare(b.category) 
        : b.category.localeCompare(a.category);
    }
  });
  
  const handleSort = (field: "name" | "category") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleAddSupplier = () => {
    setShowForm(true);
  };
  
  const handleSubmit = async (data: SupplierFormValues) => {
    setIsSubmitting(true);
    
    try {
      const newSupplier = await createSupplier(data);
      if (newSupplier) {
        setShowForm(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setShowForm(false);
  };
  
  const handleDeleteSupplier = async (id: string) => {
    await deleteSupplier(id);
  };

  const handleUpdateSupplier = async (updatedSupplier: MySupplier) => {
    const result = await updateSupplier(updatedSupplier.id, updatedSupplier);
    if (result) {
      setSelectedSupplier(result);
    }
  };
  
  // Função para limpar os filtros
  const clearFilters = () => {
    setNameFilter("");
    setCnpjFilter("");
    setBrandFilter("");
    setContactFilter("");
  };
  
  return {
    suppliers: sortedSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    showForm,
    setShowForm,
    isSubmitting,
    loading,
    error,
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
    handleSubmit,
    handleCancel,
    handleDeleteSupplier,
    handleUpdateSupplier,
    clearFilters
  };
};
