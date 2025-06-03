
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { CRMLead } from '@/types/crm.types';

const leadFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  pipeline_id: z.string().min(1, 'Pipeline é obrigatório'),
  column_id: z.string().optional(),
  responsible_id: z.string().optional(),
  has_company: z.boolean().default(false),
  sells_on_amazon: z.boolean().default(false),
  works_with_fba: z.boolean().default(false),
  seeks_private_label: z.boolean().default(false),
  ready_to_invest_3k: z.boolean().default(false),
  calendly_scheduled: z.boolean().default(false),
  what_sells: z.string().optional(),
  keep_or_new_niches: z.string().optional(),
  amazon_store_link: z.string().optional(),
  amazon_state: z.string().optional(),
  amazon_tax_regime: z.string().optional(),
  main_doubts: z.string().optional(),
  calendly_link: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string()
  })).default([])
});

type LeadFormData = z.infer<typeof leadFormSchema>;

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
  // Buscar dados necessários
  const { columns } = useCRMPipelines();
  const { users } = useCRMUsers();

  // Filtrar colunas do pipeline específico
  const pipelineColumns = columns.filter(col => 
    col.pipeline_id === pipelineId && col.is_active
  ).sort((a, b) => a.sort_order - b.sort_order);

  // Converter users para o formato esperado
  const responsibles = users.map(user => ({
    id: user.id,
    name: user.name || user.email
  }));

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: lead?.name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      pipeline_id: pipelineId,
      column_id: initialColumnId || lead?.column_id || '',
      responsible_id: lead?.responsible_id || '',
      has_company: lead?.has_company || false,
      sells_on_amazon: lead?.sells_on_amazon || false,
      works_with_fba: lead?.works_with_fba || false,
      seeks_private_label: lead?.seeks_private_label || false,
      ready_to_invest_3k: lead?.ready_to_invest_3k || false,
      calendly_scheduled: lead?.calendly_scheduled || false,
      what_sells: lead?.what_sells || '',
      keep_or_new_niches: lead?.keep_or_new_niches || '',
      amazon_store_link: lead?.amazon_store_link || '',
      amazon_state: lead?.amazon_state || '',
      amazon_tax_regime: lead?.amazon_tax_regime || '',
      main_doubts: lead?.main_doubts || '',
      calendly_link: lead?.calendly_link || '',
      notes: lead?.notes || '',
      tags: lead?.tags || []
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      console.log('🔄 [UNIFIED_FORM] Submetendo formulário:', {
        mode,
        leadId: lead?.id,
        data
      });

      // Aqui integraria com o hook de submissão unificado
      // Por agora, simular sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ [UNIFIED_FORM] Lead salvo com sucesso');
      onSuccess();
      
    } catch (error) {
      console.error('❌ [UNIFIED_FORM] Erro ao salvar lead:', error);
    }
  };

  const sellsOnAmazon = form.watch('sells_on_amazon');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Lead' : 'Editar Lead'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting 
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
