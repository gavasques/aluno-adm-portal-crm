
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSection } from '../form-components/FormSection';
import { SwitchField } from '../form-components/SwitchField';
import { LeadFormData } from '@/utils/crm-validation-schemas';

interface LeadAmazonSectionProps {
  form: UseFormReturn<LeadFormData>;
}

export const LeadAmazonSection: React.FC<LeadAmazonSectionProps> = ({ form }) => {
  const { watch, setValue } = form;

  return (
    <FormSection title="Amazon" icon={<Package className="h-4 w-4" />}>
      <div className="grid grid-cols-2 gap-3">
        <SwitchField
          id="sells_on_amazon"
          label="Vende na Amazon"
          checked={watch('sells_on_amazon')}
          onCheckedChange={(checked) => setValue('sells_on_amazon', checked)}
        />
        <SwitchField
          id="works_with_fba"
          label="Trabalha com FBA"
          checked={watch('works_with_fba')}
          onCheckedChange={(checked) => setValue('works_with_fba', checked)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="amazon_store_link" className="text-xs font-medium">Link da loja</Label>
        <Input
          id="amazon_store_link"
          {...form.register('amazon_store_link')}
          className="h-8 text-sm"
          placeholder="https://amazon.com.br/..."
        />
      </div>
    </FormSection>
  );
};
