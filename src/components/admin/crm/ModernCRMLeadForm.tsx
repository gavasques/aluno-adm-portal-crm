
import React from 'react';
import UnifiedCRMLeadForm from './UnifiedCRMLeadForm';
import { CRMLead } from '@/types/crm.types';

interface ModernCRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const ModernCRMLeadForm = (props: ModernCRMLeadFormProps) => {
  console.log('🔄 ModernCRMLeadForm: Redirecionando para UnifiedCRMLeadForm');
  return <UnifiedCRMLeadForm {...props} />;
};

export default ModernCRMLeadForm;
