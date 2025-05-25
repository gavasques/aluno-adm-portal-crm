
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User } from 'lucide-react';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';

interface ExtensionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
  onSubmit: (data: CreateExtensionData) => void;
}

const ExtensionDialog: React.FC<ExtensionDialogProps> = ({
  open,
  onOpenChange,
  enrollment,
  onSubmit
}) => {
  const [extensionMonths, setExtensionMonths] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollment) return;

    setLoading(true);
    try {
      await onSubmit({
        enrollmentId: enrollment.id,
        extensionMonths,
        notes: notes.trim() || undefined
      });
      
      // Reset form
      setExtensionMonths(1);
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar extensão:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNewEndDate = () => {
    if (!enrollment) return '';
    
    const currentEndDate = new Date(enrollment.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + extensionMonths);
    
    return newEndDate.toLocaleDateString('pt-BR');
  };

  if (!enrollment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Adicionar Extensão de Tempo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Enrollment Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-600" />
              <span className="font-medium">{enrollment.mentoring.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Término atual: {new Date(enrollment.endDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Extension Months */}
          <div className="space-y-2">
            <Label htmlFor="extensionMonths">
              Meses de Extensão
            </Label>
            <Input
              id="extensionMonths"
              type="number"
              min="1"
              max="12"
              value={extensionMonths}
              onChange={(e) => setExtensionMonths(parseInt(e.target.value) || 1)}
              className="w-full"
            />
            <p className="text-sm text-gray-600">
              Novo término: <span className="font-medium text-green-600">{calculateNewEndDate()}</span>
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo da extensão, observações..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Aplicando...' : 'Aplicar Extensão'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionDialog;
