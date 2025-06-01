
import React from 'react';
import CompactCRMLeadForm from './CompactCRMLeadForm';
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
  console.log('🔄 ModernCRMLeadForm: Redirecionando para CompactCRMLeadForm');
  return <CompactCRMLeadForm {...props} />;
};

export default ModernCRMLeadForm;
