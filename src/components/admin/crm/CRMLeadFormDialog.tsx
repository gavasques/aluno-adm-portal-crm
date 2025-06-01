
import React from 'react';
import ModernCRMLeadFormDialog from './ModernCRMLeadFormDialog';

interface CRMLeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string;
  pipelineId?: string;
  initialColumnId?: string;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

const CRMLeadFormDialog = (props: CRMLeadFormDialogProps) => {
  return <ModernCRMLeadFormDialog {...props} />;
};

export default CRMLeadFormDialog;
