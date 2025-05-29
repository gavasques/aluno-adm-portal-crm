
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Notification {
  id: string;
  type: 'security' | 'system' | 'task' | 'mentoring';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) {
      console.log('🔔 No user found, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      console.log('🔔 Fetching notifications for user:', user.id);
      
      // Buscar alertas de segurança não resolvidos
      const { data: securityAlerts, error: securityError } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (securityError) {
        console.error('🔔 Erro ao buscar alertas de segurança:', securityError);
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      console.log('🔔 Security alerts found:', securityAlerts?.length || 0);

      // Converter alertas de segurança para formato de notificação
      const securityNotifications: Notification[] = (securityAlerts || []).map(alert => ({
        id: alert.id,
        type: 'security' as const,
        title: alert.title,
        description: alert.description,
        severity: alert.severity as 'low' | 'medium' | 'high' | 'critical',
        read: false,
        created_at: alert.created_at
      }));

      const allNotifications = [...securityNotifications];
      const unreadNotifications = allNotifications.filter(n => !n.read);
      
      console.log('🔔 Total notifications:', allNotifications.length);
      console.log('🔔 Unread notifications:', unreadNotifications.length);
      
      setNotifications(allNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('🔔 Erro ao buscar notificações:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔔 useNotifications effect triggered, user:', user?.id || 'none');
    fetchNotifications();

    // Escutar mudanças em tempo real nos alertas de segurança
    const channel = supabase
      .channel('notifications_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_alerts'
        },
        (payload) => {
          console.log('🔔 Real-time security alert update:', payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      console.log('🔔 Cleaning up notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    console.log('🔔 Marking notification as read:', notificationId);
    
    // Para alertas de segurança, marcar como resolvido
    await supabase
      .from('security_alerts')
      .update({ resolved: true, resolved_by: user?.id })
      .eq('id', notificationId);

    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    console.log('🔔 Marking all notifications as read');
    
    const securityAlertIds = notifications
      .filter(n => n.type === 'security')
      .map(n => n.id);

    if (securityAlertIds.length > 0) {
      await supabase
        .from('security_alerts')
        .update({ resolved: true, resolved_by: user?.id })
        .in('id', securityAlertIds);
    }

    await fetchNotifications();
  };

  // Log do estado atual para debug
  useEffect(() => {
    console.log('🔔 Notifications state update:', {
      notificationsCount: notifications.length,
      unreadCount,
      loading,
      userId: user?.id
    });
  }, [notifications, unreadCount, loading, user]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
