
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from './useCRMReportsFilters';

export interface PipelineMetrics {
  pipeline_id: string;
  pipeline_name: string;
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
  avg_time_to_convert: number;
  columnBreakdown: Array<{
    columnName: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}

export interface ResponsibleMetrics {
  responsible_id: string;
  responsible_name: string;
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
  avg_deal_size: number;
}

export interface LeadsByPeriod {
  period: string;
  new_leads: number;
  converted_leads: number;
  lost_leads: number;
  active_leads: number;
}

export interface CRMMetrics {
  total_leads: number;
  new_leads_this_month: number;
  conversion_rate: number;
  avg_deal_size: number;
  total_revenue: number;
  monthly_growth: number;
  leads_by_status: {
    aberto: number;
    ganho: number;
    perdido: number;
  };
}

export const useCRMReports = (dateRange: DateRange) => {
  const { data: metrics, isLoading: loading } = useQuery({
    queryKey: ['crm-reports-metrics', dateRange],
    queryFn: async (): Promise<CRMMetrics> => {
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

      // Leads por status
      const { data: leadsByStatus } = await supabase
        .from('crm_leads')
        .select('status')
        .in('status', ['aberto', 'ganho', 'perdido']);

      const statusCounts = {
        aberto: leadsByStatus?.filter(l => l.status === 'aberto').length || 0,
        ganho: leadsByStatus?.filter(l => l.status === 'ganho').length || 0,
        perdido: leadsByStatus?.filter(l => l.status === 'perdido').length || 0
      };

      // Calcular taxa de conversão
      const conversionRate = totalLeads && totalLeads > 0 ? 
        (statusCounts.ganho / totalLeads) * 100 : 0;

      // Crescimento mensal (comparar com mês anterior)
      const previousMonth = new Date(startOfMonth);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthEnd = new Date(startOfMonth);
      previousMonthEnd.setTime(previousMonthEnd.getTime() - 1);

      const { count: leadsPreviousMonth } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', previousMonth.toISOString())
        .lte('created_at', previousMonthEnd.toISOString());

      const monthlyGrowth = leadsPreviousMonth && leadsPreviousMonth > 0 ? 
        (((leadsThisMonth || 0) - leadsPreviousMonth) / leadsPreviousMonth) * 100 : 0;

      return {
        total_leads: totalLeads || 0,
        new_leads_this_month: leadsThisMonth || 0,
        conversion_rate: conversionRate,
        avg_deal_size: 3500, // Valor médio estimado
        total_revenue: statusCounts.ganho * 3500,
        monthly_growth: monthlyGrowth,
        leads_by_status: statusCounts
      };
    }
  });

  const { data: pipelineMetrics } = useQuery({
    queryKey: ['crm-pipeline-metrics', dateRange],
    queryFn: async (): Promise<PipelineMetrics[]> => {
      // Buscar pipelines e suas colunas
      const { data: pipelines } = await supabase
        .from('crm_pipelines')
        .select(`
          id,
          name,
          crm_pipeline_columns(id, name, color, sort_order)
        `)
        .eq('is_active', true);

      if (!pipelines) return [];

      const pipelineMetrics: PipelineMetrics[] = [];

      for (const pipeline of pipelines) {
        // Buscar leads do pipeline
        const { data: pipelineLeads } = await supabase
          .from('crm_leads')
          .select('status, column_id')
          .eq('pipeline_id', pipeline.id);

        if (!pipelineLeads) continue;

        const totalLeads = pipelineLeads.length;
        const convertedLeads = pipelineLeads.filter(l => l.status === 'ganho').length;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

        // Calcular distribuição por coluna
        const columnBreakdown = pipeline.crm_pipeline_columns.map(column => {
          const columnLeads = pipelineLeads.filter(l => l.column_id === column.id).length;
          return {
            columnName: column.name,
            count: columnLeads,
            percentage: totalLeads > 0 ? (columnLeads / totalLeads) * 100 : 0,
            color: column.color || '#3b82f6'
          };
        }).filter(cb => cb.count > 0);

        pipelineMetrics.push({
          pipeline_id: pipeline.id,
          pipeline_name: pipeline.name,
          total_leads: totalLeads,
          converted_leads: convertedLeads,
          conversion_rate: conversionRate,
          avg_time_to_convert: 15, // Estimativa
          columnBreakdown
        });
      }

      return pipelineMetrics;
    }
  });

  const { data: responsibleMetrics } = useQuery({
    queryKey: ['crm-responsible-metrics', dateRange],
    queryFn: async (): Promise<ResponsibleMetrics[]> => {
      // Buscar leads com responsáveis
      const { data: leadsWithResponsibles } = await supabase
        .from('crm_leads')
        .select(`
          status,
          responsible_id,
          responsible:profiles!crm_leads_responsible_id_fkey(id, name)
        `)
        .not('responsible_id', 'is', null);

      if (!leadsWithResponsibles) return [];

      // Agrupar por responsável
      const responsibleMap = new Map();
      
      leadsWithResponsibles.forEach(lead => {
        if (lead.responsible) {
          const id = lead.responsible.id;
          if (responsibleMap.has(id)) {
            const current = responsibleMap.get(id);
            responsibleMap.set(id, {
              ...current,
              total_leads: current.total_leads + 1,
              converted_leads: current.converted_leads + (lead.status === 'ganho' ? 1 : 0)
            });
          } else {
            responsibleMap.set(id, {
              responsible_id: id,
              responsible_name: lead.responsible.name || 'Sem nome',
              total_leads: 1,
              converted_leads: lead.status === 'ganho' ? 1 : 0,
              avg_deal_size: 3500
            });
          }
        }
      });

      // Calcular taxa de conversão
      return Array.from(responsibleMap.values()).map(responsible => ({
        ...responsible,
        conversion_rate: responsible.total_leads > 0 ? 
          (responsible.converted_leads / responsible.total_leads) * 100 : 0
      }));
    }
  });

  const { data: periodData } = useQuery({
    queryKey: ['crm-period-data', dateRange],
    queryFn: async (): Promise<LeadsByPeriod[]> => {
      const periods = [];
      const currentDate = new Date();
      
      // Últimos 3 meses
      for (let i = 2; i >= 0; i--) {
        const periodStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const periodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
        
        const { data: periodLeads } = await supabase
          .from('crm_leads')
          .select('status, created_at')
          .gte('created_at', periodStart.toISOString())
          .lte('created_at', periodEnd.toISOString());

        if (periodLeads) {
          periods.push({
            period: `${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, '0')}`,
            new_leads: periodLeads.length,
            converted_leads: periodLeads.filter(l => l.status === 'ganho').length,
            lost_leads: periodLeads.filter(l => l.status === 'perdido').length,
            active_leads: periodLeads.filter(l => l.status === 'aberto').length
          });
        }
      }

      return periods;
    }
  });

  return {
    metrics,
    pipelineMetrics,
    responsibleMetrics,
    periodData,
    loading
  };
};
