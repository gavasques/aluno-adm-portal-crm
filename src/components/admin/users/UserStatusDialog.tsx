
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
  currentStatus: string; // Changed from isActive: boolean to match UsersDialogs.tsx
  onSuccess: () => void;
}

const UserStatusDialog: React.FC<UserStatusDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  currentStatus, // Changed from isActive
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isActive = currentStatus === "Ativo"; // Convert string status to boolean

  const handleStatusChange = async () => {
    if (!userId) return;

    try {
      setIsProcessing(true);
      console.log(`Iniciando alteração de status para usuário ${userId}, isActive=${isActive}`);

      // Chamar a edge function para alterar o status do usuário
      const { data, error } = await supabase.functions.invoke('list-users', {
        method: 'POST',
        body: {
          action: 'toggleUserStatus',
          userId,
          active: !isActive // Importante: enviamos o NOVO estado desejado
        }
      });

      if (error) {
        console.error("Erro ao chamar a função list-users:", error);
        throw error;
      }

      console.log("Resposta recebida da Edge Function:", data);

      if (data.error) {
        console.error("Erro retornado pela função:", data.error);
        throw new Error(data.error);
      }

      // Verificar explicitamente a resposta da função
      if (!data.success) {
        console.error("Resposta da função indica falha:", data);
        throw new Error("A operação não foi concluída com sucesso");
      }

      // Mostrar mensagem de sucesso
      toast({
        title: isActive ? "Usuário inativado" : "Usuário ativado",
        description: `O status do usuário ${userEmail} foi ${isActive ? "inativado" : "ativado"} com sucesso.`,
      });

      // Fechar o diálogo e atualizar a lista
      onOpenChange(false);
      
      // Importante: garantir que a lista seja atualizada
      setTimeout(() => {
        onSuccess(); // Atualizar a lista de usuários após um breve delay
      }, 300);
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
