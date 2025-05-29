
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
import { Loader2, AlertTriangle, Info } from "lucide-react";

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onConfirmDelete: () => Promise<boolean>;
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'processing' | 'verifying'>('idle');

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteStatus('processing');
    
    try {
      console.log('🗑️ [DELETE_DIALOG] Iniciando processo de exclusão para:', userEmail);
      
      // Simular as etapas do processo
      setTimeout(() => setDeleteStatus('verifying'), 2000);
      
      const success = await onConfirmDelete();
      
      if (success) {
        console.log('✅ [DELETE_DIALOG] Exclusão bem-sucedida para:', userEmail);
        onOpenChange(false);
      } else {
        console.error('❌ [DELETE_DIALOG] Falha na exclusão para:', userEmail);
      }
    } catch (error) {
      console.error('💥 [DELETE_DIALOG] Erro durante exclusão:', error);
    } finally {
      setIsDeleting(false);
      setDeleteStatus('idle');
    }
  };

  const getStatusMessage = () => {
    switch (deleteStatus) {
      case 'processing':
        return "Processando exclusão...";
      case 'verifying':
        return "Verificando exclusão no banco de dados...";
      default:
        return "Processando...";
    }
  };

  const getStatusIcon = () => {
    switch (deleteStatus) {
      case 'processing':
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
      case 'verifying':
        return <Info className="mr-2 h-4 w-4 animate-pulse text-blue-600" />;
      default:
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Tem certeza que deseja excluir o usuário <strong>{userEmail}</strong>?
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">O que acontecerá:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Se o usuário tiver dados associados (fornecedores, arquivos, etc.), ele será <strong>inativado</strong></li>
                    <li>Se não tiver dados associados, será <strong>completamente excluído</strong> do sistema</li>
                    <li>O processo inclui verificação completa no banco de dados</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {isDeleting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="text-sm text-blue-800 font-medium">
                    {getStatusMessage()}
                  </span>
                </div>
              </div>
            )}
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
                {getStatusIcon()}
                {getStatusMessage()}
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
