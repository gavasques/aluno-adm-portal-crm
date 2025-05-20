
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Importar componentes
import SupplierForm from "@/components/admin/SupplierForm";
import SupplierDetail from "@/components/admin/SupplierDetail";
import SuppliersTable from "@/components/admin/SuppliersTable";
import CsvImportDialog from "@/components/admin/CsvImportDialog";

// Importar hooks e dados
import { useSuppliersList } from "@/hooks/suppliers/useSuppliersList";
import { useSupplierOperations } from "@/hooks/suppliers/useSupplierOperations";
import { CATEGORIES, SUPPLIER_TYPES } from "@/data/suppliersData";

const AdminSuppliers = () => {
  // Usar nossos hooks personalizados
  const {
    suppliers,
    setSuppliers,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedTypes,
    selectedBrands,
    selectedStatus,
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
    toggleStatusFilter,
    handleSort
  } = useSuppliersList();

  const {
    selectedSupplier,
    setSelectedSupplier,
    isDialogOpen,
    setIsDialogOpen,
    removeSupplierAlert,
    setRemoveSupplierAlert,
    handleAddSupplier,
    handleUpdateSupplier,
    handleRemoveSupplier,
    confirmRemoveSupplier,
    handleImportSuppliers
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
            
            <div className="flex gap-2">
              {/* Botão para Importar CSV */}
              <CsvImportDialog 
                onImport={handleImportSuppliers}
                existingSuppliers={suppliers}
              />
              
              {/* Botão para Adicionar Fornecedor */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
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
