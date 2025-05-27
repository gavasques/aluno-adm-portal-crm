
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';
import { Plus, Clock } from 'lucide-react';

interface AddCustomMonthsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
  onSubmit: (data: CreateExtensionData) => void;
  isLoading?: boolean;
}

export const AddCustomMonthsDialog = ({
  open,
  onOpenChange,
  enrollment,
  onSubmit,
  isLoading = false
}: AddCustomMonthsDialogProps) => {
  const [months, setMonths] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enrollment) return;

    const extensionData: CreateExtensionData = {
      enrollmentId: enrollment.id,
      extensionMonths: months,
      notes: notes.trim() || `Adicionados ${months} mês(es) avulso(s)`
    };

    onSubmit(extensionData);
    
    // Reset form
    setMonths(1);
    setNotes('');
    onOpenChange(false);
  };

  if (!enrollment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Adicionar Meses Avulsos
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700">Inscrição:</p>
            <p className="text-sm text-gray-600">{enrollment.mentoring.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="months">Quantidade de Meses *</Label>
            <Input
              id="months"
              type="number"
              min="1"
              max="12"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
              className="bg-white"
              required
            />
            <p className="text-xs text-gray-500">
              Cada mês adiciona aproximadamente 4 sessões extras
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo ou observações sobre a adição de meses..."
              className="bg-white resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Adicionando...' : `Adicionar ${months} Mês(es)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
