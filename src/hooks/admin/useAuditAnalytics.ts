import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditAnalytics {
  trendsData: {
    date: string;
    events: number;
    high_risk: number;
    failures: number;
  }[];
  userActivity: {
    user_id: string;
    email: string;
    events_count: number;
    last_activity: string;
    risk_score: number;
  }[];
  riskAnalysis: {
    total_events: number;
    risk_distribution: Record<string, number>;
    trend_direction: 'up' | 'down' | 'stable';
    critical_alerts: number;
  };
  systemHealth: {
    avg_response_time: number;
    error_rate: number;
    uptime_percentage: number;
    security_score: number;
  };
  topIssues: {
    event_type: string;
    count: number;
    severity: string;
    trend: 'increasing' | 'decreasing' | 'stable';
  }[];
}

export const useAuditAnalytics = (dateRange: { from: string; to: string }) => {
  const [analytics, setAnalytics] = useState<AuditAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Buscar dados de tendências
      const { data: trendsData, error: trendsError } = await supabase
        .from('audit_logs')
        .select('created_at, risk_level, success, event_type')
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to)
        .order('created_at', { ascending: true });

      if (trendsError) throw trendsError;

      // Processar dados de tendências por dia
      const dailyTrends = (trendsData || []).reduce((acc, log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { events: 0, high_risk: 0, failures: 0 };
        }
        acc[date].events++;
        if (log.risk_level === 'high' || log.risk_level === 'critical') {
          acc[date].high_risk++;
        }
        if (!log.success) {
          acc[date].failures++;
        }
        return acc;
      }, {} as Record<string, any>);

      const trendsArray = Object.entries(dailyTrends).map(([date, data]) => ({
        date,
        ...data
      }));

      // Buscar atividade de usuários
      const { data: userActivityData, error: userError } = await supabase
        .from('audit_logs')
        .select(`
          user_id,
          created_at,
          risk_level,
          profiles!inner(email)
        `)
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to)
        .not('user_id', 'is', null);

      if (userError) throw userError;

      // Processar atividade de usuários
      const userStats = (userActivityData || []).reduce((acc, log) => {
        const userId = log.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            email: (log.profiles as any)?.email || 'N/A',
            events_count: 0,
            last_activity: log.created_at,
            risk_score: 0
          };
        }
        acc[userId].events_count++;
        if (new Date(log.created_at) > new Date(acc[userId].last_activity)) {
          acc[userId].last_activity = log.created_at;
        }
        if (log.risk_level === 'high') acc[userId].risk_score += 2;
        if (log.risk_level === 'critical') acc[userId].risk_score += 3;
        return acc;
      }, {} as Record<string, any>);

      // Buscar alertas críticos
      const { data: alertsData, error: alertsError } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false)
        .in('severity', ['high', 'critical']);

      if (alertsError) throw alertsError;

      // Análise de risco
      const riskDistribution = (trendsData || []).reduce((acc, log) => {
        acc[log.risk_level] = (acc[log.risk_level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Top issues
      const issueStats = (trendsData || []).reduce((acc, log) => {
        if (!log.success) {
          acc[log.event_type || 'unknown'] = (acc[log.event_type || 'unknown'] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topIssues = Object.entries(issueStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([event_type, count]) => ({
          event_type,
          count,
          severity: count > 10 ? 'high' : count > 5 ? 'medium' : 'low',
          trend: 'stable' as const
        }));

      const analytics: AuditAnalytics = {
        trendsData: trendsArray,
        userActivity: Object.values(userStats).slice(0, 10),
        riskAnalysis: {
          total_events: trendsData?.length || 0,
          risk_distribution: riskDistribution,
          trend_direction: 'stable',
          critical_alerts: alertsData?.length || 0
        },
        systemHealth: {
          avg_response_time: 150,
          error_rate: ((trendsData?.filter(l => !l.success).length || 0) / (trendsData?.length || 1)) * 100,
          uptime_percentage: 99.9,
          security_score: Math.max(0, 100 - (alertsData?.length || 0) * 5)
        },
        topIssues
      };

      setAnalytics(analytics);
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
      toast.error('Erro ao carregar analytics de auditoria');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange.from, dateRange.to]);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics
  };
};
