
import React from "react";
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
import { CATEGORIES, SUPPLIER_TYPES } from "@/data/suppliersData";

interface SupplierHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedTypes: string[];
  allBrands: string[];
  toggleCategoryFilter: (category: string) => void;
  toggleTypeFilter: (type: string) => void;
  toggleBrandFilter: (brand: string) => void;
}

export function SupplierHeader({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  selectedBrands,
  selectedTypes,
  allBrands,
  toggleCategoryFilter,
  toggleTypeFilter,
  toggleBrandFilter
}: SupplierHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Fornecedores</h1>
      
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
                  {/* Opção "Todos" */}
                  <DropdownMenuCheckboxItem
                    key="todos-categorias"
                    checked={selectedCategories.length === 0}
                    onCheckedChange={() => toggleCategoryFilter("Todos")}
                  >
                    Todos
                  </DropdownMenuCheckboxItem>
                  {CATEGORIES.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => toggleCategoryFilter(category.name)}
                    >
                      {category.name}
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
                    {/* Opção "Todos" */}
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
                  {/* Opção "Todos" */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
