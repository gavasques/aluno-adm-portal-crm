
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SupplierForm from "@/components/admin/SupplierForm";
import SupplierDetail from "@/components/admin/SupplierDetail";
import SuppliersTable, { Supplier } from "@/components/admin/SuppliersTable";
import { toast } from "sonner";

// Dados de exemplo (agora com campo status)
const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Distribuidor Nacional",
    category: "Produtos Diversos",
    categoryId: 1,
    rating: 4.7,
    comments: 12,
    cnpj: "12.345.678/0001-90",
    email: "contato@distribuidornacional.com",
    phone: "(11) 98765-4321",
    website: "www.distribuidornacional.com",
    address: "Av. Exemplo, 1000 - São Paulo/SP",
    logo: "DN",
    type: "Distribuidor",
    brands: ["Marca A", "Marca B"],
    status: "Ativo"
  },
  {
    id: 2,
    name: "Importadora Global",
    category: "Eletrônicos",
    categoryId: 2,
    rating: 4.2,
    comments: 8,
    cnpj: "98.765.432/0001-10",
    email: "contato@importadoraglobal.com",
    phone: "(11) 91234-5678",
    website: "www.importadoraglobal.com",
    address: "Rua Exemplo, 500 - São Paulo/SP",
    logo: "IG",
    type: "Importador",
    brands: ["Marca C", "Marca D"],
    status: "Ativo"
  },
  {
    id: 3,
    name: "Manufatura Express",
    category: "Vestuário",
    categoryId: 3,
    rating: 3.9,
    comments: 15,
    cnpj: "45.678.901/0001-23",
    email: "contato@manufaturaexpress.com",
    phone: "(11) 94567-8901",
    website: "www.manufaturaexpress.com",
    address: "Rua dos Exemplos, 200 - São Paulo/SP",
    logo: "ME",
    type: "Fabricante",
    brands: ["Marca E", "Marca F"],
    status: "Inativo"
  },
  {
    id: 4,
    name: "Tech Solution Distribuidora",
    category: "Tecnologia",
    categoryId: 2,
    rating: 4.5,
    comments: 23,
    cnpj: "34.567.890/0001-12",
    email: "contato@techsolution.com",
    phone: "(11) 93456-7890",
    website: "www.techsolution.com",
    address: "Av. Exemplar, 300 - São Paulo/SP",
    logo: "TS",
    type: "Distribuidor",
    brands: ["Marca G"],
    status: "Ativo"
  },
  {
    id: 5,
    name: "Eco Produtos",
    category: "Sustentáveis",
    categoryId: 3,
    rating: 4.8,
    comments: 19,
    cnpj: "23.456.789/0001-01",
    email: "contato@ecoprodutos.com",
    phone: "(11) 92345-6789",
    website: "www.ecoprodutos.com",
    address: "Rua Sustentável, 100 - São Paulo/SP",
    logo: "EP",
    type: "Fabricante",
    brands: ["Marca H", "Marca I"],
    status: "Ativo"
  }
];

// Categorias e Tipos de Fornecedor
const CATEGORIES = ["Produtos Diversos", "Eletrônicos", "Vestuário", "Tecnologia", "Sustentáveis"];
const SUPPLIER_TYPES = ["Fabricante", "Distribuidor", "Importador", "Atacadista", "Varejista", "Representante"];

// Extrair todas as marcas dos fornecedores
const getAllBrands = (suppliers: Supplier[]): string[] => {
  const brandsSet = new Set<string>();
  suppliers.forEach(supplier => {
    if (supplier.brands && Array.isArray(supplier.brands)) {
      supplier.brands.forEach(brand => brandsSet.add(brand));
    }
  });
  return Array.from(brandsSet);
};

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removeSupplierAlert, setRemoveSupplierAlert] = useState<Supplier | null>(null);
  
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

  return (
    <div className="px-6 py-6 w-full">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Fornecedores</h1>
      
      {!selectedSupplier ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar fornecedores..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filtros em Dropdowns */}
              <div className="flex gap-2">
                {/* Dropdown para Categorias */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Categorias {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Selecione as categorias</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {/* Adicionar opção "Todos" */}
                      <DropdownMenuCheckboxItem
                        key="todos-categorias"
                        checked={selectedCategories.length === 0}
                        onCheckedChange={() => toggleCategoryFilter("Todos")}
                      >
                        Todos
                      </DropdownMenuCheckboxItem>
                      {CATEGORIES.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategoryFilter(category)}
                        >
                          {category}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dropdown para Marcas */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Marcas {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Selecione as marcas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-60 overflow-y-auto">
                      <DropdownMenuGroup>
                        {/* Adicionar opção "Todos" */}
                        <DropdownMenuCheckboxItem
                          key="todos-marcas"
                          checked={selectedBrands.length === 0}
                          onCheckedChange={() => toggleBrandFilter("Todos")}
                        >
                          Todos
                        </DropdownMenuCheckboxItem>
                        {allBrands.map((brand) => (
                          <DropdownMenuCheckboxItem
                            key={brand}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrandFilter(brand)}
                          >
                            {brand}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuGroup>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Dropdown para Tipos de Fornecedor */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Tipos {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Selecione os tipos</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {/* Adicionar opção "Todos" */}
                      <DropdownMenuCheckboxItem
                        key="todos-tipos"
                        checked={selectedTypes.length === 0}
                        onCheckedChange={() => toggleTypeFilter("Todos")}
                      >
                        Todos
                      </DropdownMenuCheckboxItem>
                      {SUPPLIER_TYPES.map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleTypeFilter(type)}
                        >
                          {type}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Dropdown para Status (apenas para ADM) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Status {selectedStatus.length > 0 && `(${selectedStatus.length})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Selecione os status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {/* Adicionar opção "Todos" */}
                      <DropdownMenuCheckboxItem
                        key="todos-status"
                        checked={selectedStatus.length === 0}
                        onCheckedChange={() => toggleStatusFilter("Todos")}
                      >
                        Todos
                      </DropdownMenuCheckboxItem>
                      {["Ativo", "Inativo"].map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={selectedStatus.includes(status)}
                          onCheckedChange={() => toggleStatusFilter(status)}
                        >
                          {status}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Fornecedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
                </DialogHeader>
                <SupplierForm onSubmit={handleAddSupplier} />
              </DialogContent>
            </Dialog>
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
          
          <AlertDialog open={!!removeSupplierAlert} onOpenChange={() => setRemoveSupplierAlert(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o fornecedor "{removeSupplierAlert?.name}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmRemoveSupplier}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier}
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default AdminSuppliers;
