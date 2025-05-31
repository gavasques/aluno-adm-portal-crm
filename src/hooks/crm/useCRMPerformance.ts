
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  totalLeads: number;
  leadsThisMonth: number;
  conversionRate: number;
  averageResponseTime: number;
  contactsScheduled: number;
  contactsCompleted: number;
  overdueContacts: number;
  topPerformers: Array<{
    id: string;
    name: string;
    leadsCount: number;
    conversionRate: number;
  }>;
}

export const useCRMPerformance = () => {
  const fetchPerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Total de leads
    const { count: totalLeads } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true });

    // Leads deste mês
    const { count: leadsThisMonth } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    // Contatos agendados
    const { count: contactsScheduled } = await supabase
      .from('crm_lead_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Contatos realizados
    const { count: contactsCompleted } = await supabase
      .from('crm_lead_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Contatos em atraso
    const { count: overdueContacts } = await supabase
      .from('crm_lead_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'overdue');

    // Top performers
    const { data: topPerformersData } = await supabase
      .from('crm_leads')
      .select(`
        responsible_id,
        responsible:profiles!crm_leads_responsible_id_fkey(id, name)
      `)
      .not('responsible_id', 'is', null);

    // Processar top performers
    const performersMap = new Map();
    topPerformersData?.forEach(lead => {
      if (lead.responsible) {
        const id = lead.responsible.id;
        if (performersMap.has(id)) {
          performersMap.set(id, {
            ...performersMap.get(id),
            leadsCount: performersMap.get(id).leadsCount + 1
          });
        } else {
          performersMap.set(id, {
            id: lead.responsible.id,
            name: lead.responsible.name,
            leadsCount: 1,
            conversionRate: 0 // Calcular posteriormente
          });
        }
      }
    });

    const topPerformers = Array.from(performersMap.values())
      .sort((a, b) => b.leadsCount - a.leadsCount)
      .slice(0, 5);

    return {
      totalLeads: totalLeads || 0,
      leadsThisMonth: leadsThisMonth || 0,
      conversionRate: totalLeads ? ((contactsCompleted || 0) / totalLeads) * 100 : 0,
      averageResponseTime: 24, // Simulated - implementar cálculo real
      contactsScheduled: contactsScheduled || 0,
      contactsCompleted: contactsCompleted || 0,
      overdueContacts: overdueContacts || 0,
      topPerformers
    };
  }, []);

  const {
    data: metrics,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['crm-performance'],
    queryFn: fetchPerformanceMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30 * 60 * 1000, // 30 minutos
  });

  const performanceInsights = useMemo(() => {
    if (!metrics) return [];

    const insights = [];

    if (metrics.overdueContacts > 0) {
      insights.push({
        type: 'warning',
        title: 'Contatos em Atraso',
        description: `${metrics.overdueContacts} contato(s) estão em atraso`,
        action: 'Revisar contatos pendentes'
      });
    }

    if (metrics.conversionRate < 10) {
      insights.push({
        type: 'info',
        title: 'Taxa de Conversão Baixa',
        description: `Taxa atual: ${metrics.conversionRate.toFixed(1)}%`,
        action: 'Analisar estratégias de follow-up'
      });
    }

    if (metrics.leadsThisMonth > metrics.totalLeads * 0.3) {
      insights.push({
        type: 'success',
        title: 'Crescimento Forte',
        description: `${metrics.leadsThisMonth} novos leads este mês`,
        action: 'Manter estratégias atuais'
      });
    }

    return insights;
  }, [metrics]);

  return {
    metrics,
    insights: performanceInsights,
    isLoading,
    error,
    refetch
  };
};
