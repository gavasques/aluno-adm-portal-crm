
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseCRMRealtimeProps {
  onLeadUpdate?: () => void;
  onCommentAdded?: () => void;
  onContactUpdate?: () => void;
}

export const useCRMRealtime = ({
  onLeadUpdate,
  onCommentAdded,
  onContactUpdate
}: UseCRMRealtimeProps) => {
  useEffect(() => {
    // Configurar subscriptions em tempo real para leads
    const leadsChannel = supabase
      .channel('crm_leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_leads'
        },
        () => {
          console.log('🔄 Lead atualizado via realtime');
          onLeadUpdate?.();
        }
      )
      .subscribe();

    // Configurar subscriptions para comentários
    const commentsChannel = supabase
      .channel('crm_comments_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'crm_lead_comments'
        },
        () => {
          console.log('🔄 Comentário adicionado via realtime');
          onCommentAdded?.();
        }
      )
      .subscribe();

    // Configurar subscriptions para contatos
    const contactsChannel = supabase
      .channel('crm_contacts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_lead_contacts'
        },
        () => {
          console.log('🔄 Contato atualizado via realtime');
          onContactUpdate?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(contactsChannel);
    };
  }, [onLeadUpdate, onCommentAdded, onContactUpdate]);
};
