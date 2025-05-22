
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
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Mail } from "lucide-react";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ 
  open, 
  onOpenChange, 
  userEmail 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `https://titan.guilhermevasques.club/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Link de redefinição de senha enviado",
        description: `Um email foi enviado para ${userEmail} com instruções para redefinição de senha.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao enviar email de redefinição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de redefinição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" /> 
            Enviar Email de Redefinição de Senha
          </DialogTitle>
          <DialogDescription>
            Um email de redefinição de senha será enviado para o usuário.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 border-y">
          <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="text-amber-600 h-5 w-5" />
            <p className="text-sm text-amber-800">
              Tem certeza que deseja enviar um email de redefinição de senha para <strong>{userEmail}</strong>?
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleResetPassword} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
