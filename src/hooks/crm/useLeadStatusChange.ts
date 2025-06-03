
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeadStatus } from '@/types/crm.types';
import { toast } from 'sonner';

interface StatusChangeParams {
  leadId: string;
  status: LeadStatus;
  reason?: string;
  lossReasonId?: string;
}

export const useLeadStatusChange = () => {
  const queryClient = useQueryClient();

  const changeStatus = useCallback(async ({ leadId, status, reason, lossReasonId }: StatusChangeParams) => {
    const operationId = `status_change_${leadId}_${Date.now()}`;
    console.log(`🔄 [STATUS_CHANGE_${operationId}] Alterando status:`, {
      leadId,
      newStatus: status,
      reason,
      lossReasonId
    });

    try {
      const updateData: any = {
        status,
        status_changed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.status_reason = reason;
      }

      if (lossReasonId) {
        updateData.loss_reason_id = lossReasonId;
      }

      const { data: updatedLead, error } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId)
        .select('id, name, status')
        .single();

      if (error) {
        console.error(`❌ [STATUS_CHANGE_${operationId}] Erro no banco:`, error);
        throw new Error(`Erro ao alterar status: ${error.message}`);
      }

      console.log(`✅ [STATUS_CHANGE_${operationId}] Status alterado com sucesso:`, {
        leadId: updatedLead.id,
        newStatus: updatedLead.status
      });

      // Invalidar queries relacionadas
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['crm-lead-detail', leadId] }),
        queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] }),
        queryClient.invalidateQueries({ queryKey: ['optimized-crm-leads'] }),
        queryClient.invalidateQueries({ queryKey: ['crm-leads'] })
      ]);

      toast.success(`Status alterado para "${status}"`);

    } catch (error) {
      console.error(`❌ [STATUS_CHANGE_${operationId}] Erro:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao alterar status: ${errorMessage}`);
      throw error;
    }
  }, [queryClient]);

  return { changeStatus };
};
