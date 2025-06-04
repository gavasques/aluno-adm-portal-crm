
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

    // Leads convertidos (ganho)
    const { count: convertedLeads } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ganho');

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

    // Top performers - buscar responsáveis com mais leads e suas conversões
    const { data: topPerformersData } = await supabase
      .from('crm_leads')
      .select(`
        responsible_id,
        status,
        responsible:profiles!crm_leads_responsible_id_fkey(id, name)
      `)
      .not('responsible_id', 'is', null);

    // Processar top performers
    const performersMap = new Map();
    topPerformersData?.forEach(lead => {
      if (lead.responsible) {
        const id = lead.responsible.id;
        if (performersMap.has(id)) {
          const current = performersMap.get(id);
          performersMap.set(id, {
            ...current,
            leadsCount: current.leadsCount + 1,
            convertedCount: current.convertedCount + (lead.status === 'ganho' ? 1 : 0)
          });
        } else {
          performersMap.set(id, {
            id: lead.responsible.id,
            name: lead.responsible.name || 'Sem nome',
            leadsCount: 1,
            convertedCount: lead.status === 'ganho' ? 1 : 0
          });
        }
      }
    });

    const topPerformers = Array.from(performersMap.values())
      .map(performer => ({
        ...performer,
        conversionRate: performer.leadsCount > 0 ? 
          (performer.convertedCount / performer.leadsCount) * 100 : 0
      }))
      .sort((a, b) => b.leadsCount - a.leadsCount)
      .slice(0, 5);

    // Calcular tempo médio de resposta (simplificado)
    const { data: contactsWithTimes } = await supabase
      .from('crm_lead_contacts')
      .select('created_at, contact_date')
      .eq('status', 'completed')
      .limit(100);

    let averageResponseTime = 0;
    if (contactsWithTimes && contactsWithTimes.length > 0) {
      const totalHours = contactsWithTimes.reduce((sum, contact) => {
        const created = new Date(contact.created_at);
        const contacted = new Date(contact.contact_date);
        const hoursDiff = (contacted.getTime() - created.getTime()) / (1000 * 60 * 60);
        return sum + Math.max(0, hoursDiff);
      }, 0);
      averageResponseTime = Math.round(totalHours / contactsWithTimes.length);
    }

    return {
      totalLeads: totalLeads || 0,
      leadsThisMonth: leadsThisMonth || 0,
      conversionRate: totalLeads && totalLeads > 0 ? 
        ((convertedLeads || 0) / totalLeads) * 100 : 0,
      averageResponseTime,
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
