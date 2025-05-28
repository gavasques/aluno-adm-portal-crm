
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, HardDrive } from "lucide-react";

interface AdjustStorageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentLimit: number;
  onConfirm: (userId: string, newLimit: number, notes?: string) => Promise<boolean>;
}

export const AdjustStorageDialog: React.FC<AdjustStorageDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentLimit,
  onConfirm
}) => {
  const [newLimit, setNewLimit] = useState(currentLimit);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const difference = newLimit - currentLimit;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newLimit <= 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onConfirm(userId, newLimit, notes);
      if (success) {
        onOpenChange(false);
        setNotes("");
        setNewLimit(currentLimit);
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

  const getQuickOptions = () => {
    return [100, 250, 500, 1024, 2048, 5120]; // 100MB, 250MB, 500MB, 1GB, 2GB, 5GB
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Ajustar Armazenamento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Usuário</Label>
            <Input value={userName} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newLimit">Novo Limite Total (MB)</Label>
            <Input
              id="newLimit"
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(Number(e.target.value))}
              min="1"
              step="1"
              required
              className="w-full"
            />
            <div className="grid grid-cols-3 gap-2">
              {getQuickOptions().map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewLimit(option)}
                  className={newLimit === option ? "bg-blue-50 border-blue-300" : ""}
                >
                  {formatMB(option)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo do ajuste (opcional)"
              rows={3}
            />
          </div>

          <div className={`border p-3 rounded-md ${
            isIncrease ? "bg-green-50 border-green-200" : 
            isDecrease ? "bg-orange-50 border-orange-200" : 
            "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4" />
              <span className="font-medium">Resumo da Operação:</span>
            </div>
            <div className="text-sm space-y-1">
              <p>• Limite atual: {formatMB(currentLimit)}</p>
              <p>• Novo limite: {formatMB(newLimit)}</p>
              {difference !== 0 && (
                <p className={`font-medium ${
                  isIncrease ? "text-green-700" : "text-orange-700"
                }`}>
                  • {isIncrease ? "Aumento" : "Redução"}: {formatMB(Math.abs(difference))}
                </p>
              )}
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
              disabled={isSubmitting || newLimit <= 0}
            >
              {isSubmitting ? "Ajustando..." : "Ajustar Armazenamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
