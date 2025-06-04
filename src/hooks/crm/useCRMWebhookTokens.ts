
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMWebhookToken, CRMWebhookTokenInput, WebhookTokenAction } from '@/types/crm-webhook.types';

export const useCRMWebhookTokens = (pipelineId?: string) => {
  const queryClient = useQueryClient();

  // Buscar tokens de webhook
  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['crm-webhook-tokens', pipelineId],
    queryFn: async (): Promise<CRMWebhookToken[]> => {
      let query = supabase
        .from('crm_webhook_tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  // Buscar token ativo para um pipeline
  const getActiveToken = (targetPipelineId: string) => {
    return tokens.find(token => 
      token.pipeline_id === targetPipelineId && 
      token.is_active
    );
  };

  // Gerar novo token
  const generateToken = useMutation({
    mutationFn: async (input: CRMWebhookTokenInput) => {
      // Gerar token usando a função do banco
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_webhook_token');

      if (tokenError) throw tokenError;

      const { data, error } = await supabase
        .from('crm_webhook_tokens')
        .insert({
          ...input,
          token: tokenData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-tokens'] });
      toast.success('Token de webhook gerado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao gerar token:', error);
      toast.error('Erro ao gerar token de webhook');
    }
  });

  // Desativar token
  const deactivateToken = useMutation({
    mutationFn: async ({ tokenId, reason }: { tokenId: string; reason: string }) => {
      const { data, error } = await supabase
        .from('crm_webhook_tokens')
        .update({
          is_active: false,
          deactivated_at: new Date().toISOString(),
          deactivated_by: (await supabase.auth.getUser()).data.user?.id,
          reason
        })
        .eq('id', tokenId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-tokens'] });
      toast.success('Token desativado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao desativar token:', error);
      toast.error('Erro ao desativar token');
    }
  });

  // Renovar token (desativar atual e gerar novo)
  const renewToken = useMutation({
    mutationFn: async ({ pipelineId, reason }: { pipelineId: string; reason: string }) => {
      // Primeiro, desativar token atual se existir
      const activeToken = getActiveToken(pipelineId);
      if (activeToken) {
        await deactivateToken.mutateAsync({ tokenId: activeToken.id, reason });
      }

      // Gerar novo token
      return await generateToken.mutateAsync({ pipeline_id: pipelineId, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-webhook-tokens'] });
      toast.success('Token renovado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao renovar token:', error);
      toast.error('Erro ao renovar token');
    }
  });

  return {
    tokens,
    isLoading,
    getActiveToken,
    generateToken,
    deactivateToken,
    renewToken
  };
};
