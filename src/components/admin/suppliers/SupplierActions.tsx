
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SupplierForm from "@/components/admin/suppliers/SupplierForm";
import CsvImportDialog from "@/components/admin/CsvImportDialog";

interface SupplierActionsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  handleAddSupplier: (newSupplier: any) => void;
  handleImportSuppliers: (suppliers: any[]) => void;
  existingSuppliers: any[];
}

const SupplierActions: React.FC<SupplierActionsProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  handleAddSupplier,
  handleImportSuppliers,
  existingSuppliers,
}) => {
  return (
    <div className="flex gap-2">
      {/* Botão para Importar CSV */}
      <CsvImportDialog 
        onImport={handleImportSuppliers}
        existingSuppliers={existingSuppliers}
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
  );
};

export default SupplierActions;
