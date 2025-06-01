
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSection } from '../form-components/FormSection';
import { LeadFormData } from '@/utils/crm-validation-schemas';

interface LeadBasicInfoSectionProps {
  form: UseFormReturn<LeadFormData>;
}

export const LeadBasicInfoSection: React.FC<LeadBasicInfoSectionProps> = ({ form }) => {
  return (
    <FormSection title="Informações Básicas" icon={<User className="h-4 w-4" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs font-medium">Nome *</Label>
          <Input
            id="name"
            {...form.register('name')}
            className="h-8 text-sm"
            placeholder="Nome completo"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-medium">Email *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            className="h-8 text-sm"
            placeholder="email@exemplo.com"
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-xs font-medium">Telefone</Label>
          <Input
            id="phone"
            {...form.register('phone')}
            className="h-8 text-sm"
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>
    </FormSection>
  );
};
