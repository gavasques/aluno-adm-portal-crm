
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToastManager } from '@/hooks/useToastManager';
import { useDebouncedCallback } from 'use-debounce';

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
  const channelsRef = useRef<any[]>([]);
  const isSetupRef = useRef(false);
  const mountedRef = useRef(true);

  // Debounced callbacks para evitar múltiplas chamadas
  const debouncedLeadUpdate = useDebouncedCallback(() => {
    if (mountedRef.current && onLeadUpdate) {
      onLeadUpdate();
    }
  }, 1000);

  const debouncedCommentAdded = useDebouncedCallback(() => {
    if (mountedRef.current && onCommentAdded) {
      onCommentAdded();
    }
  }, 500);

  const debouncedContactUpdate = useDebouncedCallback(() => {
    if (mountedRef.current && onContactUpdate) {
      onContactUpdate();
    }
  }, 1000);

  const debouncedNotificationReceived = useDebouncedCallback(() => {
    if (mountedRef.current && onNotificationReceived) {
      onNotificationReceived();
    }
  }, 500);

  const cleanupChannels = useCallback(() => {
    console.log('🧹 Cleaning up CRM realtime channels');
    channelsRef.current.forEach(channel => {
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      }
    });
    channelsRef.current = [];
    isSetupRef.current = false;
  }, []);

  const setupRealtimeSubscriptions = useCallback(() => {
    if (isSetupRef.current) {
      console.log('🔄 CRM realtime already setup, skipping');
      return cleanupChannels;
    }

    console.log('🔴 Setting up CRM realtime subscriptions');
    isSetupRef.current = true;

    try {
      const channels = [];

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
            
            debouncedLeadUpdate();
            
            if (payload.eventType === 'INSERT') {
              toast.success('Novo lead criado');
            } else if (payload.eventType === 'UPDATE') {
              toast.info('Lead atualizado');
            }
          }
        )
        .subscribe();

      channels.push(leadsChannel);

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
            debouncedCommentAdded();
            toast.info('Novo comentário adicionado');
          }
        )
        .subscribe();

      channels.push(commentsChannel);

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
            
            debouncedContactUpdate();
            
            if (payload.eventType === 'INSERT') {
              toast.success('Contato agendado');
            } else if (payload.eventType === 'UPDATE') {
              toast.info('Status do contato atualizado');
            }
          }
        )
        .subscribe();

      channels.push(contactsChannel);

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
            debouncedNotificationReceived();
          }
        )
        .subscribe();

      channels.push(notificationsChannel);

      channelsRef.current = channels;

      return cleanupChannels;
    } catch (error) {
      console.error('❌ Error setting up CRM realtime:', error);
      isSetupRef.current = false;
      return cleanupChannels;
    }
  }, [
    debouncedLeadUpdate,
    debouncedCommentAdded,
    debouncedContactUpdate,
    debouncedNotificationReceived,
    toast,
    cleanupChannels
  ]);

  useEffect(() => {
    mountedRef.current = true;
    const cleanup = setupRealtimeSubscriptions();
    
    return () => {
      mountedRef.current = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, []); // Dependências vazias para evitar loops

  return {
    setupRealtimeSubscriptions,
    cleanup: cleanupChannels
  };
};
