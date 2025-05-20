import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Star, MessageCircle, Grid, List as ListIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SupplierForm from "@/components/admin/SupplierForm";
import SupplierDetail from "@/components/admin/SupplierDetail";
import { toast } from "sonner";

// Dados de exemplo
const INITIAL_SUPPLIERS = [
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
    brands: ["Marca A", "Marca B"]
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
    brands: ["Marca C", "Marca D"]
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
    brands: ["Marca E", "Marca F"]
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
    brands: ["Marca G"]
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
    brands: ["Marca H", "Marca I"]
  }
];

// Categorias e Tipos de Fornecedor
const CATEGORIES = ["Produtos Diversos", "Eletrônicos", "Vestuário", "Tecnologia", "Sustentáveis"];
const SUPPLIER_TYPES = ["Fabricante", "Distribuidor", "Importador", "Atacadista", "Varejista", "Representante"];

// Extrair todas as marcas dos fornecedores
const getAllBrands = (suppliers) => {
  const brandsSet = new Set();
  suppliers.forEach(supplier => {
    if (supplier.brands && Array.isArray(supplier.brands)) {
      supplier.brands.forEach(brand => brandsSet.add(brand));
    }
  });
  return Array.from(brandsSet);
};

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado para filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  
  // Estado para visualização (card ou lista)
  const [viewMode, setViewMode] = useState("card"); // "card" ou "list"
  
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
                      selectedTypes.includes(supplier.type);
    
    // Filtro por marca
    const brandMatch = selectedBrands.length === 0 || 
                      (supplier.brands && supplier.brands.some(brand => selectedBrands.includes(brand)));
    
    return nameMatch && categoryMatch && typeMatch && brandMatch;
  });
  
  const handleAddSupplier = (newSupplier) => {
    const id = Math.max(...suppliers.map(s => s.id), 0) + 1;
    const supplierWithId = { 
      ...newSupplier, 
      id, 
      rating: 0, 
      comments: 0,
      brands: []
    };
    setSuppliers([...suppliers, supplierWithId]);
    setIsDialogOpen(false);
    toast.success("Fornecedor adicionado com sucesso!");
  };
  
  const handleUpdateSupplier = (updatedSupplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
    setSelectedSupplier(updatedSupplier);
    toast.success("Fornecedor atualizado com sucesso!");
  };
  
  const toggleCategoryFilter = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleTypeFilter = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const toggleBrandFilter = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="container mx-auto py-6">
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
              
              {/* Filtro */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <h4 className="font-medium">Categorias</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category}`} 
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategoryFilter(category)}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <h4 className="font-medium">Tipo de Fornecedor</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPLIER_TYPES.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`type-${type}`} 
                              checked={selectedTypes.includes(type)}
                              onCheckedChange={() => toggleTypeFilter(type)}
                            />
                            <Label htmlFor={`type-${type}`}>{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <h4 className="font-medium">Marcas</h4>
                      <div className="max-h-36 overflow-y-auto grid grid-cols-2 gap-2">
                        {allBrands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`brand-${brand}`} 
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => toggleBrandFilter(brand)}
                            />
                            <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Alternar visualização */}
              <div className="flex items-center border rounded-md">
                <Button 
                  variant={viewMode === "card" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-r-none"
                  onClick={() => setViewMode("card")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
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
          
          {/* Visualização em Cards */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card 
                  key={supplier.id.toString()} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 rounded-lg bg-portal-primary text-white flex items-center justify-center text-xl font-bold">
                        {supplier.logo || supplier.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{supplier.name}</h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">{supplier.category}</span>
                          {supplier.type && (
                            <span className="text-xs px-2 py-0.5 bg-portal-light text-portal-dark rounded-full">
                              {supplier.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className="mr-0.5" 
                            fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({supplier.rating})</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <MessageCircle size={16} className="mr-1" />
                        {supplier.comments}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredSuppliers.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Nenhum fornecedor encontrado. Tente outra busca ou ajuste os filtros.
                </div>
              )}
            </div>
          )}
          
          {/* Visualização em Lista */}
          {viewMode === "list" && (
            <div className="border rounded-md overflow-hidden">
              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum fornecedor encontrado. Tente outra busca ou ajuste os filtros.
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 grid grid-cols-12 border-b">
                    <div className="col-span-4 font-medium">Nome</div>
                    <div className="col-span-2 font-medium">Categoria</div>
                    <div className="col-span-2 font-medium">Tipo</div>
                    <div className="col-span-2 font-medium">Avaliação</div>
                    <div className="col-span-2 font-medium">Comentários</div>
                  </div>
                  
                  {filteredSuppliers.map((supplier) => (
                    <div 
                      key={supplier.id} 
                      className="p-4 grid grid-cols-12 items-center border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-portal-primary text-white flex items-center justify-center text-sm font-bold">
                          {supplier.logo || supplier.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{supplier.name}</span>
                      </div>
                      <div className="col-span-2 text-sm text-gray-600">{supplier.category}</div>
                      <div className="col-span-2">
                        <span className="text-xs px-2 py-0.5 bg-portal-light text-portal-dark rounded-full">
                          {supplier.type || 'N/A'}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className="mr-0.5" 
                            fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600">({supplier.rating})</span>
                      </div>
                      <div className="col-span-2 flex items-center text-gray-500">
                        <MessageCircle size={14} className="mr-1" />
                        <span className="text-sm">{supplier.comments}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
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
