
import { useState, useCallback, useMemo } from "react";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";
import { useOptimizedQueries } from "./useOptimizedQueries";
import { useOptimizedFilters } from "./useOptimizedFilters";
import { useOptimizedOperations } from "./useOptimizedOperations";
import { useVirtualizedList } from "./useVirtualizedList";

export const useOptimizedMySuppliers = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<MySupplier | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<"name" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Optimized queries with React Query
  const {
    suppliers,
    isLoading: loading,
    error,
    refetch: refreshSuppliers
  } = useOptimizedQueries();
  
  // Optimized operations with mutations
  const {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    isCreating: isSubmitting
  } = useOptimizedOperations();
  
  // Optimized filters with debounce
  const {
    nameFilter,
    setNameFilter,
    cnpjFilter,
    setCnpjFilter,
    brandFilter,
    setBrandFilter,
    contactFilter,
    setContactFilter,
    filteredSuppliers,
    clearFilters,
    hasActiveFilters
  } = useOptimizedFilters(suppliers);
  
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
  
  // Virtualized list for performance
  const { paginatedItems, pageInfo } = useVirtualizedList({
    items: sortedSuppliers,
    pageSize,
    currentPage
  });
  
  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [nameFilter, cnpjFilter, brandFilter, contactFilter]);
  
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
    try {
      await createSupplier(data);
      setShowForm(false);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
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
  
  return {
    suppliers: paginatedItems,
    allSuppliers: sortedSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    showForm,
    setShowForm,
    isSubmitting,
    loading,
    error,
    retryCount: 0, // Will be managed by React Query
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
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    pageInfo,
    hasActiveFilters,
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
