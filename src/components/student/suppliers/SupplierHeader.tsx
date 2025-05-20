
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package } from "lucide-react";
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
    <div className="animate-fade-in mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-md p-3 text-white shadow-md">
            <Package size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-portal-dark">Fornecedores</h1>
        </motion.div>
        <motion.p 
          className="text-muted-foreground mt-2 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Encontre os melhores fornecedores para seu negócio
        </motion.p>
      </div>
      
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" size={18} />
          <Input
            placeholder="Buscar fornecedores..."
            className="pl-10 transition-all duration-300 bg-white/90 border-amber-200 hover:border-amber-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Dropdown para Categorias */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div variants={dropdownButtonVariants} initial="initial" whileHover="hover">
                <Button 
                  variant="outline" 
                  className="flex items-center bg-gradient-to-r from-orange-50 to-white border-orange-200 hover:border-orange-300 transition-colors"
                >
                  Categorias {selectedCategories.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white rounded-full text-xs">
                      {selectedCategories.length}
                    </span>
                  )}
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-orange-200 shadow-lg" align="start">
              <DropdownMenuLabel className="text-orange-700">Selecione as categorias</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-orange-100" />
              <DropdownMenuGroup>
                {/* Opção "Todos" */}
                <DropdownMenuCheckboxItem
                  key="todos-categorias"
                  checked={selectedCategories.length === 0}
                  onCheckedChange={() => toggleCategoryFilter("Todos")}
                  className="hover:bg-orange-50 transition-colors"
                >
                  Todos
                </DropdownMenuCheckboxItem>
                {CATEGORIES.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => toggleCategoryFilter(category.name)}
                    className="hover:bg-orange-50 transition-colors"
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
                  className="flex items-center bg-gradient-to-r from-blue-50 to-white border-blue-200 hover:border-blue-300 transition-colors"
                >
                  Marcas {selectedBrands.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white rounded-full text-xs">
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
                  className="flex items-center bg-gradient-to-r from-green-50 to-white border-green-200 hover:border-green-300 transition-colors"
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
      </motion.div>
    </div>
  );
}
