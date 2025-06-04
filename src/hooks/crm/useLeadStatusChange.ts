
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeadStatus } from '@/types/crm.types';
import { toast } from 'sonner';

export const useLeadStatusChange = () => {
  const queryClient = useQueryClient();

  const changeStatusMutation = useMutation({
    mutationFn: async ({ 
      leadId, 
      status, 
      reason,
      lossReasonId 
    }: { 
      leadId: string; 
      status: LeadStatus; 
      reason?: string;
      lossReasonId?: string;
    }) => {
      const updateData: any = {
        status,
        status_changed_at: new Date().toISOString(),
        status_changed_by: (await supabase.auth.getUser()).data.user?.id
      };

      if (reason) {
        updateData.status_reason = reason;
      }

      if (lossReasonId) {
        updateData.loss_reason_id = lossReasonId;
      }

      const { error } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId);

      if (error) throw error;

      return { leadId, status, reason, lossReasonId };
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas a CRM para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-leads-with-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-analytics-metrics'] });
    },
    onError: (error) => {
      console.error('Erro ao alterar status do lead:', error);
      toast.error('Erro ao alterar status do lead');
    }
  });

  return {
    changeStatus: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending
  };
};
