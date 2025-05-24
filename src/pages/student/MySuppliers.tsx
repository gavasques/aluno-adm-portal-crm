
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SupplierForm } from "@/components/student/my-suppliers/SupplierForm";
import { SuppliersList } from "@/components/student/my-suppliers/SuppliersList";
import SupplierDetail from "@/components/student/SupplierDetail";
import StudentRouteGuard from "@/components/student/RouteGuard";
import { useMySuppliers } from "@/hooks/student/useMySuppliers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";

const MySuppliers = () => {
  const {
    suppliers,
    selectedSupplier,
    setSelectedSupplier,
    showForm,
    setShowForm,
    isSubmitting,
    loading,
    error,
    retryCount,
    sortField,
    sortDirection,
    handleSort,
    handleAddSupplier,
    handleDeleteSupplier,
    handleSubmit,
    handleCancel,
    handleUpdateSupplier,
    handleRetry
  } = useMySuppliers();

  // Loading state
  if (loading) {
    return (
      <StudentRouteGuard requiredMenuKey="my-suppliers">
        <div className="container mx-auto py-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Fornecedores</h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus fornecedores pessoais e mantenha seus dados organizados.
              </p>
            </div>
            <Button disabled className="bg-gray-300">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Fornecedor
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </StudentRouteGuard>
    );
  }

  // Error state with detailed information and retry option
  if (error) {
    return (
      <StudentRouteGuard requiredMenuKey="my-suppliers">
        <div className="container mx-auto py-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Fornecedores</h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus fornecedores pessoais e mantenha seus dados organizados.
              </p>
            </div>
          </div>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-2">Erro ao carregar fornecedores</h3>
                  <p className="text-sm text-red-700 mb-4">{error}</p>
                  
                  {retryCount > 0 && (
                    <p className="text-xs text-red-600 mb-4">
                      Tentativas de reconexão: {retryCount}/3
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleRetry}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tentar Novamente
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      size="sm"
                    >
                      Recarregar Página
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-red-100 rounded-md">
                    <p className="text-xs text-red-700">
                      <strong>Dica:</strong> Se o problema persistir, verifique sua conexão com a internet 
                      ou entre em contato com o suporte.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </StudentRouteGuard>
    );
  }

  return (
    <StudentRouteGuard requiredMenuKey="my-suppliers">
      <div className="container mx-auto py-6 space-y-8">
        <AnimatePresence mode="wait">
          {!selectedSupplier ? (
            <motion.div
              key="suppliers-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
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
            </motion.div>
          ) : (
            <motion.div
              key="supplier-detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <SupplierDetail
                supplier={selectedSupplier}
                onBack={() => setSelectedSupplier(null)}
                onUpdate={handleUpdateSupplier}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
