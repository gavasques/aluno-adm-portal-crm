
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMCustomField, CRMCustomFieldGroup, CRMCustomFieldInput, CRMCustomFieldGroupInput } from '@/types/crm-custom-fields.types';

export const useCRMCustomFields = (pipelineId?: string, includeInactive = true) => {
  const queryClient = useQueryClient();

  // Buscar grupos de campos - buscar todos, filtrar na UI
  const { data: allFieldGroups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['crm-custom-field-groups-all'],
    queryFn: async (): Promise<CRMCustomFieldGroup[]> => {
      const { data, error } = await supabase
        .from('crm_custom_field_groups')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 0, // Sempre revalidar para garantir dados atualizados
    refetchOnWindowFocus: true,
  });

  // Buscar campos customizáveis - buscar todos, filtrar na UI
  const { data: allCustomFields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ['crm-custom-fields-all'],
    queryFn: async (): Promise<CRMCustomField[]> => {
      const { data, error } = await supabase
        .from('crm_custom_fields')
        .select(`
          *,
          group:crm_custom_field_groups(*)
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our types
      return (data || []).map(field => ({
        ...field,
        field_type: field.field_type as 'text' | 'number' | 'phone' | 'boolean' | 'select',
        options: Array.isArray(field.options) ? field.options as string[] : [],
        validation_rules: (field.validation_rules && typeof field.validation_rules === 'object' && !Array.isArray(field.validation_rules)) 
          ? field.validation_rules as Record<string, any>
          : {}
      }));
    },
    staleTime: 0, // Sempre revalidar para garantir dados atualizados
    refetchOnWindowFocus: true,
  });

  // Filtrar grupos baseado em pipeline e status ativo
  const fieldGroups = React.useMemo(() => {
    let filtered = allFieldGroups;
    
    // Filtrar por status ativo apenas se solicitado
    if (!includeInactive) {
      filtered = filtered.filter(group => group.is_active);
    }
    
    // Filtrar por pipeline se especificado
    if (pipelineId) {
      filtered = filtered.filter(group => 
        !group.pipeline_id || group.pipeline_id === pipelineId
      );
    }
    
    return filtered;
  }, [allFieldGroups, pipelineId, includeInactive]);

  // Filtrar campos baseado no pipeline do grupo ao qual pertencem e status ativo
  const customFields = React.useMemo(() => {
    let filtered = allCustomFields;
    
    // Filtrar por status ativo apenas se solicitado
    if (!includeInactive) {
      filtered = filtered.filter(field => field.is_active);
    }
    
    // Filtrar por pipeline se especificado
    if (pipelineId) {
      filtered = filtered.filter(field => {
        // Campos sem grupo aparecem em todos os pipelines
        if (!field.group_id) return true;
        
        // Verificar se o grupo do campo pertence ao pipeline
        const group = allFieldGroups.find(g => g.id === field.group_id);
        return !group?.pipeline_id || group.pipeline_id === pipelineId;
      });
    }
    
    return filtered;
  }, [allCustomFields, allFieldGroups, pipelineId, includeInactive]);

  // Função para invalidar todas as queries relacionadas
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['crm-custom-field-groups-all'] });
    queryClient.invalidateQueries({ queryKey: ['crm-custom-fields-all'] });
    queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
    queryClient.invalidateQueries({ queryKey: ['crm-lead-detail'] });
    // Invalidar também queries de webhook mappings
    queryClient.invalidateQueries({ queryKey: ['crm-webhook-field-mappings'] });
  };

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
      invalidateAll();
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
      invalidateAll();
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
      // Verificar se há campos vinculados ao grupo
      const { data: linkedFields, error: checkError } = await supabase
        .from('crm_custom_fields')
        .select('id')
        .eq('group_id', id);

      if (checkError) throw checkError;

      if (linkedFields && linkedFields.length > 0) {
        throw new Error(`Não é possível remover este grupo pois ele possui ${linkedFields.length} campo(s) vinculado(s). Remova primeiro os campos ou mova-os para outro grupo.`);
      }

      const { error } = await supabase
        .from('crm_custom_field_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      toast.success('Grupo removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover grupo:', error);
      toast.error(error.message || 'Erro ao remover grupo');
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
      invalidateAll();
      toast.success('Campo criado com sucesso! Mapeamentos de webhook atualizados automaticamente.');
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
      invalidateAll();
      toast.success('Campo atualizado com sucesso! Mapeamentos de webhook atualizados automaticamente.');
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
      invalidateAll();
      toast.success('Campo removido com sucesso! Mapeamentos de webhook atualizados automaticamente.');
    },
    onError: (error) => {
      console.error('Erro ao remover campo:', error);
      toast.error('Erro ao remover campo');
    }
  });

  return {
    fieldGroups,
    customFields,
    allFieldGroups,
    allCustomFields,
    isLoading: groupsLoading || fieldsLoading,
    createFieldGroup,
    updateFieldGroup,
    deleteFieldGroup,
    createCustomField,
    updateCustomField,
    deleteCustomField,
    invalidateAll
  };
};
