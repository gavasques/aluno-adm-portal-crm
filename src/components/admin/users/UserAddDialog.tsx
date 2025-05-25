
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserForm from "./UserForm";

interface UserAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UserAddDialog: React.FC<UserAddDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const handleSuccess = () => {
    // O UserForm já gerencia o delay e feedback visual
    // Aqui apenas fechamos o diálogo e atualizamos a lista
    onOpenChange(false);
    
    // Atualizar a lista após um pequeno delay para garantir
    // que o diálogo seja fechado primeiro
    setTimeout(() => {
      onSuccess();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo usuário ao sistema. 
            Você receberá uma confirmação quando a operação for concluída.
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserAddDialog;
