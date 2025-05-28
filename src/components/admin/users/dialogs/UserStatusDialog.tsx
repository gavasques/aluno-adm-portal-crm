
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
import { Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const isActive = currentStatus === "Ativo" || currentStatus === "ativo";

  useEffect(() => {
    if (!open) {
      // Reset states when dialog closes
      setIsProcessing(false);
      setIsSuccess(false);
      setIsVerifying(false);
    }
  }, [open]);

  const handleToggleStatus = async () => {
    setIsProcessing(true);
    setIsSuccess(false);
    setIsVerifying(false);
    
    try {
      console.log('🔄 Iniciando alteração de status para:', userEmail);
      
      const success = await onConfirmToggleStatus();
      
      if (success) {
        console.log('✅ Status alterado com sucesso para:', userEmail);
        setIsSuccess(true);
        setIsVerifying(true);
        
        toast({
          title: "Sucesso",
          description: `Usuário ${isActive ? 'inativado' : 'ativado'} com sucesso. Atualizando interface...`,
        });
        
        // Show verification phase
        setTimeout(() => {
          setIsVerifying(false);
          toast({
            title: "Atualizado",
            description: "A interface foi atualizada com as alterações.",
            variant: "default",
          });
          
          // Close dialog after verification
          setTimeout(() => {
            onOpenChange(false);
            setIsSuccess(false);
          }, 1000);
        }, 2500);
      } else {
        console.error('❌ Falha ao alterar status para:', userEmail);
        toast({
          title: "Erro",
          description: "Não foi possível alterar o status do usuário.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erro na alteração de status:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao alterar status do usuário.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getNewStatusDisplay = () => {
    return isActive ? 'Inativo' : 'Ativo';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isActive ? 'Inativar' : 'Ativar'} usuário
            {isVerifying && (
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? 'O usuário não poderá acessar o sistema enquanto estiver inativo.'
              : 'O usuário poderá acessar o sistema normalmente após ser ativado.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-3 rounded-md bg-gray-50">
            <p className="text-sm">
              <span className="font-medium">Usuário:</span> {userEmail}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Status atual:</span> 
              <span className="ml-1">{currentStatus}</span>
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Novo status:</span> 
              <span className="ml-1 font-medium text-blue-600">{getNewStatusDisplay()}</span>
            </p>
          </div>
          
          {isSuccess && !isVerifying && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Status alterado com sucesso!
              </span>
            </div>
          )}

          {isVerifying && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-700">
                Atualizando interface com os novos dados...
              </span>
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
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
            disabled={isProcessing || isSuccess}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                {isActive ? 'Inativando...' : 'Ativando...'}
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {isVerifying ? 'Atualizando...' : 'Concluído'}
              </>
            ) : (
              isActive ? 'Inativar Usuário' : 'Ativar Usuário'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
