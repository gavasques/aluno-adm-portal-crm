
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormSection } from '../form-components/FormSection';
import { LeadFormData } from '@/utils/crm-validation-schemas';

interface LeadNotesSectionProps {
  form: UseFormReturn<LeadFormData>;
}

export const LeadNotesSection: React.FC<LeadNotesSectionProps> = ({ form }) => {
  return (
    <FormSection title="Observações" icon={<FileText className="h-4 w-4" />}>
      <div className="space-y-1">
        <Label htmlFor="notes" className="text-xs font-medium">Observações gerais</Label>
        <Textarea
          id="notes"
          {...form.register('notes')}
          className="h-16 text-sm resize-none"
          placeholder="Observações adicionais sobre o lead"
        />
      </div>
    </FormSection>
  );
};
