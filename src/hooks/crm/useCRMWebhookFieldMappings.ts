import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMWebhookFieldMapping, CRMWebhookFieldMappingInput } from '@/types/crm-webhook.types';

export const useCRMWebhookFieldMappings = (pipelineId?: string) => {
  const queryClient = useQueryClient();

  // Buscar mapeamentos de campos
  const { data: mappings = [], isLoading } = useQuery({
    queryKey: ['crm-webhook-field-mappings', pipelineId],
    queryFn: async (): Promise<CRMWebhookFieldMapping[]> => {
      let query = supabase
        .from('crm_webhook_field_mappings')
        .select(`
          *,
          custom_field:crm_custom_fields(id, field_name, field_key)
        `)
        .order('webhook_field_name', { ascending: true });

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform data to match our types, ensuring type safety
      return (data || []).map(item => ({
        ...item,
        crm_field_type: item.crm_field_type as 'standard' | 'custom',
        field_type: item.field_type as 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email',
        transformation_rules: (item.transformation_rules && typeof item.transformation_rules === 'object' && !Array.isArray(item.transformation_rules)) 
          ? item.transformation_rules as Record<string, any>
          : {}
      })) as CRMWebhookFieldMapping[];
    },
  });

  // Criar mapeamento
  const createMapping = useMutation({
    mutationFn: async (input: CRMWebhookFieldMappingInput) => {
      const { data, error } = await supabase
        .from('crm_webhook_field_mappings')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-field-mappings'] });
      toast.success('Mapeamento criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar mapeamento:', error);
      toast.error('Erro ao criar mapeamento');
    }
  });

  // Atualizar mapeamento
  const updateMapping = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CRMWebhookFieldMappingInput> }) => {
      const { data, error } = await supabase
        .from('crm_webhook_field_mappings')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-field-mappings'] });
      toast.success('Mapeamento atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar mapeamento:', error);
      toast.error('Erro ao atualizar mapeamento');
    }
  });

  // Deletar mapeamento
  const deleteMapping = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_webhook_field_mappings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-field-mappings'] });
      toast.success('Mapeamento removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover mapeamento:', error);
      toast.error('Erro ao remover mapeamento');
    }
  });

  // Sincronizar APENAS campo obrigatório (name)
  const syncStandardMappings = useMutation({
    mutationFn: async (targetPipelineId: string) => {
      const requiredFields = [
        { webhook_field_name: 'name', crm_field_name: 'name', field_type: 'text', is_required: true }
      ];

      const mappingsToCreate = requiredFields.map(field => ({
        pipeline_id: targetPipelineId,
        crm_field_type: 'standard' as const,
        transformation_rules: {},
        ...field
      }));

      const { data, error } = await supabase
        .from('crm_webhook_field_mappings')
        .upsert(mappingsToCreate, { 
          onConflict: 'pipeline_id,webhook_field_name',
          ignoreDuplicates: true 
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-field-mappings'] });
      toast.success('Campo obrigatório sincronizado! Para mapear outros campos, use "Adicionar Mapeamento"');
    },
    onError: (error) => {
      console.error('Erro ao sincronizar mapeamento:', error);
      toast.error('Erro ao sincronizar campo obrigatório');
    }
  });

  return {
    mappings,
    isLoading,
    createMapping,
    updateMapping,
    deleteMapping,
    syncStandardMappings
  };
};
