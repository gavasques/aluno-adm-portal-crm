
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "../forms/UserForm";
import { CreateUserData } from "@/types/user.types";

interface UserAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (userData: CreateUserData) => Promise<boolean>;
}

export const UserAddDialog: React.FC<UserAddDialogProps> = ({ 
  open, 
  onOpenChange, 
  onCreateUser 
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
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
          onCreateUser={onCreateUser}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
