
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CRMLeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineId: string;
}

const CRMLeadFormDialog = ({ open, onOpenChange, pipelineId }: CRMLeadFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Pipeline: {pipelineId}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Formulário de lead em desenvolvimento...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMLeadFormDialog;
