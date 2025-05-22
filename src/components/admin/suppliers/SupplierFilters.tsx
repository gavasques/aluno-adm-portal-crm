
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface SupplierFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  selectedTypes: string[];
  selectedBrands: string[];
  selectedStatus: string[];
  allBrands: string[];
  toggleCategoryFilter: (category: string) => void;
  toggleTypeFilter: (type: string) => void;
  toggleBrandFilter: (brand: string) => void;
  toggleStatusFilter: (status: string) => void;
}

const SupplierFilters: React.FC<SupplierFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  selectedTypes,
  selectedBrands,
  selectedStatus,
  allBrands,
  toggleCategoryFilter,
  toggleTypeFilter,
  toggleBrandFilter,
  toggleStatusFilter,
}) => {
  return (
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
  );
};

export default SupplierFilters;
