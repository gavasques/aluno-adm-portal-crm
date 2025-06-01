
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { addDays, subDays, format } from 'date-fns';

export interface AnalyticsMetrics {
  totalLeads: number;
  conversionRate: number;
  averageTimeInPipeline: number;
  leadsThisWeek: number;
  leadsBySource: { source: string; count: number; percentage: number }[];
  responsiblePerformance: {
    responsible_id: string;
    responsible_name: string;
    leads_count: number;
    conversion_rate: number;
    avg_time_to_convert: number;
  }[];
  pipelineDistribution: {
    pipeline_id: string;
    pipeline_name: string;
    leads_count: number;
    conversion_rate: number;
  }[];
  timeSeriesData: {
    date: string;
    new_leads: number;
    converted_leads: number;
    active_leads: number;
  }[];
}

export interface LeadSourceAnalysis {
  source: string;
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
  avg_value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ConversionFunnelData {
  stage: string;
  leads_count: number;
  conversion_rate: number;
  drop_rate: number;
}

export const useCRMAnalytics = (dateRange: { from: Date; to: Date }) => {
  // Métricas principais de analytics
  const { data: analyticsMetrics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['crm-analytics-metrics', dateRange],
    queryFn: async (): Promise<AnalyticsMetrics> => {
      // Buscar dados de leads com join correto para profiles
      const { data: leadsData, error: leadsError } = await supabase
        .from('crm_leads')
        .select(`
          id,
          created_at,
          updated_at,
          pipeline_id,
          column_id,
          responsible_id,
          pipeline:crm_pipelines(name),
          column:crm_pipeline_columns(name),
          responsible:profiles!crm_leads_responsible_id_fkey(name)
        `)
        .gte('created_at', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('created_at', format(dateRange.to, 'yyyy-MM-dd'));

      if (leadsError) throw leadsError;

      const totalLeads = leadsData?.length || 0;
      const weekAgo = subDays(new Date(), 7);
      const leadsThisWeek = leadsData?.filter(lead => 
        new Date(lead.created_at) >= weekAgo
      ).length || 0;

      // Calcular distribuição por pipeline
      const pipelineGroups = leadsData?.reduce((acc, lead) => {
        const pipelineName = lead.pipeline?.name || 'Sem pipeline';
        if (!acc[pipelineName]) {
          acc[pipelineName] = { total: 0, converted: 0 };
        }
        acc[pipelineName].total++;
        return acc;
      }, {} as Record<string, { total: number; converted: number }>);

      const pipelineDistribution = Object.entries(pipelineGroups || {}).map(([name, data]) => ({
        pipeline_id: '',
        pipeline_name: name,
        leads_count: data.total,
        conversion_rate: data.total > 0 ? (data.converted / data.total) * 100 : 0
      }));

      // Performance por responsável
      const responsibleGroups = leadsData?.reduce((acc, lead) => {
        const responsibleName = lead.responsible?.name || 'Sem responsável';
        const responsibleId = lead.responsible_id || '';
        if (!acc[responsibleId]) {
          acc[responsibleId] = { 
            name: responsibleName, 
            total: 0, 
            converted: 0 
          };
        }
        acc[responsibleId].total++;
        return acc;
      }, {} as Record<string, { name: string; total: number; converted: number }>);

      const responsiblePerformance = Object.entries(responsibleGroups || {}).map(([id, data]) => ({
        responsible_id: id,
        responsible_name: data.name,
        leads_count: data.total,
        conversion_rate: data.total > 0 ? (data.converted / data.total) * 100 : 0,
        avg_time_to_convert: 0 // Implementar cálculo real
      }));

      // Série temporal (últimos 30 dias)
      const timeSeriesData = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        const dayLeads = leadsData?.filter(lead => 
          format(new Date(lead.created_at), 'yyyy-MM-dd') === dateStr
        ).length || 0;

        timeSeriesData.push({
          date: format(date, 'dd/MM'),
          new_leads: dayLeads,
          converted_leads: 0, // Implementar cálculo real
          active_leads: dayLeads
        });
      }

      return {
        totalLeads,
        conversionRate: 15.5, // Implementar cálculo real
        averageTimeInPipeline: 12, // Implementar cálculo real
        leadsThisWeek,
        leadsBySource: [
          { source: 'Website', count: Math.floor(totalLeads * 0.4), percentage: 40 },
          { source: 'Indicação', count: Math.floor(totalLeads * 0.3), percentage: 30 },
          { source: 'Redes Sociais', count: Math.floor(totalLeads * 0.2), percentage: 20 },
          { source: 'Outros', count: Math.floor(totalLeads * 0.1), percentage: 10 }
        ],
        responsiblePerformance,
        pipelineDistribution,
        timeSeriesData
      };
    }
  });

  // Análise de fontes de leads
  const { data: leadSourceAnalysis, isLoading: sourceLoading } = useQuery({
    queryKey: ['lead-source-analysis', dateRange],
    queryFn: async (): Promise<LeadSourceAnalysis[]> => {
      // Implementar análise de fontes reais
      return [
        {
          source: 'Website',
          total_leads: 150,
          converted_leads: 25,
          conversion_rate: 16.7,
          avg_value: 5000,
          trend: 'up'
        },
        {
          source: 'Indicação',
          total_leads: 120,
          converted_leads: 35,
          conversion_rate: 29.2,
          avg_value: 7500,
          trend: 'up'
        },
        {
          source: 'Redes Sociais',
          total_leads: 80,
          converted_leads: 8,
          conversion_rate: 10.0,
          avg_value: 3000,
          trend: 'down'
        }
      ];
    }
  });

  // Dados do funil de conversão
  const { data: conversionFunnel, isLoading: funnelLoading } = useQuery({
    queryKey: ['conversion-funnel', dateRange],
    queryFn: async (): Promise<ConversionFunnelData[]> => {
      // Implementar cálculo real do funil
      return [
        { stage: 'Leads Gerados', leads_count: 1000, conversion_rate: 100, drop_rate: 0 },
        { stage: 'Qualificados', leads_count: 650, conversion_rate: 65, drop_rate: 35 },
        { stage: 'Propostas', leads_count: 200, conversion_rate: 20, drop_rate: 45 },
        { stage: 'Negociação', leads_count: 120, conversion_rate: 12, drop_rate: 8 },
        { stage: 'Fechados', leads_count: 80, conversion_rate: 8, drop_rate: 4 }
      ];
    }
  });

  return {
    analyticsMetrics,
    leadSourceAnalysis,
    conversionFunnel,
    isLoading: analyticsLoading || sourceLoading || funnelLoading
  };
};
