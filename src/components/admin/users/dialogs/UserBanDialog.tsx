
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, Loader2, AlertTriangle } from "lucide-react";

interface UserBanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onConfirmBan: () => Promise<boolean>;
}

export const UserBanDialog: React.FC<UserBanDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onConfirmBan,
}) => {
  const [isBanning, setIsBanning] = useState(false);

  const handleConfirm = async () => {
    setIsBanning(true);
    
    try {
      const success = await onConfirmBan();
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsBanning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-full">
              <Ban className="h-5 w-5 text-orange-600" />
            </div>
            <DialogTitle>Banir Usuário</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Tem certeza de que deseja banir o usuário <strong>{userEmail}</strong>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Atenção:</span>
          </div>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• O usuário será movido para o grupo "Banido"</li>
            <li>• Todas as permissões atuais serão removidas</li>
            <li>• O usuário não poderá acessar o sistema</li>
            <li>• Será exibida uma mensagem de acesso negado</li>
          </ul>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isBanning}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isBanning}
          >
            {isBanning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Ban className="mr-2 h-4 w-4" />
            Banir Usuário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
