
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormSection } from '../form-components/FormSection';
import { SwitchField } from '../form-components/SwitchField';
import { LeadFormData } from '@/utils/crm-validation-schemas';

interface LeadQualificationSectionProps {
  form: UseFormReturn<LeadFormData>;
}

export const LeadQualificationSection: React.FC<LeadQualificationSectionProps> = ({ form }) => {
  const { watch, setValue } = form;

  return (
    <FormSection title="Qualificação" icon={<CheckCircle className="h-4 w-4" />}>
      <div className="grid grid-cols-2 gap-3">
        <SwitchField
          id="ready_to_invest_3k"
          label="Investe R$ 3k"
          checked={watch('ready_to_invest_3k')}
          onCheckedChange={(checked) => setValue('ready_to_invest_3k', checked)}
        />
        <SwitchField
          id="calendly_scheduled"
          label="Calendly agendado"
          checked={watch('calendly_scheduled')}
          onCheckedChange={(checked) => setValue('calendly_scheduled', checked)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="main_doubts" className="text-xs font-medium">Principais dúvidas</Label>
        <Textarea
          id="main_doubts"
          {...form.register('main_doubts')}
          className="h-16 text-sm resize-none"
          placeholder="Dúvidas e objeções do lead"
        />
      </div>
    </FormSection>
  );
};
