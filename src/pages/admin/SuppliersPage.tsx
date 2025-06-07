
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import SuppliersContent from '@/components/admin/suppliers/SuppliersContent';

// Mock data para demonstração - em produção viria do banco de dados
const mockSuppliers = [
  {
    id: 1,
    name: "TechSolutions Corp",
    category: "Tecnologia",
    type: "Software",
    brand: "Microsoft",
    status: "Ativo",
    contact: "contato@techsolutions.com",
    rating: 4.8,
    description: "Soluções completas em tecnologia para empresas",
    website: "www.techsolutions.com",
    location: "São Paulo, SP"
  },
  {
    id: 2,
    name: "Marketing Digital Plus",
    category: "Marketing",
    type: "Agência",
    brand: "Google",
    status: "Ativo",
    contact: "vendas@mdplus.com",
    rating: 4.6,
    description: "Agência especializada em marketing digital e growth",
    website: "www.mdplus.com",
    location: "Rio de Janeiro, RJ"
  },
  {
    id: 3,
    name: "LogiTransporte",
    category: "Logística",
    type: "Transporte",
    brand: "Própria",
    status: "Ativo",
    contact: "operacoes@logitransporte.com",
    rating: 4.7,
    description: "Soluções logísticas e transporte nacional",
    website: "www.logitransporte.com",
    location: "Belo Horizonte, MG"
  }
];

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'name' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removeSupplierAlert, setRemoveSupplierAlert] = useState<any>(null);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(supplier.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(supplier.type);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(supplier.brand);
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(supplier.status);
      
      return matchesSearch && matchesCategory && matchesType && matchesBrand && matchesStatus;
    });
  }, [suppliers, searchQuery, selectedCategories, selectedTypes, selectedBrands, selectedStatus]);

  // Sorted suppliers
  const sortedSuppliers = useMemo(() => {
    return [...filteredSuppliers].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      return a[sortField].localeCompare(b[sortField]) * direction;
    });
  }, [filteredSuppliers, sortField, sortDirection]);

  // Paginated suppliers
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedSuppliers.slice(startIndex, startIndex + pageSize);
  }, [sortedSuppliers, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedSuppliers.length / pageSize);

  // All unique brands for filters
  const allBrands = useMemo(() => {
    return [...new Set(suppliers.map(s => s.brand))];
  }, [suppliers]);

  // Filter functions
  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleBrandFilter = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setCurrentPage(1);
  };

  const handleSort = (field: 'name' | 'category') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRemoveSupplier = (id: number | string) => {
    const supplier = suppliers.find(s => s.id === id);
    setRemoveSupplierAlert(supplier);
  };

  const confirmRemoveSupplier = () => {
    if (removeSupplierAlert) {
      setSuppliers(prev => prev.filter(s => s.id !== removeSupplierAlert.id));
      setRemoveSupplierAlert(null);
    }
  };

  const handleAddSupplier = (newSupplier: any) => {
    const supplierWithId = {
      ...newSupplier,
      id: suppliers.length + 1,
      rating: 0,
      status: 'Ativo'
    };
    setSuppliers(prev => [...prev, supplierWithId]);
  };

  const handleImportSuppliers = (importedSuppliers: any[]) => {
    const suppliersWithIds = importedSuppliers.map((supplier, index) => ({
      ...supplier,
      id: suppliers.length + index + 1,
      status: supplier.status || 'Ativo',
      rating: supplier.rating || 0
    }));
    setSuppliers(prev => [...prev, ...suppliersWithIds]);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Fornecedores
            </h1>
            <p className="text-muted-foreground">
              Gerencie todos os fornecedores cadastrados na plataforma
            </p>
          </div>
        </div>

        <SuppliersContent
          suppliers={filteredSuppliers}
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
          paginatedSuppliers={paginatedSuppliers}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          setSelectedSupplier={setSelectedSupplier}
          handleRemoveSupplier={handleRemoveSupplier}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleAddSupplier={handleAddSupplier}
          handleImportSuppliers={handleImportSuppliers}
          removeSupplierAlert={removeSupplierAlert}
          setRemoveSupplierAlert={setRemoveSupplierAlert}
          confirmRemoveSupplier={confirmRemoveSupplier}
        />
      </motion.div>
    </div>
  );
};

export default SuppliersPage;
