
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

export interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onSuccess: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReset = async () => {
    if (!userEmail) return;

    try {
      setIsProcessing(true);

      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email enviado",
        description: `Um email de recuperação de senha foi enviado para ${userEmail}.`,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de redefinição de senha.",
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
          <DialogTitle>Redefinir senha</DialogTitle>
          <DialogDescription>
            Um email de redefinição de senha será enviado para o usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p>
            Deseja enviar um email de redefinição de senha para{" "}
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
            onClick={handleReset}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              "Enviar email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
