
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
    // Fechar o diálogo e atualizar a lista
    onOpenChange(false);
    
    // Forçar um timeout para garantir que o backend tenha tempo
    // de processar o novo usuário antes de atualizar a lista
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo usuário ao sistema. 
            Se o usuário já existir, você será notificado.
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
