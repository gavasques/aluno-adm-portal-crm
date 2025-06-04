
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StatusChangeParams {
  leadId: string;
  status: 'aberto' | 'ganho' | 'perdido';
  reason?: string;
  lossReasonId?: string;
}

export const useLeadStatusChange = () => {
  const queryClient = useQueryClient();

  const changeStatus = useCallback(async ({ leadId, status, reason, lossReasonId }: StatusChangeParams) => {
    const operationId = `status_change_${leadId}_${Date.now()}`;
    console.log(`🔄 [STATUS_CHANGE_${operationId}] Iniciando alteração:`, {
      leadId,
      status,
      reason,
      lossReasonId
    });

    if (!leadId || !status) {
      throw new Error('Parâmetros inválidos para alteração de status');
    }

    try {
      // Preparar dados de atualização
      const updateData: any = {
        status,
        status_changed_at: new Date().toISOString(),
        status_changed_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.status_reason = reason;
      }

      if (status === 'perdido' && lossReasonId) {
        updateData.loss_reason_id = lossReasonId;
      }

      console.log(`💾 [STATUS_CHANGE_${operationId}] Atualizando no banco:`, updateData);

      // Atualizar no banco
      const { data: updatedLead, error } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId)
        .select('id, name, status, status_reason')
        .single();

      if (error) {
        console.error(`❌ [STATUS_CHANGE_${operationId}] Erro no banco:`, error);
        throw new Error(`Erro ao atualizar status: ${error.message}`);
      }

      if (!updatedLead) {
        throw new Error('Nenhum lead foi atualizado');
      }

      console.log(`✅ [STATUS_CHANGE_${operationId}] Status alterado com sucesso:`, {
        leadId: updatedLead.id,
        newStatus: updatedLead.status
      });

      // Invalidar queries relacionadas
      const queryKeys = [
        ['unified-crm-leads'],
        ['optimized-crm-leads'], 
        ['crm-leads'],
        ['crm-lead-detail', leadId]
      ];

      queryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      toast.success(`Status do lead "${updatedLead.name}" alterado para "${status}"`);

    } catch (error) {
      console.error(`❌ [STATUS_CHANGE_${operationId}] Erro:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao alterar status: ${errorMessage}`);
      
      throw error;
    }
  }, [queryClient]);

  return { changeStatus };
};
