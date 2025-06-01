
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCRMLeadDetail } from '@/hooks/crm/useCRMLeadDetail';
import CompactCRMLeadForm from './CompactCRMLeadForm';
import { Loader2 } from 'lucide-react';

interface CRMLeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string;
  pipelineId?: string;
  initialColumnId?: string;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

const CRMLeadFormDialog = ({ 
  open, 
  onOpenChange, 
  leadId, 
  pipelineId,
  initialColumnId,
  mode, 
  onSuccess 
}: CRMLeadFormDialogProps) => {
  const { lead, loading } = useCRMLeadDetail(leadId || '');

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  if (mode === 'edit' && loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-[90vw] h-[90vh] max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Carregando dados do lead...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-white flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Novo Lead' : `Editar Lead - ${lead?.name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <CompactCRMLeadForm
            pipelineId={pipelineId || lead?.pipeline_id || ''}
            initialColumnId={initialColumnId || lead?.column_id}
            lead={mode === 'edit' ? lead : undefined}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMLeadFormDialog;
