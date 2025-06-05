
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCRMContactSync = () => {
  const queryClient = useQueryClient();

  // Query para verificar leads com contatos pendentes mas sem scheduled_contact_date
  const { data: unsynced, isLoading } = useQuery({
    queryKey: ['crm-unsynced-contacts'],
    queryFn: async () => {
      console.log('🔍 [CONTACT_SYNC] Verificando leads com contatos não sincronizados...');
      
      // Buscar leads que têm contatos pendentes mas não têm scheduled_contact_date
      const { data: leadsWithoutScheduledDate, error: leadsError } = await supabase
        .from('crm_leads')
        .select('id, name, scheduled_contact_date')
        .is('scheduled_contact_date', null);

      if (leadsError) throw leadsError;

      if (!leadsWithoutScheduledDate || leadsWithoutScheduledDate.length === 0) {
        return [];
      }

      const leadIds = leadsWithoutScheduledDate.map(lead => lead.id);

      // Buscar contatos pendentes para esses leads
      const { data: pendingContacts, error: contactsError } = await supabase
        .from('crm_lead_contacts')
        .select('lead_id, contact_date')
        .in('lead_id', leadIds)
        .eq('status', 'pending')
        .order('contact_date', { ascending: true });

      if (contactsError) throw contactsError;

      // Mapear leads que precisam de sincronização
      const unsyncedLeads = leadsWithoutScheduledDate
        .map(lead => {
          const nextContact = pendingContacts?.find(contact => contact.lead_id === lead.id);
          return nextContact ? {
            leadId: lead.id,
            leadName: lead.name,
            nextContactDate: nextContact.contact_date
          } : null;
        })
        .filter(Boolean);

      console.log(`✅ [CONTACT_SYNC] Encontrados ${unsyncedLeads.length} leads para sincronizar`);
      return unsyncedLeads;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para sincronizar contatos
  const syncMutation = useMutation({
    mutationFn: async (leadIds?: string[]) => {
      console.log('🔄 [CONTACT_SYNC] Iniciando sincronização...');
      
      let leadsToSync = unsynced || [];
      
      // Se leadIds específicos foram fornecidos, filtrar apenas esses
      if (leadIds && leadIds.length > 0) {
        leadsToSync = leadsToSync.filter(item => leadIds.includes(item.leadId));
      }

      if (leadsToSync.length === 0) {
        return { updated: 0, message: 'Nenhum lead para sincronizar' };
      }

      let updatedCount = 0;
      const errors = [];

      for (const item of leadsToSync) {
        try {
          const { error } = await supabase
            .from('crm_leads')
            .update({ 
              scheduled_contact_date: item.nextContactDate,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.leadId);

          if (error) {
            errors.push(`Erro ao atualizar lead ${item.leadName}: ${error.message}`);
          } else {
            updatedCount++;
            console.log(`✅ [CONTACT_SYNC] Lead ${item.leadName} sincronizado`);
          }
        } catch (err) {
          errors.push(`Erro inesperado ao atualizar lead ${item.leadName}`);
        }
      }

      if (errors.length > 0) {
        console.error('❌ [CONTACT_SYNC] Erros durante sincronização:', errors);
        throw new Error(`Alguns leads não foram sincronizados: ${errors.join(', ')}`);
      }

      return { 
        updated: updatedCount, 
        message: `${updatedCount} lead(s) sincronizado(s) com sucesso` 
      };
    },
    onSuccess: (result) => {
      toast.success(result.message);
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['crm-unsynced-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-card-preferences'] });
    },
    onError: (error) => {
      console.error('❌ [CONTACT_SYNC] Erro na sincronização:', error);
      toast.error(`Erro na sincronização: ${error.message}`);
    }
  });

  return {
    unsynced: unsynced || [],
    isLoading,
    syncAll: () => syncMutation.mutate(undefined), // Corrigido: passando undefined explicitamente
    syncSpecific: (leadIds: string[]) => syncMutation.mutate(leadIds),
    isSyncing: syncMutation.isPending
  };
};
