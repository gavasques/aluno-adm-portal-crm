
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMCustomFieldValue } from '@/types/crm-custom-fields.types';

export const useCustomFieldValues = (leadId?: string) => {
  const queryClient = useQueryClient();

  // Buscar valores dos campos customizáveis para um lead
  const { data: fieldValues = [], isLoading } = useQuery({
    queryKey: ['crm-custom-field-values', leadId],
    queryFn: async (): Promise<CRMCustomFieldValue[]> => {
      if (!leadId) return [];

      const { data, error } = await supabase
        .from('crm_custom_field_values')
        .select(`
          *,
          field:crm_custom_fields(*)
        `)
        .eq('lead_id', leadId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!leadId
  });

  // Salvar/atualizar valores dos campos customizáveis
  const saveFieldValues = useMutation({
    mutationFn: async (values: Array<{ field_id: string; field_value: string }>) => {
      if (!leadId) throw new Error('Lead ID é obrigatório');

      // Primeiro, remover valores existentes
      await supabase
        .from('crm_custom_field_values')
        .delete()
        .eq('lead_id', leadId);

      // Inserir novos valores (apenas os que têm valor)
      const valuesToInsert = values
        .filter(v => v.field_value !== '' && v.field_value !== null && v.field_value !== undefined)
        .map(v => ({
          lead_id: leadId,
          field_id: v.field_id,
          field_value: v.field_value
        }));

      if (valuesToInsert.length > 0) {
        const { error } = await supabase
          .from('crm_custom_field_values')
          .insert(valuesToInsert);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-custom-field-values', leadId] });
    },
    onError: (error) => {
      console.error('Erro ao salvar valores dos campos:', error);
      toast.error('Erro ao salvar campos customizáveis');
    }
  });

  // Converter valores para formato usado pelo formulário
  const getFormValues = () => {
    const formValues: Record<string, any> = {};
    fieldValues.forEach(value => {
      if (value.field?.field_key) {
        const fieldKey = `custom_field_${value.field.field_key}`;
        let fieldValue = value.field_value;

        // Converter para tipos apropriados
        if (value.field.field_type === 'boolean') {
          fieldValue = fieldValue === 'true';
        } else if (value.field.field_type === 'number') {
          fieldValue = fieldValue ? parseFloat(fieldValue) : null;
        }

        formValues[fieldKey] = fieldValue;
      }
    });
    return formValues;
  };

  // Converter valores do formulário para formato de salvamento
  const prepareFieldValues = (formData: Record<string, any>, customFields: Array<{ id: string; field_key: string; field_type: string }>) => {
    return customFields.map(field => {
      const fieldKey = `custom_field_${field.field_key}`;
      let fieldValue = formData[fieldKey];

      // Converter para string para armazenamento
      if (fieldValue !== null && fieldValue !== undefined) {
        if (field.field_type === 'boolean') {
          fieldValue = fieldValue.toString();
        } else if (field.field_type === 'number') {
          fieldValue = fieldValue.toString();
        } else {
          fieldValue = String(fieldValue);
        }
      } else {
        fieldValue = '';
      }

      return {
        field_id: field.id,
        field_value: fieldValue
      };
    }).filter(v => v.field_value !== '');
  };

  return {
    fieldValues,
    isLoading,
    saveFieldValues,
    getFormValues,
    prepareFieldValues
  };
};
