
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
import { Loader2, CheckCircle } from "lucide-react";
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
  const isActive = currentStatus === "Ativo" || currentStatus === "ativo";

  const handleToggleStatus = async () => {
    setIsProcessing(true);
    setIsSuccess(false);
    
    try {
      console.log('🔄 Iniciando alteração de status para:', userEmail);
      const success = await onConfirmToggleStatus();
      
      if (success) {
        console.log('✅ Status alterado com sucesso para:', userEmail);
        setIsSuccess(true);
        
        toast({
          title: "Sucesso",
          description: `Usuário ${isActive ? 'inativado' : 'ativado'} com sucesso. Atualizando lista...`,
        });
        
        // Delay para mostrar o feedback visual antes de fechar
        setTimeout(() => {
          onOpenChange(false);
          setIsSuccess(false);
        }, 1500);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isActive ? 'Inativar' : 'Ativar'} usuário
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? 'O usuário não poderá acessar o sistema enquanto estiver inativo.'
              : 'O usuário poderá acessar o sistema normalmente após ser ativado.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Usuário:</span> {userEmail}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Status atual:</span> {currentStatus}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Novo status:</span> {isActive ? 'Inativo' : 'Ativo'}
            </p>
          </div>
          
          {isSuccess && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Status alterado com sucesso! Atualizando interface...
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
                Concluído
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
