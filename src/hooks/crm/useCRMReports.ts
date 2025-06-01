
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, format } from 'date-fns';

export interface CRMMetrics {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageTimeToConvert: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
  monthlyGrowth: number;
}

export interface PipelineMetrics {
  pipelineName: string;
  totalLeads: number;
  columnBreakdown: {
    columnName: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export interface ResponsibleMetrics {
  responsibleName: string;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageResponseTime: number;
}

export interface LeadsByPeriod {
  period: string;
  leads: number;
  converted: number;
}

export const useCRMReports = (dateRange?: { from: Date; to: Date }) => {
  const defaultRange = {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  };
  
  const range = dateRange || defaultRange;

  const fetchCRMMetrics = async (): Promise<CRMMetrics> => {
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);

    // Total de leads
    const { count: totalLeads } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true });

    // Leads convertidos (assumindo que a última coluna do pipeline é conversão)
    const { data: pipelines } = await supabase
      .from('crm_pipelines')
      .select('id, crm_pipeline_columns(id, sort_order)')
      .eq('is_active', true);

    let convertedLeads = 0;
    if (pipelines && pipelines.length > 0) {
      // Pegar a última coluna de cada pipeline (maior sort_order)
      const lastColumns = pipelines.map(p => {
        const columns = p.crm_pipeline_columns || [];
        return columns.sort((a, b) => b.sort_order - a.sort_order)[0];
      }).filter(Boolean);

      if (lastColumns.length > 0) {
        const { count } = await supabase
          .from('crm_leads')
          .select('*', { count: 'exact', head: true })
          .in('column_id', lastColumns.map(c => c.id));
        convertedLeads = count || 0;
      }
    }

    // Leads do mês atual
    const { count: leadsThisMonth } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth(currentMonth).toISOString())
      .lte('created_at', endOfMonth(currentMonth).toISOString());

    // Leads do mês passado
    const { count: leadsLastMonth } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth(lastMonth).toISOString())
      .lte('created_at', endOfMonth(lastMonth).toISOString());

    const conversionRate = totalLeads ? (convertedLeads / totalLeads) * 100 : 0;
    const monthlyGrowth = leadsLastMonth ? ((leadsThisMonth || 0) - leadsLastMonth) / leadsLastMonth * 100 : 0;

    return {
      totalLeads: totalLeads || 0,
      convertedLeads,
      conversionRate,
      averageTimeToConvert: 0, // Implementar cálculo mais complexo se necessário
      leadsThisMonth: leadsThisMonth || 0,
      leadsLastMonth: leadsLastMonth || 0,
      monthlyGrowth
    };
  };

  const fetchPipelineMetrics = async (): Promise<PipelineMetrics[]> => {
    const { data: pipelines } = await supabase
      .from('crm_pipelines')
      .select(`
        id,
        name,
        crm_pipeline_columns(id, name, color),
        crm_leads(id, column_id)
      `)
      .eq('is_active', true);

    return (pipelines || []).map(pipeline => {
      const totalLeads = pipeline.crm_leads?.length || 0;
      const columns = pipeline.crm_pipeline_columns || [];
      
      const columnBreakdown = columns.map(column => {
        const count = pipeline.crm_leads?.filter(lead => lead.column_id === column.id).length || 0;
        return {
          columnName: column.name,
          count,
          percentage: totalLeads ? (count / totalLeads) * 100 : 0,
          color: column.color
        };
      });

      return {
        pipelineName: pipeline.name,
        totalLeads,
        columnBreakdown
      };
    });
  };

  const fetchResponsibleMetrics = async (): Promise<ResponsibleMetrics[]> => {
    const { data: leads } = await supabase
      .from('crm_leads')
      .select(`
        id,
        column_id,
        responsible_id,
        created_at,
        responsible:profiles!crm_leads_responsible_id_fkey(id, name)
      `)
      .not('responsible_id', 'is', null);

    // Agrupar por responsável
    const responsibleMap = new Map();
    
    (leads || []).forEach(lead => {
      const responsibleId = lead.responsible_id;
      const responsibleName = lead.responsible?.name || 'Sem nome';
      
      if (!responsibleMap.has(responsibleId)) {
        responsibleMap.set(responsibleId, {
          responsibleName,
          totalLeads: 0,
          convertedLeads: 0,
          leads: []
        });
      }
      
      const data = responsibleMap.get(responsibleId);
      data.totalLeads++;
      data.leads.push(lead);
    });

    return Array.from(responsibleMap.values()).map(data => ({
      responsibleName: data.responsibleName,
      totalLeads: data.totalLeads,
      convertedLeads: data.convertedLeads,
      conversionRate: data.totalLeads ? (data.convertedLeads / data.totalLeads) * 100 : 0,
      averageResponseTime: 0 // Implementar se necessário
    }));
  };

  const fetchLeadsByPeriod = async (): Promise<LeadsByPeriod[]> => {
    const { data: leads } = await supabase
      .from('crm_leads')
      .select('id, created_at, column_id')
      .gte('created_at', startOfYear(new Date()).toISOString())
      .order('created_at', { ascending: true });

    // Agrupar por mês
    const monthlyData = new Map();
    
    (leads || []).forEach(lead => {
      const month = format(new Date(lead.created_at), 'yyyy-MM');
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { leads: 0, converted: 0 });
      }
      
      const data = monthlyData.get(month);
      data.leads++;
      // Implementar lógica de conversão se necessário
    });

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      period: month,
      leads: data.leads,
      converted: data.converted
    }));
  };

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['crm-metrics', range],
    queryFn: fetchCRMMetrics,
    staleTime: 5 * 60 * 1000
  });

  const { data: pipelineMetrics, isLoading: pipelineLoading } = useQuery({
    queryKey: ['crm-pipeline-metrics', range],
    queryFn: fetchPipelineMetrics,
    staleTime: 5 * 60 * 1000
  });

  const { data: responsibleMetrics, isLoading: responsibleLoading } = useQuery({
    queryKey: ['crm-responsible-metrics', range],
    queryFn: fetchResponsibleMetrics,
    staleTime: 5 * 60 * 1000
  });

  const { data: periodData, isLoading: periodLoading } = useQuery({
    queryKey: ['crm-period-data'],
    queryFn: fetchLeadsByPeriod,
    staleTime: 5 * 60 * 1000
  });

  return {
    metrics,
    pipelineMetrics,
    responsibleMetrics,
    periodData,
    loading: metricsLoading || pipelineLoading || responsibleLoading || periodLoading
  };
};
