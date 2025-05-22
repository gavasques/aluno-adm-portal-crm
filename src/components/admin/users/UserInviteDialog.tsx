
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserInviteForm from "./UserInviteForm";

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UserInviteDialog: React.FC<UserInviteDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para enviar um convite ao novo usuário. Um email de convite será enviado automaticamente.
          </DialogDescription>
        </DialogHeader>
        <UserInviteForm 
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserInviteDialog;
