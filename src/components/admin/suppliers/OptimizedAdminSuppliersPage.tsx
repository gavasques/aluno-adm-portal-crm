
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, Users, Star, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SuppliersTable from '@/components/admin/SuppliersTable';
import { Supplier } from '@/types/supplier.types';

// Mock data para demonstração
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Fornecedor ABC Ltda",
    category: "Produtos Regionais",
    rating: 4.5,
    comments: 12,
    cnpj: "12.345.678/0001-90",
    email: "contato@fornecedorabc.com.br",
    phone: "(11) 98765-4321",
    website: "www.fornecedorabc.com.br",
    address: "Rua das Flores, 123, São Paulo - SP",
    type: "Distribuidor",
    brands: ["Marca A", "Marca B"],
    status: "Ativo"
  },
  {
    id: 2,
    name: "Tech Solutions Brasil",
    category: "Tecnologia",
    rating: 4.8,
    comments: 25,
    cnpj: "98.765.432/0001-10",
    email: "vendas@techsolutions.com.br",
    phone: "(11) 91234-5678",
    website: "www.techsolutions.com.br",
    address: "Av. Paulista, 1000, São Paulo - SP",
    type: "Fabricante",
    brands: ["TechBrand", "Innovation"],
    status: "Ativo"
  },
  {
    id: 3,
    name: "Moda e Estilo Atacado",
    category: "Vestuário",
    rating: 4.2,
    comments: 8,
    cnpj: "11.222.333/0001-44",
    email: "atacado@modaestilo.com.br",
    phone: "(11) 95555-1234",
    website: "www.modaestilo.com.br",
    address: "Rua do Comércio, 456, São Paulo - SP",
    type: "Atacadista",
    brands: ["Fashion Plus", "Style Pro"],
    status: "Ativo"
  }
];

export const OptimizedAdminSuppliersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"name" | "category">('name');
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">('asc');

  // Filtrar fornecedores
  const filteredSuppliers = useMemo(() => {
    return MOCK_SUPPLIERS.filter(supplier =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Ordenar fornecedores
  const sortedSuppliers = useMemo(() => {
    const sorted = [...filteredSuppliers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return sorted;
  }, [filteredSuppliers, sortField, sortDirection]);

  // Paginação
  const totalPages = Math.ceil(sortedSuppliers.length / pageSize);
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: "name" | "category") => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRemoveSupplier = (id: number | string) => {
    console.log('Remover fornecedor:', id);
  };

  // Estatísticas
  const totalSuppliers = MOCK_SUPPLIERS.length;
  const activeSuppliers = MOCK_SUPPLIERS.filter(s => s.status === "Ativo").length;
  const averageRating = MOCK_SUPPLIERS.reduce((acc, s) => acc + s.rating, 0) / MOCK_SUPPLIERS.length;
  const topCategories = [...new Set(MOCK_SUPPLIERS.map(s => s.category))].length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores (Admin)</h1>
          <p className="text-muted-foreground">
            Gerencie todos os fornecedores do sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Fornecedor
        </Button>
      </div>

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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Fornecedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Nome do fornecedor..." 
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

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
                {paginatedSuppliers.length} de {sortedSuppliers.length}
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
    </div>
  );
};
