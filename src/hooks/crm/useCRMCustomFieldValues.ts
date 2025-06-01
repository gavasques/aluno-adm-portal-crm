
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCRMCustomFieldValues = () => {
  const [saving, setSaving] = useState(false);

  const saveCustomFieldValue = async (leadId: string, fieldId: string, value: string) => {
    try {
      setSaving(true);
      
      // Verificar se já existe um valor para este campo
      const { data: existingValue } = await supabase
        .from('crm_custom_field_values')
        .select('id')
        .eq('lead_id', leadId)
        .eq('field_id', fieldId)
        .maybeSingle();

      if (existingValue) {
        // Atualizar valor existente
        const { error } = await supabase
          .from('crm_custom_field_values')
          .update({ field_value: value })
          .eq('id', existingValue.id);

        if (error) throw error;
      } else {
        // Criar novo valor
        const { error } = await supabase
          .from('crm_custom_field_values')
          .insert({
            lead_id: leadId,
            field_id: fieldId,
            field_value: value
          });

        if (error) throw error;
      }

      console.log('✅ Campo customizado salvo:', { fieldId, value });
    } catch (error) {
      console.error('❌ Erro ao salvar campo customizado:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    saveCustomFieldValue,
    saving
  };
};
