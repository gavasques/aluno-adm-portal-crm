
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToastManager } from '@/hooks/useToastManager';

interface UseCRMRealtimeProps {
  onLeadUpdate?: () => void;
  onCommentAdded?: () => void;
  onContactUpdate?: () => void;
  onNotificationReceived?: () => void;
}

export const useCRMRealtime = ({
  onLeadUpdate,
  onCommentAdded,
  onContactUpdate,
  onNotificationReceived
}: UseCRMRealtimeProps) => {
  const toast = useToastManager();

  const setupRealtimeSubscriptions = useCallback(() => {
    console.log('🔴 Setting up CRM realtime subscriptions');

    // Subscription para leads
    const leadsChannel = supabase
      .channel('crm_leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_leads'
        },
        (payload) => {
          console.log('🔴 Lead updated:', payload);
          onLeadUpdate?.();
          
          if (payload.eventType === 'INSERT') {
            toast.success('Novo lead criado');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Lead atualizado');
          }
        }
      )
      .subscribe();

    // Subscription para comentários
    const commentsChannel = supabase
      .channel('crm_comments_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'crm_lead_comments'
        },
        (payload) => {
          console.log('🔴 New comment:', payload);
          onCommentAdded?.();
          toast.info('Novo comentário adicionado');
        }
      )
      .subscribe();

    // Subscription para contatos
    const contactsChannel = supabase
      .channel('crm_contacts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_lead_contacts'
        },
        (payload) => {
          console.log('🔴 Contact updated:', payload);
          onContactUpdate?.();
          
          if (payload.eventType === 'INSERT') {
            toast.success('Contato agendado');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Status do contato atualizado');
          }
        }
      )
      .subscribe();

    // Subscription para notificações
    const notificationsChannel = supabase
      .channel('crm_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'crm_notifications'
        },
        (payload) => {
          console.log('🔴 New notification:', payload);
          onNotificationReceived?.();
          
          const notification = payload.new as any;
          if (notification?.title) {
            toast.info(notification.title);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔴 Cleaning up CRM realtime subscriptions');
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [onLeadUpdate, onCommentAdded, onContactUpdate, onNotificationReceived, toast]);

  useEffect(() => {
    const cleanup = setupRealtimeSubscriptions();
    return cleanup;
  }, [setupRealtimeSubscriptions]);

  return {
    setupRealtimeSubscriptions
  };
};
