
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCRMLeadUpdate } from './useCRMLeadUpdate';
import { useOptimizedCRMTags } from './useOptimizedCRMTags';
import { useCRMCustomFields } from './useCRMCustomFields';
import { useCustomFieldValues } from './useCustomFieldValues';
import { leadFormSchema, type LeadFormData } from '@/utils/crm-validation-schemas';
import { CRMLead, CRMLeadInput } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';

interface UseLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  mode: 'create' | 'edit';
}

export const useLeadForm = ({ pipelineId, initialColumnId, lead, onSuccess, mode }: UseLeadFormProps) => {
  const [loading, setLoading] = useState(false);
  const { updateLead } = useCRMLeadUpdate();
  const { updateLeadTags } = useOptimizedCRMTags();
  const { customFields } = useCRMCustomFields(pipelineId);
  const { getFormValues, prepareFieldValues, saveFieldValues } = useCustomFieldValues(lead?.id);

  // Valores iniciais incluindo campos customizáveis
  const getDefaultValues = () => {
    const baseValues = {
      name: lead?.name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      has_company: lead?.has_company || false,
      what_sells: lead?.what_sells || '',
      keep_or_new_niches: lead?.keep_or_new_niches || '',
      sells_on_amazon: lead?.sells_on_amazon || false,
      amazon_store_link: lead?.amazon_store_link || '',
      amazon_state: lead?.amazon_state || '',
      amazon_tax_regime: lead?.amazon_tax_regime || '',
      works_with_fba: lead?.works_with_fba || false,
      had_contact_with_lv: lead?.had_contact_with_lv || false,
      seeks_private_label: lead?.seeks_private_label || false,
      main_doubts: lead?.main_doubts || '',
      ready_to_invest_3k: lead?.ready_to_invest_3k || false,
      calendly_scheduled: lead?.calendly_scheduled || false,
      calendly_link: lead?.calendly_link || '',
      column_id: lead?.column_id || initialColumnId || '',
      responsible_id: lead?.responsible_id || '',
      notes: lead?.notes || '',
      tags: lead?.tags?.map(tag => tag.id) || [],
    };

    // Adicionar valores dos campos customizáveis se estiver editando
    if (mode === 'edit' && lead) {
      const customFieldValues = getFormValues();
      return { ...baseValues, ...customFieldValues };
    }

    return baseValues;
  };

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: getDefaultValues()
  });

  const createLead = async (leadData: CRMLeadInput) => {
    try {
      debugLogger.info('🔄 [LEAD_FORM] Criando lead no banco', {
        component: 'useLeadForm',
        operation: 'createLead',
        leadData: {
          name: leadData.name,
          email: leadData.email,
          pipeline_id: leadData.pipeline_id,
          column_id: leadData.column_id
        }
      });

      // Validar campos obrigatórios
      if (!leadData.name || !leadData.email) {
        throw new Error('Nome e email são obrigatórios');
      }

      if (!leadData.pipeline_id) {
        throw new Error('Pipeline é obrigatório');
      }

      if (!leadData.column_id) {
        throw new Error('Coluna é obrigatória');
      }

      const insertData = {
        name: leadData.name.trim(),
        email: leadData.email.trim().toLowerCase(),
        phone: leadData.phone?.trim() || null,
        has_company: Boolean(leadData.has_company),
        what_sells: leadData.what_sells?.trim() || null,
        keep_or_new_niches: leadData.keep_or_new_niches?.trim() || null,
        sells_on_amazon: Boolean(leadData.sells_on_amazon),
        amazon_store_link: leadData.amazon_store_link?.trim() || null,
        amazon_state: leadData.amazon_state?.trim() || null,
        amazon_tax_regime: leadData.amazon_tax_regime?.trim() || null,
        works_with_fba: Boolean(leadData.works_with_fba),
        had_contact_with_lv: Boolean(leadData.had_contact_with_lv),
        seeks_private_label: Boolean(leadData.seeks_private_label),
        main_doubts: leadData.main_doubts?.trim() || null,
        ready_to_invest_3k: Boolean(leadData.ready_to_invest_3k),
        calendly_scheduled: Boolean(leadData.calendly_scheduled),
        calendly_link: leadData.calendly_link?.trim() || null,
        pipeline_id: leadData.pipeline_id,
        column_id: leadData.column_id,
        responsible_id: leadData.responsible_id || null,
        notes: leadData.notes?.trim() || null,
        status: 'aberto' as const
      };

      debugLogger.info('📤 [LEAD_FORM] Inserindo no Supabase', {
        component: 'useLeadForm',
        operation: 'supabaseInsert',
        insertData: {
          ...insertData,
          email: '***@***', // Ocultar email nos logs
        }
      });

      const { data, error } = await supabase
        .from('crm_leads')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        debugLogger.error('❌ [LEAD_FORM] Erro ao inserir lead', {
          component: 'useLeadForm',
          operation: 'supabaseInsert',
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Tratamento específico de erros
        if (error.code === '23505') {
          throw new Error('Já existe um lead com este email');
        } else if (error.code === '23503') {
          throw new Error('Pipeline ou coluna inválida');
        } else if (error.code === '23514') {
          throw new Error('Dados inválidos fornecidos');
        } else {
          throw new Error(`Erro ao criar lead: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error('Nenhum dado retornado após criação do lead');
      }

      debugLogger.info('✅ [LEAD_FORM] Lead criado com sucesso', {
        component: 'useLeadForm',
        operation: 'createLead',
        leadId: data.id
      });

      return data;
    } catch (error) {
      debugLogger.error('❌ [LEAD_FORM] Erro geral ao criar lead', {
        component: 'useLeadForm',
        operation: 'createLead',
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  };

  const onSubmit = async (data: LeadFormData, pipelineColumns: Array<{id: string}>) => {
    setLoading(true);
    
    try {
      debugLogger.info('🚀 [LEAD_FORM] Iniciando salvamento', {
        component: 'useLeadForm',
        operation: 'onSubmit',
        mode,
        pipelineId,
        formData: {
          name: data.name,
          email: data.email,
          column_id: data.column_id,
          responsible_id: data.responsible_id
        }
      });

      // Validação de campos obrigatórios
      if (!data.name?.trim()) {
        throw new Error('Nome é obrigatório');
      }

      if (!data.email?.trim()) {
        throw new Error('Email é obrigatório');
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        throw new Error('Email inválido');
      }

      const columnId = data.column_id || initialColumnId || (pipelineColumns.length > 0 ? pipelineColumns[0].id : '');
      
      if (!columnId) {
        throw new Error('Nenhuma coluna disponível para criar o lead');
      }

      if (lead) {
        // Atualizar lead existente
        debugLogger.info('🔄 [LEAD_FORM] Atualizando lead existente', {
          component: 'useLeadForm',
          operation: 'updateLead',
          leadId: lead.id
        });

        await updateLead(lead.id, {
          ...data,
          pipeline_id: pipelineId,
          column_id: columnId,
        });
        
        await updateLeadTags(lead.id, data.tags || []);

        // Salvar valores dos campos customizáveis
        if (customFields.length > 0) {
          const fieldValues = prepareFieldValues(data, customFields);
          await saveFieldValues.mutateAsync(fieldValues);
        }

        toast.success('Lead atualizado com sucesso!');
      } else {
        // Criar novo lead
        debugLogger.info('➕ [LEAD_FORM] Criando novo lead', {
          component: 'useLeadForm',
          operation: 'createNewLead',
          pipelineId,
          columnId
        });

        const newLead = await createLead({
          ...data,
          pipeline_id: pipelineId,
          column_id: columnId,
          name: data.name.trim(),
          email: data.email.trim(),
        });

        // Adicionar tags
        if (data.tags && data.tags.length > 0) {
          debugLogger.info('🏷️ [LEAD_FORM] Adicionando tags ao lead', {
            component: 'useLeadForm',
            operation: 'addTags',
            leadId: newLead.id,
            tagsCount: data.tags.length
          });
          await updateLeadTags(newLead.id, data.tags);
        }

        // Salvar valores dos campos customizáveis
        if (customFields.length > 0) {
          const fieldValues = prepareFieldValues(data, customFields);
          if (fieldValues.length > 0) {
            const { error } = await supabase
              .from('crm_custom_field_values')
              .insert(
                fieldValues.map(v => ({
                  lead_id: newLead.id,
                  field_id: v.field_id,
                  field_value: v.field_value
                }))
              );

            if (error) {
              debugLogger.error('❌ [LEAD_FORM] Erro ao salvar campos customizáveis', {
                component: 'useLeadForm',
                operation: 'saveCustomFields',
                error: error.message
              });
              toast.error('Lead criado, mas houve erro ao salvar campos customizáveis');
            }
          }
        }
        
        toast.success('Lead criado com sucesso!');
      }
      
      debugLogger.info('✅ [LEAD_FORM] Salvamento concluído com sucesso', {
        component: 'useLeadForm',
        operation: 'onSubmit',
        mode
      });

      onSuccess();
    } catch (error) {
      debugLogger.error('❌ [LEAD_FORM] Erro ao salvar lead', {
        component: 'useLeadForm',
        operation: 'onSubmit',
        error: error instanceof Error ? error.message : String(error)
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} lead: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit
  };
};
