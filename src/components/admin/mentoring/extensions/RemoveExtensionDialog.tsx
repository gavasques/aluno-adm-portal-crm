
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Trash2 } from 'lucide-react';
import { StudentMentoringEnrollment, MentoringExtension } from '@/types/mentoring.types';

interface RemoveExtensionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
  extension: MentoringExtension | null;
  onConfirmRemove: (extensionId: string) => void;
  isLoading?: boolean;
}

export const RemoveExtensionDialog = ({
  open,
  onOpenChange,
  enrollment,
  extension,
  onConfirmRemove,
  isLoading = false
}: RemoveExtensionDialogProps) => {
  if (!enrollment || !extension) return null;

  const handleConfirm = () => {
    onConfirmRemove(extension.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Remover Extensão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">Atenção!</h4>
                <p className="text-sm text-red-700">
                  Esta ação removerá a extensão e ajustará automaticamente o total de sessões da inscrição.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Extensão a ser removida:</p>
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">+{extension.extensionMonths} {extension.extensionMonths === 1 ? 'mês' : 'meses'}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {new Date(extension.appliedDate).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
            {extension.notes && (
              <p className="text-xs text-gray-600 mt-2">{extension.notes}</p>
            )}
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>Impacto:</strong> As sessões adicionais desta extensão serão removidas do total de sessões disponíveis.
            </p>
          </div>
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
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Removendo...' : 'Remover Extensão'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
