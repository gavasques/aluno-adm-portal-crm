
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CRMLead } from '@/types/crm.types';
import CompactCRMLeadForm from './CompactCRMLeadForm';

interface CRMLeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

const CRMLeadFormDialog = ({ 
  open, 
  onOpenChange, 
  pipelineId, 
  initialColumnId, 
  lead, 
  mode, 
  onSuccess 
}: CRMLeadFormDialogProps) => {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {mode === 'create' ? 'Novo Lead' : 'Editar Lead'}
          </DialogTitle>
        </DialogHeader>
        
        <CompactCRMLeadForm
          pipelineId={pipelineId}
          initialColumnId={initialColumnId}
          lead={lead}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CRMLeadFormDialog;
