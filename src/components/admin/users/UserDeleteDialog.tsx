
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

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  onSuccess: () => void;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!userId) return;

    try {
      setIsDeleting(true);

      // Chamar a edge function para excluir ou inativar o usuário
      const { data, error } = await supabase.functions.invoke('list-users', {
        method: 'POST',
        body: {
          action: 'deleteUser',
          userId,
          email: userEmail
        }
      });

      if (error) {
        console.error("Erro ao excluir usuário:", error);
        throw new Error(error.message || "Erro ao processar a exclusão do usuário");
      }

      if (data.error) {
        console.error("Erro retornado pela função:", data.error);
        throw new Error(data.error);
      }

      // Mostrar mensagem de acordo com o resultado
      if (data.inactivated) {
        toast({
          title: "Usuário inativado",
          description: `O usuário não pôde ser excluído porque possui dados associados. Foi inativado no lugar.`,
        });
      } else {
        toast({
          title: "Usuário excluído",
          description: `O usuário ${userEmail} foi excluído com sucesso.`,
        });
      }

      onOpenChange(false);
      onSuccess(); // Atualizar a lista de usuários
    } catch (error) {
      console.error("Falha ao excluir usuário:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o usuário <strong>{userEmail}</strong>?
            <br /><br />
            Se o usuário tiver dados associados (alunos, fornecedores, arquivos), 
            ele será apenas inativado e não poderá mais fazer login.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processando...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserDeleteDialog;
