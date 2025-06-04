import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMWebhookFieldMapping, CRMWebhookFieldMappingInput } from '@/types/crm-webhook.types';

export interface WebhookField {
  id: string;
  kind: string;
  title: string;
  suggestedCrmField?: string;
  suggestedType?: string;
}

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

  // Função para extrair campos de um JSON de exemplo
  const extractFieldsFromJson = (jsonString: string): WebhookField[] => {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (!parsed.answers || !Array.isArray(parsed.answers)) {
        throw new Error('JSON deve conter um array "answers"');
      }

      return parsed.answers.map((answer: any) => ({
        id: answer.id,
        kind: answer.kind || 'text',
        title: answer.title || 'Campo sem título',
        suggestedCrmField: suggestCrmField(answer.kind, answer.title),
        suggestedType: mapKindToFieldType(answer.kind)
      }));
    } catch (error) {
      throw new Error('JSON inválido: ' + (error as Error).message);
    }
  };

  // Criar mapeamentos em lote a partir de campos extraídos
  const createBatchMappings = useMutation({
    mutationFn: async ({ fields, pipelineId: targetPipelineId }: { 
      fields: Array<WebhookField & { crmField: string; fieldType: string; isRequired: boolean }>, 
      pipelineId: string 
    }) => {
      const mappingsToCreate = fields.map(field => ({
        pipeline_id: targetPipelineId,
        webhook_field_name: field.id,
        crm_field_name: field.crmField,
        crm_field_type: 'standard' as const,
        field_type: field.fieldType,
        is_required: field.isRequired,
        is_active: true,
        transformation_rules: {}
      }));

      const { data, error } = await supabase
        .from('crm_webhook_field_mappings')
        .upsert(mappingsToCreate, { 
          onConflict: 'pipeline_id,webhook_field_name',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-field-mappings'] });
      toast.success('Mapeamentos criados com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar mapeamentos em lote:', error);
      toast.error('Erro ao criar mapeamentos');
    }
  });

  return {
    mappings,
    isLoading,
    createMapping,
    updateMapping,
    deleteMapping,
    syncStandardMappings,
    extractFieldsFromJson,
    createBatchMappings
  };
};

// Funções auxiliares para sugestões automáticas
function suggestCrmField(kind: string, title: string): string {
  const titleLower = title.toLowerCase();
  
  // Sugestões baseadas no tipo
  if (kind === 'email' || titleLower.includes('email') || titleLower.includes('e-mail')) {
    return 'email';
  }
  
  if (kind === 'phone_number' || titleLower.includes('telefone') || titleLower.includes('whatsapp') || titleLower.includes('phone')) {
    return 'phone';
  }
  
  if (kind === 'short_text' || kind === 'long_text') {
    if (titleLower.includes('nome') || titleLower.includes('name')) {
      return 'name';
    }
    if (titleLower.includes('empresa') || titleLower.includes('company')) {
      return 'has_company';
    }
    if (titleLower.includes('observ') || titleLower.includes('nota') || titleLower.includes('comment')) {
      return 'notes';
    }
  }
  
  if (kind === 'yes_no' || kind === 'boolean') {
    if (titleLower.includes('amazon')) {
      return 'sells_on_amazon';
    }
    if (titleLower.includes('empresa') || titleLower.includes('company')) {
      return 'has_company';
    }
    if (titleLower.includes('fba')) {
      return 'works_with_fba';
    }
  }
  
  // Padrão
  return 'notes';
}

function mapKindToFieldType(kind: string): string {
  const mapping: Record<string, string> = {
    'short_text': 'text',
    'long_text': 'text',
    'email': 'email',
    'phone_number': 'phone',
    'number': 'number',
    'yes_no': 'boolean',
    'boolean': 'boolean',
    'dropdown': 'select',
    'multiple_choice': 'select'
  };
  
  return mapping[kind] || 'text';
}
