
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SupplierForm } from "./SupplierForm";
import { SupplierFormValues } from "@/types/my-suppliers.types";

interface MySupplierFormProps {
  showForm: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SupplierFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const MySupplierFormDialog: React.FC<MySupplierFormProps> = ({
  showForm,
  onOpenChange,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  return (
    <Dialog open={showForm} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Fornecedor</DialogTitle>
        </DialogHeader>
        <SupplierForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
