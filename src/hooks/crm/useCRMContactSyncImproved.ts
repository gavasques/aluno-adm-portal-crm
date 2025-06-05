
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactInconsistency {
  lead_id: string;
  lead_name: string;
  scheduled_date: string | null;
  actual_next_contact: string | null;
  inconsistent: boolean;
}

export const useCRMContactSyncImproved = () => {
  const queryClient = useQueryClient();

  // Query para detectar inconsistências usando a nova função SQL
  const { data: inconsistencies = [], isLoading } = useQuery({
    queryKey: ['crm-contact-inconsistencies'],
    queryFn: async () => {
      console.log('🔍 [CONTACT_SYNC_IMPROVED] Detectando inconsistências...');
      
      const { data, error } = await supabase.rpc('detect_contact_inconsistencies');
      
      if (error) {
        console.error('❌ [CONTACT_SYNC_IMPROVED] Erro ao detectar inconsistências:', error);
        throw error;
      }

      const inconsistentData = (data || []).filter((item: ContactInconsistency) => item.inconsistent);
      
      console.log(`✅ [CONTACT_SYNC_IMPROVED] Encontradas ${inconsistentData.length} inconsistências`);
      return inconsistentData;
    },
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // 1 minuto
  });

  // Mutation para sincronizar contatos manualmente
  const syncMutation = useMutation({
    mutationFn: async (leadIds?: string[]) => {
      console.log('🔄 [CONTACT_SYNC_IMPROVED] Iniciando sincronização manual...');
      
      let leadsToSync = inconsistencies;
      
      if (leadIds && leadIds.length > 0) {
        leadsToSync = inconsistencies.filter(item => leadIds.includes(item.lead_id));
      }

      if (leadsToSync.length === 0) {
        return { updated: 0, message: 'Nenhuma inconsistência encontrada para sincronizar' };
      }

      let updatedCount = 0;
      const errors = [];

      for (const item of leadsToSync) {
        try {
          // O trigger automático já deve cuidar da sincronização,
          // mas vamos forçar uma atualização para garantir
          const { error } = await supabase
            .from('crm_leads')
            .update({ 
              updated_at: new Date().toISOString()
            })
            .eq('id', item.lead_id);

          if (error) {
            errors.push(`Erro ao sincronizar lead ${item.lead_name}: ${error.message}`);
          } else {
            updatedCount++;
            console.log(`✅ [CONTACT_SYNC_IMPROVED] Lead ${item.lead_name} sincronizado`);
          }
        } catch (err) {
          errors.push(`Erro inesperado ao sincronizar lead ${item.lead_name}`);
        }
      }

      if (errors.length > 0) {
        console.error('❌ [CONTACT_SYNC_IMPROVED] Erros durante sincronização:', errors);
        throw new Error(`Alguns leads não foram sincronizados: ${errors.join(', ')}`);
      }

      return { 
        updated: updatedCount, 
        message: `${updatedCount} lead(s) sincronizado(s) com sucesso` 
      };
    },
    onSuccess: (result) => {
      toast.success(result.message);
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['crm-contact-inconsistencies'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-card-preferences'] });
    },
    onError: (error) => {
      console.error('❌ [CONTACT_SYNC_IMPROVED] Erro na sincronização:', error);
      toast.error(`Erro na sincronização: ${error.message}`);
    }
  });

  // Função para atualizar contatos vencidos
  const updateOverdueMutation = useMutation({
    mutationFn: async () => {
      console.log('🕐 [CONTACT_SYNC_IMPROVED] Atualizando contatos vencidos...');
      
      const { error } = await supabase.rpc('update_overdue_contacts');
      
      if (error) {
        throw error;
      }
      
      return { message: 'Contatos vencidos atualizados com sucesso' };
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['crm-contact-inconsistencies'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] });
    },
    onError: (error) => {
      console.error('❌ [CONTACT_SYNC_IMPROVED] Erro ao atualizar contatos vencidos:', error);
      toast.error(`Erro ao atualizar contatos vencidos: ${error.message}`);
    }
  });

  return {
    inconsistencies,
    isLoading,
    hasInconsistencies: inconsistencies.length > 0,
    syncAll: () => syncMutation.mutate(undefined),
    syncSpecific: (leadIds: string[]) => syncMutation.mutate(leadIds),
    updateOverdue: () => updateOverdueMutation.mutate(),
    isSyncing: syncMutation.isPending,
    isUpdatingOverdue: updateOverdueMutation.isPending
  };
};
