
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { LeadBasicInfoSection } from './form-sections/LeadBasicInfoSection';
import { LeadBusinessSection } from './form-sections/LeadBusinessSection';
import { LeadQualificationSection } from './form-sections/LeadQualificationSection';
import { ConditionalLeadAmazonSection } from './form-sections/ConditionalLeadAmazonSection';
import { LeadManagementSection } from './form-sections/LeadManagementSection';
import { LeadNotesSection } from './form-sections/LeadNotesSection';
import { useLeadForm } from '@/hooks/crm/useLeadForm';
import { useLeadFormData } from '@/hooks/crm/useLeadFormData';
import { CRMLead } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';

interface UnifiedCRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
  isOpen?: boolean;
}

const UnifiedCRMLeadForm: React.FC<UnifiedCRMLeadFormProps> = ({
  pipelineId,
  initialColumnId,
  lead,
  onSuccess,
  onCancel,
  mode,
  isOpen = true
}) => {
  debugLogger.info('🎯 [UNIFIED_FORM] Inicializando formulário', {
    component: 'UnifiedCRMLeadForm',
    mode,
    pipelineId,
    initialColumnId,
    leadId: lead?.id
  });

  // Buscar dados necessários para o formulário
  const { responsibles, pipelineColumns, loading: dataLoading } = useLeadFormData(pipelineId);
  
  // Hook principal do formulário com lógica de salvamento
  const { form, loading: formLoading, onSubmit } = useLeadForm({
    pipelineId,
    initialColumnId,
    lead,
    onSuccess,
    mode
  });

  const sellsOnAmazon = form.watch('sells_on_amazon');
  const isLoading = dataLoading || formLoading;

  debugLogger.info('📊 [UNIFIED_FORM] Estado do formulário', {
    component: 'UnifiedCRMLeadForm',
    dataLoading,
    formLoading,
    pipelineColumnsCount: pipelineColumns.length,
    responsiblesCount: responsibles.length,
    sellsOnAmazon
  });

  if (dataLoading) {
    debugLogger.info('⏳ [UNIFIED_FORM] Carregando dados do formulário...', {
      component: 'UnifiedCRMLeadForm'
    });
    
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Novo Lead' : 'Editar Lead'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Carregando dados do formulário...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debugLogger.info('🚀 [UNIFIED_FORM] Form submit iniciado', {
      component: 'UnifiedCRMLeadForm',
      mode,
      pipelineId
    });

    form.handleSubmit((data) => {
      debugLogger.info('📤 [UNIFIED_FORM] Dados do formulário para submissão', {
        component: 'UnifiedCRMLeadForm',
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          column_id: data.column_id,
          responsible_id: data.responsible_id,
          pipelineId
        }
      });
      
      onSubmit(data, pipelineColumns);
    })(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Lead' : 'Editar Lead'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Seção de Informações Básicas */}
            <LeadBasicInfoSection form={form} />
            
            <Separator />
            
            {/* Seção de Negócio */}
            <LeadBusinessSection form={form} />
            
            <Separator />
            
            {/* Seção de Qualificação */}
            <LeadQualificationSection form={form} />
            
            {/* Seção Condicional da Amazon */}
            {sellsOnAmazon && (
              <>
                <Separator />
                <ConditionalLeadAmazonSection form={form} />
              </>
            )}
            
            <Separator />
            
            {/* Seção de Gestão */}
            <LeadManagementSection 
              form={form}
              pipelineColumns={pipelineColumns}
              responsibles={responsibles}
            />
            
            <Separator />
            
            {/* Seção de Observações */}
            <LeadNotesSection form={form} />

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={formLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={formLoading}
              >
                {formLoading 
                  ? (mode === 'create' ? 'Criando...' : 'Salvando...') 
                  : (mode === 'create' ? 'Criar Lead' : 'Salvar Alterações')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedCRMLeadForm;
