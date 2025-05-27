
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
import { Loader2 } from "lucide-react";

interface UserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  currentStatus: string;
  onConfirmToggleStatus: () => Promise<boolean>;
}

export const UserStatusDialog: React.FC<UserStatusDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  currentStatus,
  onConfirmToggleStatus
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isActive = currentStatus === "Ativo";

  const handleToggleStatus = async () => {
    setIsProcessing(true);
    try {
      const success = await onConfirmToggleStatus();
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isActive ? 'Inativar' : 'Ativar'} usuário</DialogTitle>
          <DialogDescription>
            {isActive
              ? 'O usuário não poderá acessar o sistema enquanto estiver inativo.'
              : 'O usuário poderá acessar o sistema normalmente após ser ativado.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p>
            Deseja {isActive ? 'inativar' : 'ativar'} o usuário{" "}
            <span className="font-medium text-foreground">{userEmail}</span>?
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
              </>
            ) : (
              isActive ? 'Inativar' : 'Ativar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
