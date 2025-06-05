
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCRMContactAutoSync = () => {
  useEffect(() => {
    console.log('🔄 [AUTO_SYNC] Configurando sincronização automática de contatos...');

    // Listener para mudanças na tabela de contatos
    const contactsChannel = supabase
      .channel('contacts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_lead_contacts'
        },
        async (payload) => {
          console.log('📡 [AUTO_SYNC] Mudança detectada em contatos:', payload);
          
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          // Identificar o lead afetado
          const leadId = (newRecord as any)?.lead_id || (oldRecord as any)?.lead_id;
          if (!leadId) return;

          try {
            // Buscar o próximo contato pendente para este lead
            const { data: nextContact } = await supabase
              .from('crm_lead_contacts')
              .select('contact_date')
              .eq('lead_id', leadId)
              .eq('status', 'pending')
              .order('contact_date', { ascending: true })
              .limit(1)
              .maybeSingle();

            // Atualizar o scheduled_contact_date no lead
            const { error } = await supabase
              .from('crm_leads')
              .update({ 
                scheduled_contact_date: nextContact?.contact_date || null,
                updated_at: new Date().toISOString()
              })
              .eq('id', leadId);

            if (error) {
              console.error('❌ [AUTO_SYNC] Erro ao sincronizar lead:', error);
            } else {
              console.log('✅ [AUTO_SYNC] Lead sincronizado automaticamente:', leadId);
            }
          } catch (err) {
            console.error('❌ [AUTO_SYNC] Erro na sincronização automática:', err);
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      console.log('🔄 [AUTO_SYNC] Removendo listeners de sincronização...');
      supabase.removeChannel(contactsChannel);
    };
  }, []);
};
