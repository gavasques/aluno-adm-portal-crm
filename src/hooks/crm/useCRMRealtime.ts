
import { useEffect, useCallback, useRef } from 'react';
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
  const channelsRef = useRef<any[]>([]);
  const isSetupRef = useRef(false);

  const cleanupChannels = useCallback(() => {
    console.log('🧹 Cleaning up CRM realtime channels');
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
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
            if (onLeadUpdate) {
              onLeadUpdate();
            }
            
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
            if (onCommentAdded) {
              onCommentAdded();
            }
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
            if (onContactUpdate) {
              onContactUpdate();
            }
            
            if (payload.eventType === 'INSERT') {
              toast.success('Contato agendado');
            } else if (payload.eventType === 'UPDATE') {
              toast.info('Status do contato atualizado');
            }
          }
        )
        .subscribe();

      channelsRef.current = [leadsChannel, commentsChannel, contactsChannel];

      return cleanupChannels;
    } catch (error) {
      console.error('❌ Error setting up CRM realtime:', error);
      isSetupRef.current = false;
      return cleanupChannels;
    }
  }, [onLeadUpdate, onCommentAdded, onContactUpdate, toast, cleanupChannels]);

  useEffect(() => {
    const cleanup = setupRealtimeSubscriptions();
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [setupRealtimeSubscriptions]);

  return {
    setupRealtimeSubscriptions,
    cleanup: cleanupChannels
  };
};
