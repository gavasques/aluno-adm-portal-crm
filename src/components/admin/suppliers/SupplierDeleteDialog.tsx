
import React from "react";
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

interface SupplierDeleteDialogProps {
  removeSupplierAlert: any | null;
  setRemoveSupplierAlert: (supplier: any | null) => void;
  confirmRemoveSupplier: () => void;
}

const SupplierDeleteDialog: React.FC<SupplierDeleteDialogProps> = ({
  removeSupplierAlert,
  setRemoveSupplierAlert,
  confirmRemoveSupplier,
}) => {
  return (
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
  );
};

export default SupplierDeleteDialog;
