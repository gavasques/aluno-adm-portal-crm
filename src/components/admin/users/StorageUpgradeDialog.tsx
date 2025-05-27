
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStorage } from "@/hooks/admin/useAdminStorage";
import { toast } from "@/hooks/use-toast";

interface StorageUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

const StorageUpgradeDialog: React.FC<StorageUpgradeDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userName
}) => {
  const { addStorageUpgrade } = useAdminStorage();
  const [upgradeMB, setUpgradeMB] = useState(100);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (upgradeMB <= 0) {
      toast({
        title: "Erro",
        description: "O valor do upgrade deve ser maior que 0",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🔄 Adicionando armazenamento:', upgradeMB, 'MB para usuário:', userName);
      const success = await addStorageUpgrade(userId, upgradeMB, notes);
      
      if (success) {
        console.log('✅ Armazenamento adicionado com sucesso');
        toast({
          title: "Sucesso",
          description: `${upgradeMB}MB adicionados ao armazenamento de ${userName}`,
        });
        onOpenChange(false);
        setNotes("");
        setUpgradeMB(100);
        
        // Força atualização da página após 1 segundo
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('❌ Falha ao adicionar armazenamento');
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o armazenamento",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Erro ao adicionar armazenamento:", error);
      toast({
        title: "Erro",
        description: "Erro interno ao adicionar armazenamento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSelect = (amount: number) => {
    setUpgradeMB(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Armazenamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Usuário</Label>
            <Input value={userName} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upgradeMB">Quantidade (MB)</Label>
            <div className="space-y-2">
              <Input
                id="upgradeMB"
                type="number"
                value={upgradeMB}
                onChange={(e) => setUpgradeMB(Number(e.target.value))}
                min="1"
                step="1"
                required
                className="w-full"
              />
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(100)}
                  className={upgradeMB === 100 ? "bg-blue-50 border-blue-300" : ""}
                >
                  100MB
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(250)}
                  className={upgradeMB === 250 ? "bg-blue-50 border-blue-300" : ""}
                >
                  250MB
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(500)}
                  className={upgradeMB === 500 ? "bg-blue-50 border-blue-300" : ""}
                >
                  500MB
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(1024)}
                  className={upgradeMB === 1024 ? "bg-blue-50 border-blue-300" : ""}
                >
                  1GB
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo do upgrade, solicitação especial, etc."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Resumo:</strong> Será adicionado {upgradeMB}MB ao armazenamento de {userName}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adicionando..." : `Adicionar +${upgradeMB}MB`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StorageUpgradeDialog;
