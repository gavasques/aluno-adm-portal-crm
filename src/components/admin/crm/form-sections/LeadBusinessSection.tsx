
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSection } from '../form-components/FormSection';
import { SwitchField } from '../form-components/SwitchField';
import { LeadFormData } from '@/utils/crm-validation-schemas';

interface LeadBusinessSectionProps {
  form: UseFormReturn<LeadFormData>;
}

export const LeadBusinessSection: React.FC<LeadBusinessSectionProps> = ({ form }) => {
  const { watch, setValue } = form;

  return (
    <FormSection title="Negócio" icon={<Building className="h-4 w-4" />}>
      <SwitchField
        id="has_company"
        label="Possui empresa"
        checked={watch('has_company')}
        onCheckedChange={(checked) => setValue('has_company', checked)}
      />
      <div className="space-y-1">
        <Label htmlFor="what_sells" className="text-xs font-medium">O que vende?</Label>
        <Input
          id="what_sells"
          {...form.register('what_sells')}
          className="h-8 text-sm"
          placeholder="Produtos/serviços"
        />
      </div>
    </FormSection>
  );
};
