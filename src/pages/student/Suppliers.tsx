
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
import SupplierDetail from "@/components/admin/SupplierDetail";
import SuppliersTable from "@/components/admin/SuppliersTable";
import { toast } from "sonner";

// Importar hooks e dados
import { useSuppliersList } from "@/hooks/suppliers/useSuppliersList";
import { useSupplierOperations } from "@/hooks/suppliers/useSupplierOperations";
import { CATEGORIES, SUPPLIER_TYPES } from "@/data/suppliersData";

const Suppliers = () => {
  // Usar nossos hooks personalizados
  const {
    suppliers,
    setSuppliers,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedTypes,
    selectedBrands,
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
    handleSort
  } = useSuppliersList();

  const {
    selectedSupplier,
    setSelectedSupplier,
    handleUpdateSupplier
  } = useSupplierOperations(suppliers, setSuppliers);

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
          onUpdate={(updatedSupplier) => {
            handleUpdateSupplier(updatedSupplier);
            toast.success("Avaliação enviada com sucesso!");
          }}
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default Suppliers;
