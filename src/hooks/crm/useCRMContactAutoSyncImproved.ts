
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useCRMContactAutoSyncImproved = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 [AUTO_SYNC_IMPROVED] Configurando sincronização automática aprimorada...');

    // Listener para mudanças na tabela de contatos
    const contactsChannel = supabase
      .channel('contacts-auto-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_lead_contacts'
        },
        async (payload) => {
          console.log('📡 [AUTO_SYNC_IMPROVED] Mudança detectada em contatos:', payload);
          
          const { eventType, new: newRecord, old: oldRecord } = payload;
          const leadId = (newRecord as any)?.lead_id || (oldRecord as any)?.lead_id;
          
          if (!leadId) return;

          try {
            // Invalidar queries relacionadas para forçar reload
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: ['crm-contact-inconsistencies'] }),
              queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] }),
              queryClient.invalidateQueries({ queryKey: ['crm-lead-contacts', leadId] }),
            ]);

            console.log('✅ [AUTO_SYNC_IMPROVED] Queries invalidadas para lead:', leadId);
            
            // Log da ação para auditoria
            console.log(`📊 [AUTO_SYNC_IMPROVED] Evento ${eventType} processado para lead ${leadId}`);
            
          } catch (err) {
            console.error('❌ [AUTO_SYNC_IMPROVED] Erro na sincronização automática:', err);
          }
        }
      )
      .subscribe();

    // Listener para mudanças diretamente nos leads
    const leadsChannel = supabase
      .channel('leads-auto-sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'crm_leads',
          filter: 'scheduled_contact_date=neq.null'
        },
        async (payload) => {
          console.log('📡 [AUTO_SYNC_IMPROVED] Mudança detectada em lead com contato agendado:', payload);
          
          const { new: newRecord } = payload;
          const leadId = (newRecord as any)?.id;
          
          if (!leadId) return;

          try {
            // Invalidar queries específicas
            await queryClient.invalidateQueries({ 
              queryKey: ['unified-crm-leads'],
              exact: false
            });

            console.log('✅ [AUTO_SYNC_IMPROVED] Lead atualizado via trigger:', leadId);
            
          } catch (err) {
            console.error('❌ [AUTO_SYNC_IMPROVED] Erro ao processar atualização de lead:', err);
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      console.log('🔄 [AUTO_SYNC_IMPROVED] Removendo listeners aprimorados...');
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(leadsChannel);
    };
  }, [queryClient]);

  // Função para verificação manual de inconsistências
  const checkInconsistencies = async () => {
    try {
      const { data, error } = await supabase.rpc('detect_contact_inconsistencies');
      
      if (error) {
        console.error('❌ [AUTO_SYNC_IMPROVED] Erro ao verificar inconsistências:', error);
        return [];
      }

      const inconsistencies = (data || []).filter((item: any) => item.inconsistent);
      console.log(`🔍 [AUTO_SYNC_IMPROVED] Verificação manual encontrou ${inconsistencies.length} inconsistências`);
      
      return inconsistencies;
    } catch (err) {
      console.error('❌ [AUTO_SYNC_IMPROVED] Erro na verificação manual:', err);
      return [];
    }
  };

  return {
    checkInconsistencies
  };
};
