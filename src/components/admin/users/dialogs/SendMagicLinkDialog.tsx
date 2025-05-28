
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
import { Loader2, Mail } from "lucide-react";

interface SendMagicLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onConfirmSend: () => Promise<boolean>;
}

export const SendMagicLinkDialog: React.FC<SendMagicLinkDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onConfirmSend
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    setIsProcessing(true);
    try {
      const success = await onConfirmSend();
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
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Enviar Magic Link
          </DialogTitle>
          <DialogDescription>
            Um link de acesso direto será enviado para o usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p>
            Deseja enviar um Magic Link para{" "}
            <span className="font-medium text-foreground">{userEmail}</span>?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            O usuário receberá um email com um link para fazer login automaticamente sem precisar digitar a senha.
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
            onClick={handleSend}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Magic Link
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
