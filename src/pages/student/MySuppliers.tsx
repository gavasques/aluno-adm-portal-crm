
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import SupplierDetail from "@/components/student/SupplierDetail";
import { useMySuppliers } from "@/hooks/student/useMySuppliers";
import { SuppliersFilter } from "@/components/student/my-suppliers/SuppliersFilter";
import { SuppliersList } from "@/components/student/my-suppliers/SuppliersList";
import { SupplierForm } from "@/components/student/my-suppliers/SupplierForm";
import { CircleUserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-6"
    >
      {!selectedSupplier ? (
        <>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <Card className="border-none shadow-md bg-gradient-to-r from-purple-600 to-blue-500">
              <CardHeader className="text-white pb-2">
                <div className="flex items-center">
                  <CircleUserPlus className="mr-2 h-6 w-6" />
                  <CardTitle className="text-3xl font-bold">Meus Fornecedores</CardTitle>
                </div>
                <p className="text-white/80 mt-1">
                  Gerencie seus fornecedores e mantenha seus contatos organizados
                </p>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <div className="bg-white/20 rounded-md px-3 py-1 inline-flex text-white text-sm">
                  <span className="font-medium">{sortedSuppliers.length}</span>
                  <span className="ml-1">fornecedores cadastrados</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
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
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SuppliersList
              suppliers={sortedSuppliers}
              onSelectSupplier={setSelectedSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onAddSupplier={() => setIsAddDialogOpen(true)}
            />
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SupplierDetail 
            supplier={selectedSupplier} 
            onBack={() => setSelectedSupplier(null)}
            onUpdate={handleUpdateSupplier}
          />
        </motion.div>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-white to-purple-50 border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-800">Adicionar Novo Fornecedor</DialogTitle>
          </DialogHeader>
          
          <SupplierForm 
            onSubmit={handleAddSupplier}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MySuppliers;
