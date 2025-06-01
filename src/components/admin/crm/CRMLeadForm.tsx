
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CRMLead } from '@/types/crm.types';
import { useLeadForm } from '@/hooks/crm/useLeadForm';
import { useLeadFormData } from '@/hooks/crm/useLeadFormData';
import { LeadBasicInfoSection } from './form-sections/LeadBasicInfoSection';
import { LeadBusinessSection } from './form-sections/LeadBusinessSection';
import { LeadAmazonSection } from './form-sections/LeadAmazonSection';
import { LeadQualificationSection } from './form-sections/LeadQualificationSection';
import { LeadManagementSection } from './form-sections/LeadManagementSection';
import { LeadNotesSection } from './form-sections/LeadNotesSection';

interface CRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CRMLeadForm = ({ pipelineId, initialColumnId, lead, onSuccess, onCancel }: CRMLeadFormProps) => {
  const { responsibles, pipelineColumns, loading: dataLoading } = useLeadFormData(pipelineId);
  const { form, loading, onSubmit } = useLeadForm({
    pipelineId,
    initialColumnId,
    lead,
    onSuccess,
    mode: lead ? 'edit' : 'create'
  });

  const { setValue } = form;

  // Auto-select first column if none selected
  useEffect(() => {
    if (pipelineColumns.length > 0 && !form.watch('column_id') && !initialColumnId && !lead) {
      const firstColumn = pipelineColumns[0];
      setValue('column_id', firstColumn.id);
    }
  }, [pipelineColumns, setValue, form, initialColumnId, lead]);

  const handleSubmit = () => {
    form.handleSubmit((data) => onSubmit(data, pipelineColumns))();
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <LeadBasicInfoSection form={form} />

      {/* Negócio e Amazon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadBusinessSection form={form} />
        <LeadAmazonSection form={form} />
      </div>

      {/* Qualificação e Gestão */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadQualificationSection form={form} />
        <LeadManagementSection 
          form={form} 
          pipelineColumns={pipelineColumns}
          responsibles={responsibles}
        />
      </div>

      {/* Observações */}
      <LeadNotesSection form={form} />

      {/* Ações */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : lead ? 'Atualizar Lead' : 'Salvar Lead'}
        </Button>
      </div>
    </form>
  );
};

export default CRMLeadForm;
