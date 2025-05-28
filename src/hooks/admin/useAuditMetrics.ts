
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditMetrics {
  totalLogs: number;
  todayLogs: number;
  highRiskEvents: number;
  failedEvents: number;
  uniqueUsers: number;
  unresolvedAlerts: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  categoryDistribution: {
    authentication: number;
    data_management: number;
    user_activity: number;
    security: number;
    system: number;
  };
}

export const useAuditMetrics = () => {
  const [metrics, setMetrics] = useState<AuditMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Buscar todos os logs
      const { data: allLogs, error: logsError } = await supabase
        .from('audit_logs')
        .select('*');

      if (logsError) {
        console.error('Erro ao buscar logs:', logsError);
        toast.error('Erro ao carregar métricas de auditoria');
        return;
      }

      // Buscar alertas não resolvidos
      const { data: alerts, error: alertsError } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false);

      if (alertsError) {
        console.error('Erro ao buscar alertas:', alertsError);
      }

      const logs = allLogs || [];
      const todayLogs = logs.filter(log => 
        new Date(log.created_at) >= today
      );

      // Calcular métricas
      const riskDistribution = logs.reduce((acc, log) => {
        acc[log.risk_level as keyof typeof acc] = (acc[log.risk_level as keyof typeof acc] || 0) + 1;
        return acc;
      }, { low: 0, medium: 0, high: 0, critical: 0 });

      const categoryDistribution = logs.reduce((acc, log) => {
        const category = log.event_category as keyof typeof acc;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, { authentication: 0, data_management: 0, user_activity: 0, security: 0, system: 0 });

      const metrics: AuditMetrics = {
        totalLogs: logs.length,
        todayLogs: todayLogs.length,
        highRiskEvents: logs.filter(log => 
          log.risk_level === 'high' || log.risk_level === 'critical'
        ).length,
        failedEvents: logs.filter(log => !log.success).length,
        uniqueUsers: new Set(logs.map(log => log.user_id).filter(Boolean)).size,
        unresolvedAlerts: alerts?.length || 0,
        riskDistribution,
        categoryDistribution
      };

      setMetrics(metrics);
    } catch (error) {
      console.error('Erro ao calcular métricas:', error);
      toast.error('Erro ao calcular métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    refetch: fetchMetrics
  };
};
