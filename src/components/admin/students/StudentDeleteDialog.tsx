
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface StudentDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: any;
  onConfirmDelete: () => Promise<boolean>;
}

const StudentDeleteDialog: React.FC<StudentDeleteDialogProps> = ({
  open,
  onOpenChange,
  student,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await onConfirmDelete();
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <Trash2 className="mr-2 h-5 w-5" /> 
            Excluir Aluno
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Tem certeza que deseja excluir este aluno?
          </DialogDescription>
        </DialogHeader>
        
        {student && (
          <div className="py-4 border-y">
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
        )}
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Excluindo..." : "Sim, excluir aluno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDeleteDialog;
