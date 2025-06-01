
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMCustomField, CRMCustomFieldGroup, CRMCustomFieldInput, CRMCustomFieldGroupInput } from '@/types/crm-custom-fields.types';

export const useCRMCustomFields = () => {
  const queryClient = useQueryClient();

  // Buscar grupos de campos
  const { data: fieldGroups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['crm-custom-field-groups'],
    queryFn: async (): Promise<CRMCustomFieldGroup[]> => {
      const { data, error } = await supabase
        .from('crm_custom_field_groups')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Buscar campos customizáveis
  const { data: customFields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ['crm-custom-fields'],
    queryFn: async (): Promise<CRMCustomField[]> => {
      const { data, error } = await supabase
        .from('crm_custom_fields')
        .select(`
          *,
          group:crm_custom_field_groups(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Criar grupo de campos
  const createFieldGroup = useMutation({
    mutationFn: async (input: CRMCustomFieldGroupInput) => {
      const { data, error } = await supabase
        .from('crm_custom_field_groups')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-custom-field-groups'] });
      toast.success('Grupo criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar grupo:', error);
      toast.error('Erro ao criar grupo');
    }
  });

  // Atualizar grupo de campos
  const updateFieldGroup = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CRMCustomFieldGroupInput> }) => {
      const { data, error } = await supabase
        .from('crm_custom_field_groups')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-custom-field-groups'] });
      toast.success('Grupo atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar grupo:', error);
      toast.error('Erro ao atualizar grupo');
    }
  });

  // Deletar grupo de campos
  const deleteFieldGroup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_custom_field_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-custom-field-groups'] });
      toast.success('Grupo removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover grupo:', error);
      toast.error('Erro ao remover grupo');
    }
  });

  // Criar campo customizável
  const createCustomField = useMutation({
    mutationFn: async (input: CRMCustomFieldInput) => {
      const { data, error } = await supabase
        .from('crm_custom_fields')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-custom-fields'] });
      toast.success('Campo criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar campo:', error);
      toast.error('Erro ao criar campo');
    }
  });

  // Atualizar campo customizável
  const updateCustomField = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CRMCustomFieldInput> }) => {
      const { data, error } = await supabase
        .from('crm_custom_fields')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-custom-fields'] });
      toast.success('Campo atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar campo:', error);
      toast.error('Erro ao atualizar campo');
    }
  });

  // Deletar campo customizável
  const deleteCustomField = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_custom_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-custom-fields'] });
      toast.success('Campo removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover campo:', error);
      toast.error('Erro ao remover campo');
    }
  });

  return {
    fieldGroups,
    customFields,
    isLoading: groupsLoading || fieldsLoading,
    createFieldGroup,
    updateFieldGroup,
    deleteFieldGroup,
    createCustomField,
    updateCustomField,
    deleteCustomField
  };
};
