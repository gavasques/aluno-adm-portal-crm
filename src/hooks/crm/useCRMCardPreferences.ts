
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadCardField } from '@/types/crm.types';
import { useAuth } from '@/hooks/useAuth';

const DEFAULT_VISIBLE_FIELDS: CRMLeadCardField[] = [
  'name',
  'status', 
  'responsible',
  'phone',
  'email',
  'scheduled_contact_date', // Incluído por padrão
  'has_company',
  'sells_on_amazon',
  'works_with_fba',
  'seeks_private_label',
  'ready_to_invest_3k',
  'tags'
];

const DEFAULT_FIELD_ORDER: CRMLeadCardField[] = [
  'name',
  'status',
  'responsible', 
  'scheduled_contact_date', // Priorizado no início
  'phone',
  'email',
  'has_company',
  'sells_on_amazon',
  'works_with_fba',
  'seeks_private_label',
  'ready_to_invest_3k',
  'calendly_scheduled',
  'what_sells',
  'amazon_state',
  'amazon_tax_regime',
  'amazon_store_link',
  'keep_or_new_niches',
  'main_doubts',
  'notes',
  'calendly_link',
  'had_contact_with_lv',
  'pipeline',
  'column',
  'tags',
  'created_at',
  'updated_at'
];

export const useCRMCardPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['crm-card-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('crm_user_card_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Se não existe preferência, criar uma com os valores padrão
      if (!data) {
        const defaultPrefs = {
          user_id: user.id,
          visible_fields: DEFAULT_VISIBLE_FIELDS,
          field_order: DEFAULT_FIELD_ORDER
        };

        const { data: newData, error: insertError } = await supabase
          .from('crm_user_card_preferences')
          .insert(defaultPrefs)
          .select()
          .single();

        if (insertError) throw insertError;
        return newData;
      }

      // Garantir que scheduled_contact_date esteja sempre incluído
      let visibleFields = data.visible_fields || DEFAULT_VISIBLE_FIELDS;
      if (!visibleFields.includes('scheduled_contact_date')) {
        visibleFields = [...visibleFields, 'scheduled_contact_date'];
        
        // Atualizar no banco de dados
        await supabase
          .from('crm_user_card_preferences')
          .update({ visible_fields: visibleFields })
          .eq('id', data.id);
      }

      return {
        ...data,
        visible_fields: visibleFields,
        field_order: data.field_order || DEFAULT_FIELD_ORDER
      };
    },
    enabled: !!user?.id
  });

  const updateMutation = useMutation({
    mutationFn: async ({ 
      visibleFields, 
      fieldOrder 
    }: { 
      visibleFields: CRMLeadCardField[]; 
      fieldOrder: CRMLeadCardField[] 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Garantir que scheduled_contact_date esteja sempre incluído
      const finalVisibleFields = visibleFields.includes('scheduled_contact_date') 
        ? visibleFields 
        : [...visibleFields, 'scheduled_contact_date'];

      const { data, error } = await supabase
        .from('crm_user_card_preferences')
        .upsert({
          user_id: user.id,
          visible_fields: finalVisibleFields,
          field_order: fieldOrder
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['crm-card-preferences', user?.id]
      });
    }
  });

  return {
    preferences: preferences || {
      visible_fields: DEFAULT_VISIBLE_FIELDS,
      field_order: DEFAULT_FIELD_ORDER
    },
    isLoading,
    updatePreferences: (visibleFields: CRMLeadCardField[], fieldOrder: CRMLeadCardField[]) =>
      updateMutation.mutate({ visibleFields, fieldOrder }),
    isSaving: updateMutation.isPending
  };
};
