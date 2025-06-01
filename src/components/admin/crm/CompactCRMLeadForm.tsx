
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CRMLead } from '@/types/crm.types';
import { X, Save, User } from 'lucide-react';
import { useLeadForm } from '@/hooks/crm/useLeadForm';
import { useLeadFormData } from '@/hooks/crm/useLeadFormData';
import { LeadBasicInfoSection } from './form-sections/LeadBasicInfoSection';
import { LeadBusinessSection } from './form-sections/LeadBusinessSection';
import { LeadAmazonSection } from './form-sections/LeadAmazonSection';
import { LeadQualificationSection } from './form-sections/LeadQualificationSection';
import { LeadManagementSection } from './form-sections/LeadManagementSection';
import { LeadNotesSection } from './form-sections/LeadNotesSection';

interface CompactCRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const CompactCRMLeadForm = ({ pipelineId, initialColumnId, lead, onSuccess, onCancel, mode }: CompactCRMLeadFormProps) => {
  console.log('🎯 CompactCRMLeadForm: Renderizando formulário compacto!', { mode, pipelineId });
  
  const { responsibles, pipelineColumns, loading: dataLoading } = useLeadFormData(pipelineId);
  const { form, loading, onSubmit } = useLeadForm({
    pipelineId,
    initialColumnId,
    lead,
    onSuccess,
    mode
  });

  const { setValue } = form;

  useEffect(() => {
    if (pipelineColumns.length > 0 && !form.watch('column_id') && !initialColumnId && !lead) {
      const firstColumn = pipelineColumns[0];
      setValue('column_id', firstColumn.id);
    }
  }, [pipelineColumns, setValue, form, initialColumnId, lead]);

  const handleSubmit = () => {
    form.handleSubmit((data) => onSubmit(data, pipelineColumns))();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header compacto */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'create' ? 'Novo Lead' : 'Editar Lead'}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === 'create' ? 'Adicione um novo lead ao pipeline' : 'Edite as informações do lead'}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Content compacto */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Informações Básicas */}
          <LeadBasicInfoSection form={form} />

          {/* Negócio e Amazon em uma linha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadBusinessSection form={form} />
            <LeadAmazonSection form={form} />
          </div>

          {/* Qualificação e Gestão */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadQualificationSection form={form} />
            <LeadManagementSection 
              form={form} 
              pipelineColumns={pipelineColumns}
              responsibles={responsibles}
            />
          </div>

          {/* Observações */}
          <LeadNotesSection form={form} />
        </div>
      </form>

      {/* Footer compacto */}
      <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading || dataLoading}
          className="h-8 px-4 text-sm"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || dataLoading}
          className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save className="h-3 w-3" />
              </motion.div>
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-3 w-3" />
              {lead ? 'Atualizar' : 'Salvar'}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CompactCRMLeadForm;
