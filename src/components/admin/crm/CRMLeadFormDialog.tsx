
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import CRMLeadForm from './CRMLeadForm';
import { CRMLead } from '@/types/crm.types';

interface CRMLeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess?: () => void;
}

const CRMLeadFormDialog = ({ 
  open, 
  onOpenChange, 
  pipelineId, 
  initialColumnId, 
  lead,
  onSuccess 
}: CRMLeadFormDialogProps) => {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <CRMLeadForm 
          pipelineId={pipelineId}
          initialColumnId={initialColumnId}
          lead={lead}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CRMLeadFormDialog;
