
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
  const { customFields } = useCRMCustomFields(pipelineId); // Filtrar por pipeline
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
      const insertData = {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        has_company: leadData.has_company,
        what_sells: leadData.what_sells,
        keep_or_new_niches: leadData.keep_or_new_niches,
        sells_on_amazon: leadData.sells_on_amazon,
        amazon_store_link: leadData.amazon_store_link,
        amazon_state: leadData.amazon_state,
        amazon_tax_regime: leadData.amazon_tax_regime,
        works_with_fba: leadData.works_with_fba,
        had_contact_with_lv: leadData.had_contact_with_lv,
        seeks_private_label: leadData.seeks_private_label,
        main_doubts: leadData.main_doubts,
        ready_to_invest_3k: leadData.ready_to_invest_3k,
        calendly_scheduled: leadData.calendly_scheduled,
        calendly_link: leadData.calendly_link,
        pipeline_id: leadData.pipeline_id,
        column_id: leadData.column_id,
        responsible_id: leadData.responsible_id,
        notes: leadData.notes
      };

      const { data, error } = await supabase
        .from('crm_leads')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  };

  const onSubmit = async (data: LeadFormData, pipelineColumns: Array<{id: string}>) => {
    setLoading(true);
    try {
      const columnId = data.column_id || initialColumnId || (pipelineColumns.length > 0 ? pipelineColumns[0].id : '');
      
      if (lead) {
        // Atualizar lead existente
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
        const newLead = await createLead({
          ...data,
          pipeline_id: pipelineId,
          column_id: columnId,
          name: data.name!,
          email: data.email!,
        });

        // Adicionar tags
        if (data.tags && data.tags.length > 0) {
          await updateLeadTags(newLead.id, data.tags);
        }

        // Salvar valores dos campos customizáveis
        if (customFields.length > 0) {
          const fieldValues = prepareFieldValues(data, customFields);
          if (fieldValues.length > 0) {
            // Usar o ID do lead recém-criado
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
              console.error('Erro ao salvar campos customizáveis:', error);
              toast.error('Lead criado, mas houve erro ao salvar campos customizáveis');
            }
          }
        }
        
        toast.success('Lead criado com sucesso!');
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      toast.error('Erro ao salvar lead');
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
