
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface CalendlyErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string;
  onRetry: () => void;
}

export const CalendlyErrorDialog: React.FC<CalendlyErrorDialogProps> = ({
  open,
  onOpenChange,
  error,
  onRetry
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Erro no Calendly
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onRetry} variant="outline">
              Tentar Novamente
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
