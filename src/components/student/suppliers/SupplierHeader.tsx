
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
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
  
  const dropdownButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 }
  };
  
  return (
    <div className="animate-fade-in">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-portal-dark"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Fornecedores
      </motion.h1>
      
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar fornecedores..."
              className="pl-10 border-portal-accent/30 focus:border-portal-accent/80 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filtros em Dropdowns */}
          <div className="flex gap-2">
            {/* Dropdown para Categorias */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div variants={dropdownButtonVariants} initial="initial" whileHover="hover">
                  <Button 
                    variant="outline" 
                    className="flex items-center bg-gradient-to-r from-portal-light to-white border-portal-accent/30"
                  >
                    Categorias {selectedCategories.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-portal-accent text-white rounded-full text-xs">
                        {selectedCategories.length}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-portal-accent/20 shadow-lg" align="start">
                <DropdownMenuLabel className="text-portal-dark">Selecione as categorias</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-portal-accent/20" />
                <DropdownMenuGroup>
                  {/* Opção "Todos" */}
                  <DropdownMenuCheckboxItem
                    key="todos-categorias"
                    checked={selectedCategories.length === 0}
                    onCheckedChange={() => toggleCategoryFilter("Todos")}
                    className="hover:bg-portal-light/20 transition-colors"
                  >
                    Todos
                  </DropdownMenuCheckboxItem>
                  {CATEGORIES.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => toggleCategoryFilter(category.name)}
                      className="hover:bg-portal-light/20 transition-colors"
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
                <motion.div variants={dropdownButtonVariants} initial="initial" whileHover="hover">
                  <Button 
                    variant="outline" 
                    className="flex items-center bg-gradient-to-r from-blue-50 to-white border-blue-200"
                  >
                    Marcas {selectedBrands.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-blue-400 text-white rounded-full text-xs">
                        {selectedBrands.length}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-blue-200 shadow-lg" align="start">
                <DropdownMenuLabel className="text-blue-700">Selecione as marcas</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-100" />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuGroup>
                    {/* Opção "Todos" */}
                    <DropdownMenuCheckboxItem
                      key="todos-marcas"
                      checked={selectedBrands.length === 0}
                      onCheckedChange={() => toggleBrandFilter("Todos")}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      Todos
                    </DropdownMenuCheckboxItem>
                    {allBrands.map((brand) => (
                      <DropdownMenuCheckboxItem
                        key={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrandFilter(brand)}
                        className="hover:bg-blue-50 transition-colors"
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
                <motion.div variants={dropdownButtonVariants} initial="initial" whileHover="hover">
                  <Button 
                    variant="outline" 
                    className="flex items-center bg-gradient-to-r from-green-50 to-white border-green-200"
                  >
                    Tipos {selectedTypes.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-green-500 text-white rounded-full text-xs">
                        {selectedTypes.length}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-green-200 shadow-lg" align="start">
                <DropdownMenuLabel className="text-green-700">Selecione os tipos</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-green-100" />
                <DropdownMenuGroup>
                  {/* Opção "Todos" */}
                  <DropdownMenuCheckboxItem
                    key="todos-tipos"
                    checked={selectedTypes.length === 0}
                    onCheckedChange={() => toggleTypeFilter("Todos")}
                    className="hover:bg-green-50 transition-colors"
                  >
                    Todos
                  </DropdownMenuCheckboxItem>
                  {SUPPLIER_TYPES.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => toggleTypeFilter(type)}
                      className="hover:bg-green-50 transition-colors"
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
