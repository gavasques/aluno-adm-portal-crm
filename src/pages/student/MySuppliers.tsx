
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import SupplierDetail from "@/components/student/SupplierDetail";
import { useMySuppliers } from "@/hooks/student/useMySuppliers";
import { SuppliersFilter } from "@/components/student/my-suppliers/SuppliersFilter";
import { SuppliersList } from "@/components/student/my-suppliers/SuppliersList";
import { SupplierForm } from "@/components/student/my-suppliers/SupplierForm";

const MySuppliers = () => {
  const {
    sortedSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isSubmitting,
    nameFilter,
    setNameFilter,
    cnpjFilter,
    setCnpjFilter,
    brandFilter,
    setBrandFilter,
    contactFilter,
    setContactFilter,
    sortField,
    sortDirection,
    handleSort,
    handleAddSupplier,
    handleDeleteSupplier,
    handleUpdateSupplier,
    clearFilters
  } = useMySuppliers();
  
  return (
    <div className="container mx-auto py-6">
      {!selectedSupplier ? (
        <>
          <h1 className="text-3xl font-bold mb-8 text-portal-dark">Meus Fornecedores</h1>
          
          <SuppliersFilter
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
            cnpjFilter={cnpjFilter}
            setCnpjFilter={setCnpjFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            contactFilter={contactFilter}
            setContactFilter={setContactFilter}
            clearFilters={clearFilters}
            onAddSupplier={() => setIsAddDialogOpen(true)}
          />
          
          <SuppliersList
            suppliers={sortedSuppliers}
            onSelectSupplier={setSelectedSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onAddSupplier={() => setIsAddDialogOpen(true)}
          />
        </>
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier} 
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
        />
      )}
      
      {/* Add Supplier Dialog with form validation */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
          </DialogHeader>
          
          <SupplierForm 
            onSubmit={handleAddSupplier}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySuppliers;
