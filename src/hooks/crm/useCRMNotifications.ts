
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToastManager } from '@/hooks/useToastManager';
import { CRMNotification } from '@/types/crm.types';
import { useDebouncedCallback } from 'use-debounce';

export const useCRMNotifications = () => {
  const { user } = useAuth();
  const toast = useToastManager();
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isFetchingRef = useRef(false);
  const mountedRef = useRef(true);

  // Debounced fetch para evitar loops
  const debouncedFetch = useDebouncedCallback(async () => {
    if (!user || isFetchingRef.current || !mountedRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);

      console.log('🔔 Fetching notifications for user:', user.id);

      const { data, error } = await supabase
        .from('crm_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (!mountedRef.current) return;

      const typedNotifications: CRMNotification[] = (data || []).map(item => ({
        ...item,
        type: item.type as CRMNotification['type']
      }));

      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.read).length);
      
      console.log('🔔 Notifications loaded:', typedNotifications.length);
    } catch (error) {
      console.error('Erro ao buscar notificações CRM:', error);
      if (mountedRef.current) {
        toast.error('Erro ao carregar notificações');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, 1000);

  const fetchNotifications = useCallback(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('crm_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      toast.error('Erro ao marcar notificação como lida');
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('crm_notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);

      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      toast.error('Erro ao marcar todas as notificações como lidas');
    }
  }, [user, toast]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('crm_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );

      toast.success('Notificação removida');
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
      toast.error('Erro ao remover notificação');
    }
  }, [toast]);

  // Setup inicial e cleanup
  useEffect(() => {
    mountedRef.current = true;
    
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Buscar notificações iniciais
    fetchNotifications();

    // Cleanup anterior
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Subscribe to real-time notifications apenas uma vez com debounce
    const channel = supabase
      .channel(`crm_notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔔 Notification event:', payload);
          // Usar debounce para evitar múltiplas chamadas
          if (mountedRef.current) {
            debouncedFetch();
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]); // Só depende do user.id

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};
