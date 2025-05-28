
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  user_id?: string;
  title: string;
  description: string;
  metadata?: any;
  resolved: boolean;
  created_at: string;
}

export const useSecurityAlerts = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao buscar alertas:', error);
        return;
      }

      setAlerts(data || []);
      setUnreadCount(data?.filter(alert => !alert.resolved).length || 0);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ 
          resolved: true, 
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId);

      if (error) {
        console.error('Erro ao resolver alerta:', error);
        toast.error('Erro ao resolver alerta');
        return;
      }

      toast.success('Alerta marcado como resolvido');
      fetchAlerts();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao resolver alerta');
    }
  };

  // Escutar alertas em tempo real
  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel('security_alerts_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_alerts'
        },
        (payload) => {
          const newAlert = payload.new as SecurityAlert;
          setAlerts(prev => [newAlert, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Mostrar notificação para alertas críticos
          if (newAlert.severity === 'critical' || newAlert.severity === 'high') {
            toast.error(`Alerta de Segurança: ${newAlert.title}`, {
              duration: 10000,
              action: {
                label: 'Ver Detalhes',
                onClick: () => {
                  // Navegar para o dashboard de auditoria
                  window.location.href = '/admin/auditoria';
                }
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    alerts,
    unreadCount,
    loading,
    markAsResolved,
    refetch: fetchAlerts
  };
};
