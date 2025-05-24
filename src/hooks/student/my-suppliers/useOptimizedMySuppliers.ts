
import { useState, useMemo, useCallback } from "react";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";
import { useSupabaseMySuppliers } from "../useSupabaseMySuppliers";

export const useOptimizedMySuppliers = () => {
  const {
    suppliers,
    loading,
    error,
    retryCount,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers
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
  
  // Memoized filtered suppliers to avoid recalculation on every render
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const nameMatch = supplier.name.toLowerCase().includes(nameFilter.toLowerCase());
      const cnpjMatch = (supplier.cnpj || "").replace(/\D/g, "").includes(cnpjFilter.replace(/\D/g, "")) || 
                        supplier.branches.some(branch => 
                          (branch.cnpj || "").replace(/\D/g, "").includes(cnpjFilter.replace(/\D/g, "")));
      const brandMatch = brandFilter === "" || 
                         supplier.brands.some(brand => 
                           brand.name.toLowerCase().includes(brandFilter.toLowerCase()));
      const contactMatch = contactFilter === "" || 
                           supplier.contacts.some(contact => 
                             contact.name.toLowerCase().includes(contactFilter.toLowerCase()));
      
      return nameMatch && cnpjMatch && brandMatch && contactMatch;
    });
  }, [suppliers, nameFilter, cnpjFilter, brandFilter, contactFilter]);
  
  // Memoized sorted suppliers
  const sortedSuppliers = useMemo(() => {
    return [...filteredSuppliers].sort((a, b) => {
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
  }, [filteredSuppliers, sortField, sortDirection]);
  
  const handleSort = useCallback((field: "name" | "category") => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);
  
  const handleAddSupplier = useCallback(() => {
    setShowForm(true);
  }, []);
  
  const handleSubmit = useCallback(async (data: SupplierFormValues) => {
    setIsSubmitting(true);
    
    try {
      const newSupplier = await createSupplier(data);
      if (newSupplier) {
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [createSupplier]);
  
  const handleCancel = useCallback(() => {
    setShowForm(false);
  }, []);
  
  const handleDeleteSupplier = useCallback(async (id: string) => {
    try {
      await deleteSupplier(id);
    } catch (err) {
      console.error('Error in handleDeleteSupplier:', err);
    }
  }, [deleteSupplier]);

  const handleUpdateSupplier = useCallback(async (updatedSupplier: MySupplier) => {
    try {
      const result = await updateSupplier(updatedSupplier.id, updatedSupplier);
      if (result) {
        setSelectedSupplier(result);
      }
    } catch (err) {
      console.error('Error in handleUpdateSupplier:', err);
    }
  }, [updateSupplier]);

  const handleRetry = useCallback(() => {
    console.log('Manual retry requested');
    refreshSuppliers();
  }, [refreshSuppliers]);
  
  const clearFilters = useCallback(() => {
    setNameFilter("");
    setCnpjFilter("");
    setBrandFilter("");
    setContactFilter("");
  }, []);
  
  return {
    suppliers: sortedSuppliers,
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
    handleSubmit,
    handleCancel,
    handleDeleteSupplier,
    handleUpdateSupplier,
    handleRetry,
    clearFilters
  };
};
