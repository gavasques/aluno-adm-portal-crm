
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCRMActions } from '@/contexts/CRMContext';
import { useQueryClient } from '@tanstack/react-query';
import { getCRMCacheManager, crmQueryKeys } from '@/services/crm/CRMCacheManager';
import { LeadWithContacts } from '@/types/crm.types';

interface UseCRMRealtimeProps {
  pipelineId?: string;
  onLeadUpdate?: (lead: LeadWithContacts) => void;
  onLeadMove?: (leadId: string, newColumnId: string) => void;
  onCommentAdded?: (leadId: string) => void;
  onContactUpdate?: (leadId: string) => void;
}

export const useCRMRealtime = ({
  pipelineId,
  onLeadUpdate,
  onLeadMove,
  onCommentAdded,
  onContactUpdate
}: UseCRMRealtimeProps = {}) => {
  const actions = useCRMActions();
  const queryClient = useQueryClient();
  const cacheManager = getCRMCacheManager(queryClient);
  const channelsRef = useRef<any[]>([]);

  // Cleanup channels on unmount
  const cleanupChannels = useCallback(() => {
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];
  }, []);

  // Handle lead changes
  const handleLeadChange = useCallback(async (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    console.log('🔄 [CRM_REALTIME] Lead change detected:', {
      eventType,
      leadId: newRecord?.id || oldRecord?.id,
      pipelineId: newRecord?.pipeline_id || oldRecord?.pipeline_id
    });

    try {
      switch (eventType) {
        case 'INSERT':
          if (newRecord && (!pipelineId || newRecord.pipeline_id === pipelineId)) {
            // Invalidar cache para recarregar com novo lead
            await cacheManager.invalidatePipelineData(newRecord.pipeline_id);
            actions.refreshData();
          }
          break;

        case 'UPDATE':
          if (newRecord && oldRecord) {
            const leadId = newRecord.id;
            
            // Detectar movimento entre colunas
            if (oldRecord.column_id !== newRecord.column_id) {
              console.log('🚀 [CRM_REALTIME] Lead moved:', {
                leadId,
                from: oldRecord.column_id,
                to: newRecord.column_id
              });
              
              // Update otimista local
              actions.moveLead(leadId, newRecord.column_id);
              
              // Invalidar cache relacionado
              await cacheManager.invalidateLeadMovement(
                leadId,
                oldRecord.column_id,
                newRecord.column_id,
                newRecord.pipeline_id
              );
              
              onLeadMove?.(leadId, newRecord.column_id);
            } else {
              // Atualização de dados do lead
              actions.updateLead(newRecord as LeadWithContacts);
              await cacheManager.invalidateLeadData(leadId);
              onLeadUpdate?.(newRecord as LeadWithContacts);
            }
          }
          break;

        case 'DELETE':
          if (oldRecord) {
            const leadId = oldRecord.id;
            actions.removeLead(leadId);
            await cacheManager.invalidateLeadData(leadId);
            await cacheManager.invalidatePipelineData(oldRecord.pipeline_id);
          }
          break;
      }
    } catch (error) {
      console.error('❌ [CRM_REALTIME] Erro ao processar mudança de lead:', error);
      actions.setConnectionStatus('disconnected');
    }
  }, [pipelineId, actions, cacheManager, onLeadUpdate, onLeadMove]);

  // Handle comments changes
  const handleCommentChange = useCallback(async (payload: any) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT' && newRecord) {
      console.log('💬 [CRM_REALTIME] New comment:', {
        leadId: newRecord.lead_id,
        commentId: newRecord.id
      });
      
      // Invalidar comments do lead
      await queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leadComments(newRecord.lead_id)
      });
      
      onCommentAdded?.(newRecord.lead_id);
    }
  }, [queryClient, onCommentAdded]);

  // Handle contacts changes
  const handleContactChange = useCallback(async (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    const leadId = newRecord?.lead_id || oldRecord?.lead_id;
    
    if (leadId) {
      console.log('📞 [CRM_REALTIME] Contact change:', {
        eventType,
        leadId,
        contactId: newRecord?.id || oldRecord?.id
      });
      
      // Invalidar contacts do lead
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: crmQueryKeys.leadContacts(leadId)
        }),
        queryClient.invalidateQueries({
          queryKey: crmQueryKeys.pendingContacts()
        }),
        cacheManager.invalidateLeadData(leadId)
      ]);
      
      onContactUpdate?.(leadId);
    }
  }, [queryClient, cacheManager, onContactUpdate]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!supabase) return;

    console.log('🔗 [CRM_REALTIME] Configurando subscriptions real-time...');
    actions.setConnectionStatus('reconnecting');

    try {
      // Subscription para leads
      const leadsChannel = supabase
        .channel('crm_leads_realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'crm_leads',
            ...(pipelineId && { filter: `pipeline_id=eq.${pipelineId}` })
          },
          handleLeadChange
        )
        .subscribe((status) => {
          console.log('📡 [CRM_REALTIME] Leads channel status:', status);
          if (status === 'SUBSCRIBED') {
            actions.setConnectionStatus('connected');
          }
        });

      // Subscription para comments
      const commentsChannel = supabase
        .channel('crm_comments_realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'crm_lead_comments'
          },
          handleCommentChange
        )
        .subscribe((status) => {
          console.log('📡 [CRM_REALTIME] Comments channel status:', status);
        });

      // Subscription para contacts
      const contactsChannel = supabase
        .channel('crm_contacts_realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'crm_lead_contacts'
          },
          handleContactChange
        )
        .subscribe((status) => {
          console.log('📡 [CRM_REALTIME] Contacts channel status:', status);
        });

      // Armazenar channels para cleanup
      channelsRef.current = [leadsChannel, commentsChannel, contactsChannel];

      console.log('✅ [CRM_REALTIME] Subscriptions configuradas com sucesso');

    } catch (error) {
      console.error('❌ [CRM_REALTIME] Erro ao configurar subscriptions:', error);
      actions.setConnectionStatus('disconnected');
    }

    // Cleanup on unmount or dependency change
    return cleanupChannels;
  }, [pipelineId, handleLeadChange, handleCommentChange, handleContactChange, actions, cleanupChannels]);

  // Connection status monitoring
  useEffect(() => {
    const checkConnection = () => {
      const isOnline = navigator.onLine;
      if (!isOnline) {
        actions.setConnectionStatus('disconnected');
      }
    };

    window.addEventListener('online', () => {
      console.log('🌐 [CRM_REALTIME] Connection restored');
      actions.setConnectionStatus('reconnecting');
    });

    window.addEventListener('offline', () => {
      console.log('🌐 [CRM_REALTIME] Connection lost');
      actions.setConnectionStatus('disconnected');
    });

    checkConnection();

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, [actions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupChannels();
    };
  }, [cleanupChannels]);

  return {
    cleanup: cleanupChannels
  };
};

// Hook específico para real-time de um lead
export const useLeadRealtime = (leadId: string) => {
  const queryClient = useQueryClient();
  const cacheManager = getCRMCacheManager(queryClient);

  return useCRMRealtime({
    onLeadUpdate: useCallback(async (lead: LeadWithContacts) => {
      if (lead.id === leadId) {
        // Update específico do lead
        queryClient.setQueryData(crmQueryKeys.leadDetail(leadId), lead);
        await cacheManager.prefetchLeadData(leadId);
      }
    }, [leadId, queryClient, cacheManager]),

    onCommentAdded: useCallback((commentLeadId: string) => {
      if (commentLeadId === leadId) {
        // Refresh comentários do lead
        queryClient.invalidateQueries({
          queryKey: crmQueryKeys.leadComments(leadId)
        });
      }
    }, [leadId, queryClient]),

    onContactUpdate: useCallback((contactLeadId: string) => {
      if (contactLeadId === leadId) {
        // Refresh contatos do lead
        queryClient.invalidateQueries({
          queryKey: crmQueryKeys.leadContacts(leadId)
        });
      }
    }, [leadId, queryClient])
  });
};
