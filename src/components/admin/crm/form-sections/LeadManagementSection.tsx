
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection } from '../form-components/FormSection';
import OptimizedTagsSelector from '../form-components/OptimizedTagsSelector';
import { LeadFormData } from '@/utils/crm-validation-schemas';

interface LeadManagementSectionProps {
  form: UseFormReturn<LeadFormData>;
  pipelineColumns: Array<{id: string, name: string, sort_order: number}>;
  responsibles: Array<{id: string, name: string}>;
}

export const LeadManagementSection: React.FC<LeadManagementSectionProps> = ({ 
  form, 
  pipelineColumns, 
  responsibles 
}) => {
  const { watch, setValue } = form;

  return (
    <FormSection title="Gestão" icon={<Settings className="h-4 w-4" />}>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Coluna</Label>
          <Select 
            value={watch('column_id') || ''}
            onValueChange={(value) => setValue('column_id', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Selecione a coluna" />
            </SelectTrigger>
            <SelectContent>
              {pipelineColumns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Responsável</Label>
          <Select 
            onValueChange={(value) => setValue('responsible_id', value)} 
            value={watch('responsible_id')}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              {responsibles.map((responsible) => (
                <SelectItem key={responsible.id} value={responsible.id}>
                  {responsible.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Tags</Label>
          <OptimizedTagsSelector
            selectedTags={watch('tags') || []}
            onTagsChange={(tags) => setValue('tags', tags)}
          />
        </div>
      </div>
    </FormSection>
  );
};
