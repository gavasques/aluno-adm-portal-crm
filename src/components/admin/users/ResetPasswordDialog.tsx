
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeError, logSecureError } from "@/utils/security";
import { runSupabaseDiagnostics, logPasswordResetAttempt } from "@/utils/supabase-diagnostics";

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
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    if (open && userEmail) {
      runSupabaseDiagnostics(userEmail).then(setDiagnostics);
    }
  }, [open, userEmail]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canAttemptReset = (): boolean => {
    if (!lastAttempt) return true;
    const timeSinceLastAttempt = Date.now() - lastAttempt.getTime();
    return timeSinceLastAttempt > 60000; // 1 minuto entre tentativas
  };

  const handleReset = async () => {
    console.log("=== INICIANDO RESET DE SENHA ===");
    console.log("Email do usuário:", userEmail);
    console.log("Timestamp:", new Date().toISOString());

    if (!userEmail || !validateEmail(userEmail)) {
      console.error("Email inválido:", userEmail);
      toast({
        title: "Erro",
        description: "Email inválido fornecido.",
        variant: "destructive",
      });
      return;
    }

    if (!canAttemptReset()) {
      console.warn("Tentativa muito rápida após reset anterior");
      toast({
        title: "Aguarde",
        description: "Aguarde pelo menos 1 minuto entre tentativas de reset.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Iniciando processo de reset de senha...");

      // Executar diagnósticos
      const currentDiagnostics = await runSupabaseDiagnostics(userEmail);
      
      if (currentDiagnostics.errors.length > 0) {
        console.warn("Problemas detectados nos diagnósticos:", currentDiagnostics.errors);
      }

      const redirectUrl = `${window.location.origin}/reset-password?type=recovery`;
      
      console.log("URL de redirect configurada:", redirectUrl);
      console.log("Origem atual:", window.location.origin);

      console.log("Enviando email de reset de senha...");
      const { data, error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: redirectUrl,
      });

      console.log("Resposta do Supabase:", { data, error });

      if (error) {
        console.error("Erro do Supabase:", error);
        logPasswordResetAttempt(userEmail, false, error);
        throw error;
      }

      console.log("Email enviado com sucesso!");
      logPasswordResetAttempt(userEmail, true);
      setLastAttempt(new Date());

      toast({
        title: "Email enviado",
        description: `Um email de recuperação de senha foi enviado para ${userEmail}. Verifique também a pasta de spam.`,
      });

      onOpenChange(false);
      onSuccess();

    } catch (error: any) {
      console.error("=== ERRO NO RESET DE SENHA ===");
      console.error("Erro completo:", error);
      console.error("Message:", error.message);
      console.error("Code:", error.code);
      console.error("Status:", error.status);
      
      logSecureError(error, "Admin Password Reset");
      const sanitizedMessage = sanitizeError(error);
      
      let userMessage = sanitizedMessage;
      
      // Mensagens específicas baseadas no tipo de erro
      if (error.message?.includes('rate limit')) {
        userMessage = "Muitas tentativas de reset. Tente novamente em alguns minutos.";
      } else if (error.message?.includes('email not confirmed')) {
        userMessage = "O email do usuário não foi confirmado. Verifique o status da conta.";
      } else if (error.message?.includes('invalid_request')) {
        userMessage = "Configuração de email inválida. Verifique as configurações do Supabase.";
      }
      
      toast({
        title: "Erro ao enviar email",
        description: userMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      console.log("=== FIM DO PROCESSO DE RESET ===");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Redefinir senha</DialogTitle>
          <DialogDescription>
            Um email de redefinição de senha será enviado para o usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p>
            Deseja enviar um email de redefinição de senha para{" "}
            <span className="font-medium text-foreground">{userEmail}</span>?
          </p>
          
          {/* Status de diagnósticos */}
          {diagnostics && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {diagnostics.clientConfigured ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span>Cliente Supabase: {diagnostics.clientConfigured ? 'Configurado' : 'Erro'}</span>
              </div>
              
              {diagnostics.userExists !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  {diagnostics.userExists ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span>Usuário: {diagnostics.userExists ? 'Encontrado' : 'Não encontrado/sem permissão'}</span>
                </div>
              )}
              
              {diagnostics.errors.length > 0 && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                  <p className="font-medium text-red-800">Problemas detectados:</p>
                  <ul className="list-disc list-inside text-red-700">
                    {diagnostics.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {!canAttemptReset() && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Aguarde antes de tentar novamente</p>
                <p>Um reset foi enviado recentemente. Aguarde pelo menos 1 minuto entre tentativas.</p>
              </div>
            </div>
          )}
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
            disabled={isProcessing || !canAttemptReset()}
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
