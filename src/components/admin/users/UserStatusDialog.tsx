
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userId: string;
  currentStatus: string;
  onSuccess: () => void;
}

const UserStatusDialog: React.FC<UserStatusDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  userId,
  currentStatus,
  onSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isActive = currentStatus === "Ativo";

  const handleToggleStatus = async () => {
    try {
      setIsProcessing(true);

      const newStatus = isActive ? "Inativo" : "Ativo";

      // Agora utilizamos o campo status diretamente
      const { error } = await supabase
        .from("profiles")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() // Atualizar o timestamp também
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: `Usuário ${newStatus === "Ativo" ? 'ativado' : 'inativado'}`,
        description: `O usuário ${userEmail} foi ${newStatus === "Ativo" ? 'ativado' : 'inativado'} com sucesso.`,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
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

export default UserStatusDialog;
