
import React from "react";
import { motion } from "framer-motion";
import { SupplierForm } from "@/components/student/my-suppliers/SupplierForm";
import { SuppliersList } from "@/components/student/my-suppliers/SuppliersList";
import StudentRouteGuard from "@/components/student/RouteGuard";
import { useMySuppliers } from "@/hooks/student/useMySuppliers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MySuppliers = () => {
  const {
    suppliers,
    selectedSupplier,
    setSelectedSupplier,
    showForm,
    setShowForm,
    isSubmitting,
    sortField,
    sortDirection,
    handleSort,
    handleAddSupplier,
    handleDeleteSupplier,
    handleSubmit,
    handleCancel
  } = useMySuppliers();

  return (
    <StudentRouteGuard requiredMenuKey="my-suppliers">
      <div className="container mx-auto py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Fornecedores</h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus fornecedores pessoais e mantenha seus dados organizados.
              </p>
            </div>
            <Button
              onClick={handleAddSupplier}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Fornecedor
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SuppliersList
            suppliers={suppliers}
            onSelectSupplier={setSelectedSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onAddSupplier={handleAddSupplier}
          />
        </motion.div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Fornecedor</DialogTitle>
            </DialogHeader>
            <SupplierForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </StudentRouteGuard>
  );
};

export default MySuppliers;
