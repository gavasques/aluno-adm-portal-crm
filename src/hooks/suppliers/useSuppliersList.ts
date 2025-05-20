
import { useState, useEffect } from "react";
import { Supplier } from "@/types/supplier.types";
import { INITIAL_SUPPLIERS, getAllBrands } from "@/data/suppliersData";

export const useSuppliersList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estado para filtros
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  // Estado para paginação
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para ordenação
  const [sortField, setSortField] = useState<"name" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Gerar lista de marcas dos fornecedores
  const allBrands = getAllBrands(suppliers);
  
  // Filtrar fornecedores com base em todos os critérios
  const filteredSuppliers = suppliers.filter(supplier => {
    // Pesquisa por nome
    const nameMatch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro por categoria
    const categoryMatch = selectedCategories.length === 0 || 
                          selectedCategories.includes(supplier.category);
    
    // Filtro por tipo
    const typeMatch = selectedTypes.length === 0 || 
                      selectedTypes.includes(supplier.type || "");
    
    // Filtro por marca
    const brandMatch = selectedBrands.length === 0 || 
                      (supplier.brands && supplier.brands.some(brand => selectedBrands.includes(brand)));
    
    // Filtro por status
    const statusMatch = selectedStatus.length === 0 ||
                        selectedStatus.includes(supplier.status || "Ativo");
    
    return nameMatch && categoryMatch && typeMatch && brandMatch && statusMatch;
  });
  
  // Ordenar fornecedores
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
  
  // Paginação
  const totalPages = Math.max(1, Math.ceil(sortedSuppliers.length / pageSize));
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Resetar paginação quando os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedTypes, selectedBrands, selectedStatus, pageSize, sortField, sortDirection]);

  // Funções de filtro
  const toggleCategoryFilter = (category: string) => {
    // Se "Todos" foi selecionado, limpar todas as seleções
    if (category === "Todos") {
      setSelectedCategories([]);
      return;
    }
    
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleTypeFilter = (type: string) => {
    // Se "Todos" foi selecionado, limpar todas as seleções
    if (type === "Todos") {
      setSelectedTypes([]);
      return;
    }
    
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const toggleBrandFilter = (brand: string) => {
    // Se "Todos" foi selecionado, limpar todas as seleções
    if (brand === "Todos") {
      setSelectedBrands([]);
      return;
    }
    
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };
  
  const toggleStatusFilter = (status: string) => {
    // Se "Todos" foi selecionado, limpar todas as seleções
    if (status === "Todos") {
      setSelectedStatus([]);
      return;
    }
    
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleSort = (field: "name" | "category") => {
    if (sortField === field) {
      // Inverter direção se o campo for o mesmo
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Definir novo campo e direção padrão
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return {
    suppliers,
    setSuppliers,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedTypes,
    selectedBrands,
    selectedStatus,
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
    toggleStatusFilter,
    handleSort
  };
};
