
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStorage } from "@/hooks/admin/useAdminStorage";
import { toast } from "sonner";

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
      toast.error("O valor do upgrade deve ser maior que 0");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await addStorageUpgrade(userId, upgradeMB, notes);
      
      if (success) {
        onOpenChange(false);
        setNotes("");
        setUpgradeMB(100);
      }
    } catch (error) {
      console.error("Erro ao adicionar armazenamento:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex gap-2">
              <Input
                id="upgradeMB"
                type="number"
                value={upgradeMB}
                onChange={(e) => setUpgradeMB(Number(e.target.value))}
                min="1"
                step="100"
                required
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => setUpgradeMB(100)}
              >
                100MB
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setUpgradeMB(500)}
              >
                500MB
              </Button>
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
