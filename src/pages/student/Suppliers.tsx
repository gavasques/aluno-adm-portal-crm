import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SupplierDetail from "@/components/admin/SupplierDetail";
import SuppliersTable, { Supplier } from "@/components/admin/SuppliersTable";
import { toast } from "sonner";

// Dados de exemplo
const SUPPLIERS: Supplier[] = [
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
    status: "Ativo"
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

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
  
  // Estado para filtros
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
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
    
    return nameMatch && categoryMatch && typeMatch && brandMatch;
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
  }, [searchQuery, selectedCategories, selectedTypes, selectedBrands, pageSize, sortField, sortDirection]);
  
  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
    setSelectedSupplier(updatedSupplier);
    toast.success("Avaliação enviada com sucesso!");
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
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const toggleBrandFilter = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
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
              </div>
            </div>
          </div>
          
          <SuppliersTable 
            suppliers={paginatedSuppliers}
            isAdmin={false}
            onSelectSupplier={setSelectedSupplier}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </>
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier}
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default Suppliers;
