
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ValidatedUserForm } from "../forms/ValidatedUserForm";
import { ValidatedInviteForm } from "../forms/ValidatedInviteForm";
import { useValidatedUserOperations } from "@/hooks/users/useValidatedUserOperations";

interface ValidatedUserDialogsProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  showInviteDialog: boolean;
  setShowInviteDialog: (show: boolean) => void;
  onRefresh?: () => void;
}

export const ValidatedUserDialogs: React.FC<ValidatedUserDialogsProps> = ({
  showAddDialog,
  setShowAddDialog,
  showInviteDialog,
  setShowInviteDialog,
  onRefresh,
}) => {
  const {
    createUserForm,
    inviteUserForm,
    handleCreateUser,
    handleInviteUser,
    isSubmitting,
  } = useValidatedUserOperations();

  const handleCreateSuccess = async (data: any) => {
    const success = await handleCreateUser(data);
    if (success) {
      setShowAddDialog(false);
      onRefresh?.();
    }
    return success;
  };

  const handleInviteSuccess = async (data: any) => {
    const success = await handleInviteUser(data);
    if (success) {
      setShowInviteDialog(false);
      onRefresh?.();
    }
    return success;
  };

  return (
    <>
      {/* Dialog de Adicionar Usuário */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar um novo usuário ao sistema. 
              Todos os campos são validados em tempo real.
            </DialogDescription>
          </DialogHeader>
          <ValidatedUserForm 
            form={createUserForm}
            onSubmit={handleCreateSuccess}
            onCancel={() => setShowAddDialog(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Convidar Usuário */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
            <DialogDescription>
              Envie um convite por email para um novo usuário. 
              Um email de redefinição de senha será enviado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <ValidatedInviteForm 
            form={inviteUserForm}
            onSubmit={handleInviteSuccess}
            onCancel={() => setShowInviteDialog(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
