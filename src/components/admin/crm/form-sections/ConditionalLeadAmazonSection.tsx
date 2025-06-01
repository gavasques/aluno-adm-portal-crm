
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadAmazonSection } from './LeadAmazonSection';
import { useCRMFieldVisibility } from '@/hooks/crm/useCRMFieldVisibility';
import { LeadFormData } from '@/utils/crm-validation-schemas';

interface ConditionalLeadAmazonSectionProps {
  form: UseFormReturn<LeadFormData>;
}

export const ConditionalLeadAmazonSection: React.FC<ConditionalLeadAmazonSectionProps> = ({ form }) => {
  const { config, loading } = useCRMFieldVisibility();

  if (loading || !config.amazon_section) {
    return null;
  }

  return <LeadAmazonSection form={form} />;
};
