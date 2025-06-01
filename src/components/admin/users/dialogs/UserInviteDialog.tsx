
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserInviteForm from "../UserInviteForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const UserInviteDialog: React.FC<UserInviteDialogProps> = ({ 
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
        
        <Alert variant="default" className="mt-4 border-orange-300 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Nota importante</AlertTitle>
          <AlertDescription className="text-orange-700">
            Se você encontrar problemas ao enviar convites, o sistema tentará cadastrar o usuário diretamente. 
            Nesse caso, o usuário terá que usar a funcionalidade "Esqueci minha senha" para definir uma senha.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};
