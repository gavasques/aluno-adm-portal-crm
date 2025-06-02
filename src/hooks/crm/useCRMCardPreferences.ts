
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMUserCardPreferences, CRMLeadCardField } from '@/types/crm.types';
import { toast } from 'sonner';

const DEFAULT_VISIBLE_FIELDS: CRMLeadCardField[] = [
  'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
];

const DEFAULT_FIELD_ORDER: CRMLeadCardField[] = [
  'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
];

export const useCRMCardPreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['crm-card-preferences'],
    queryFn: async () => {
      console.log('🔧 Loading card preferences...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('crm_user_card_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
        throw error;
      }

      if (!data) {
        console.log('📝 No preferences found, using defaults');
        return {
          visible_fields: DEFAULT_VISIBLE_FIELDS,
          field_order: DEFAULT_FIELD_ORDER
        };
      }

      console.log('✅ Preferences loaded:', data);
      return {
        visible_fields: data.visible_fields as CRMLeadCardField[],
        field_order: data.field_order as CRMLeadCardField[]
      };
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async ({ 
      visible_fields, 
      field_order 
    }: { 
      visible_fields: CRMLeadCardField[]; 
      field_order: CRMLeadCardField[]; 
    }) => {
      console.log('💾 Saving preferences:', { visible_fields, field_order });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existing } = await supabase
        .from('crm_user_card_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Atualizar existente
        const { error } = await supabase
          .from('crm_user_card_preferences')
          .update({
            visible_fields,
            field_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Criar novo
        const { error } = await supabase
          .from('crm_user_card_preferences')
          .insert({
            user_id: user.id,
            visible_fields,
            field_order
          });

        if (error) throw error;
      }

      return { visible_fields, field_order };
    },
    onSuccess: (data) => {
      console.log('✅ Preferences saved successfully:', data);
      
      // Invalidar as queries relacionadas para forçar atualização
      queryClient.invalidateQueries({ queryKey: ['crm-card-preferences'] });
      queryClient.setQueryData(['crm-card-preferences'], {
        visible_fields: data.visible_fields,
        field_order: data.field_order
      });
      
      toast.success('Preferências de card atualizadas');
    },
    onError: (error) => {
      console.error('❌ Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências');
    }
  });

  const updatePreferences = (
    visible_fields: CRMLeadCardField[], 
    field_order: CRMLeadCardField[]
  ) => {
    updatePreferencesMutation.mutate({ visible_fields, field_order });
  };

  return {
    preferences: preferences || {
      visible_fields: DEFAULT_VISIBLE_FIELDS,
      field_order: DEFAULT_FIELD_ORDER
    },
    updatePreferences,
    isLoading,
    isSaving: updatePreferencesMutation.isPending
  };
};
