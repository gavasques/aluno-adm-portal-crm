
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  isActive: boolean;
  onSuccess: () => void;
}

const UserStatusDialog: React.FC<UserStatusDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  isActive,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusChange = async () => {
    if (!userId) return;

    try {
      setIsProcessing(true);

      // Chamar a edge function para alterar o status do usuário
      const { data, error } = await supabase.functions.invoke('list-users', {
        method: 'POST',
        body: {
          action: 'toggleUserStatus',
          userId,
          email: userEmail,
          active: !isActive
        }
      });

      if (error) {
        console.error("Erro ao alterar status do usuário:", error);
        throw new Error(error.message || "Erro ao processar a alteração de status");
      }

      if (data.error) {
        console.error("Erro retornado pela função:", data.error);
        throw new Error(data.error);
      }

      // Mostrar mensagem de sucesso
      toast({
        title: isActive ? "Usuário inativado" : "Usuário ativado",
        description: `O status do usuário ${userEmail} foi alterado com sucesso.`,
      });

      onOpenChange(false);
      onSuccess(); // Atualizar a lista de usuários
    } catch (error) {
      console.error("Falha ao alterar status do usuário:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? "Inativar usuário" : "Ativar usuário"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive 
              ? `Tem certeza que deseja inativar o usuário ${userEmail}? Ele não poderá mais fazer login no sistema.`
              : `Tem certeza que deseja ativar o usuário ${userEmail}? Ele poderá fazer login novamente no sistema.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleStatusChange();
            }}
            disabled={isProcessing}
            className={isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processando...
              </>
            ) : (
              isActive ? "Inativar" : "Ativar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserStatusDialog;
