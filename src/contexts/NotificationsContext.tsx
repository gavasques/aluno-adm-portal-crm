
import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) {
      console.log('🔔 [Context] No user found, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      console.log('🔔 [Context] Fetching notifications for user:', user.id);
      
      const { data: securityAlerts, error: securityError } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (securityError) {
        console.error('🔔 [Context] Erro ao buscar alertas de segurança:', securityError);
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      console.log('🔔 [Context] Security alerts found:', securityAlerts?.length || 0);

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
      
      console.log('🔔 [Context] Total notifications:', allNotifications.length);
      console.log('🔔 [Context] Unread notifications:', unreadNotifications.length);
      
      setNotifications(allNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('🔔 [Context] Erro ao buscar notificações:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔔 [Context] NotificationsProvider effect triggered, user:', user?.id || 'none');
    fetchNotifications();

    // Criar apenas UMA subscription para toda a aplicação
    const channel = supabase
      .channel('notifications_realtime_global')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_alerts'
        },
        (payload) => {
          console.log('🔔 [Context] Real-time security alert update:', payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      console.log('🔔 [Context] Cleaning up notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    console.log('🔔 [Context] Marking notification as read:', notificationId);
    
    await supabase
      .from('security_alerts')
      .update({ resolved: true, resolved_by: user?.id })
      .eq('id', notificationId);

    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    console.log('🔔 [Context] Marking all notifications as read');
    
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
    console.log('🔔 [Context] Notifications state update:', {
      notificationsCount: notifications.length,
      unreadCount,
      loading,
      userId: user?.id
    });
  }, [notifications, unreadCount, loading, user]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
