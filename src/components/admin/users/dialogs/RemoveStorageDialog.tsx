
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, HardDrive } from "lucide-react";

interface RemoveStorageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentLimit: number;
  onConfirm: (userId: string, removeMB: number, notes?: string) => Promise<boolean>;
}

export const RemoveStorageDialog: React.FC<RemoveStorageDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentLimit,
  onConfirm
}) => {
  const [removeMB, setRemoveMB] = useState(100);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newLimit = Math.max(0, currentLimit - removeMB);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (removeMB <= 0 || removeMB > currentLimit) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onConfirm(userId, removeMB, notes);
      if (success) {
        onOpenChange(false);
        setNotes("");
        setRemoveMB(100);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMB = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${mb}MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Minus className="h-5 w-5 text-red-600" />
            Remover Armazenamento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Usuário</Label>
            <Input value={userName} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="removeMB">Quantidade a Remover (MB)</Label>
            <Input
              id="removeMB"
              type="number"
              value={removeMB}
              onChange={(e) => setRemoveMB(Number(e.target.value))}
              min="1"
              max={currentLimit}
              step="1"
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Limite atual: {formatMB(currentLimit)} | Máximo a remover: {formatMB(currentLimit)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Motivo da Remoção</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o motivo da remoção de armazenamento"
              rows={3}
              required
            />
          </div>

          <div className="bg-red-50 border border-red-200 p-3 rounded-md">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <HardDrive className="h-4 w-4" />
              <span className="font-medium">Resumo da Operação:</span>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              <p>• Limite atual: {formatMB(currentLimit)}</p>
              <p>• Será removido: {formatMB(removeMB)}</p>
              <p>• Novo limite: {formatMB(newLimit)}</p>
            </div>
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
            <Button 
              type="submit" 
              variant="destructive"
              disabled={isSubmitting || removeMB <= 0 || removeMB > currentLimit}
            >
              {isSubmitting ? "Removendo..." : `Remover ${formatMB(removeMB)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
