
import React from 'react';
import { CRMLead } from '@/types/crm.types';
import UnifiedCRMLeadForm from './UnifiedCRMLeadForm';

interface ModernCRMLeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

const ModernCRMLeadFormDialog = ({ 
  open, 
  onOpenChange, 
  pipelineId, 
  initialColumnId, 
  lead, 
  mode, 
  onSuccess 
}: ModernCRMLeadFormDialogProps) => {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <UnifiedCRMLeadForm
      pipelineId={pipelineId}
      initialColumnId={initialColumnId}
      lead={lead}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      mode={mode}
      isOpen={open}
    />
  );
};

export default ModernCRMLeadFormDialog;
