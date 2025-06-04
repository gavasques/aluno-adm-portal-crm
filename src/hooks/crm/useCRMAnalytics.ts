
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CRMAnalyticsMetrics {
  totalLeads: number;
  leadsThisWeek: number;
  conversionRate: number;
  averageTimeInPipeline: number;
  timeSeriesData: Array<{
    date: string;
    new_leads: number;
    converted_leads: number;
    active_leads: number;
  }>;
  pipelineDistribution: Array<{
    pipeline_id: string;
    pipeline_name: string;
    leads_count: number;
    conversion_rate: number;
  }>;
  responsiblePerformance: Array<{
    responsible_id: string;
    responsible_name: string;
    leads_count: number;
    conversion_rate: number;
    avg_time_to_convert: number;
  }>;
}

interface LeadSourceData {
  source: string;
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
  avg_value: number;
  trend: 'up' | 'down' | 'stable';
}

interface FunnelStageData {
  stage: string;
  leads_count: number;
  conversion_rate: number;
  drop_rate: number;
}

export const useCRMAnalytics = (dateRange: { from: Date; to: Date }) => {
  const { data: analyticsMetrics, isLoading } = useQuery({
    queryKey: ['crm-analytics', dateRange],
    queryFn: async (): Promise<CRMAnalyticsMetrics> => {
      // Data range for queries
      const fromDate = dateRange.from.toISOString();
      const toDate = dateRange.to.toISOString();
      
      // Get week start date
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekStartISO = weekStart.toISOString();

      // Get total leads
      const { count: totalLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', fromDate)
        .lte('created_at', toDate);

      // Get leads this week
      const { count: leadsThisWeek } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStartISO);

      // Get converted leads (status = 'ganho')
      const { count: convertedLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ganho')
        .gte('created_at', fromDate)
        .lte('created_at', toDate);

      // Calculate conversion rate
      const conversionRate = totalLeads && totalLeads > 0 ? 
        ((convertedLeads || 0) / totalLeads) * 100 : 0;

      // Get average time in pipeline (simplified calculation)
      const { data: leadsWithDates } = await supabase
        .from('crm_leads')
        .select('created_at, status_changed_at, status')
        .eq('status', 'ganho')
        .not('status_changed_at', 'is', null)
        .gte('created_at', fromDate)
        .lte('created_at', toDate);

      let averageTimeInPipeline = 0;
      if (leadsWithDates && leadsWithDates.length > 0) {
        const totalDays = leadsWithDates.reduce((sum, lead) => {
          const created = new Date(lead.created_at);
          const statusChanged = new Date(lead.status_changed_at!);
          const daysDiff = Math.ceil((statusChanged.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          return sum + daysDiff;
        }, 0);
        averageTimeInPipeline = Math.round(totalDays / leadsWithDates.length);
      }

      // Get time series data (last 30 days)
      const timeSeriesData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStart = new Date(date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59, 999);

        const { count: newLeads } = await supabase
          .from('crm_leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateStart.toISOString())
          .lte('created_at', dateEnd.toISOString());

        const { count: convertedOnDay } = await supabase
          .from('crm_leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ganho')
          .gte('status_changed_at', dateStart.toISOString())
          .lte('status_changed_at', dateEnd.toISOString());

        const { count: activeLeads } = await supabase
          .from('crm_leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aberto')
          .lte('created_at', dateEnd.toISOString());

        timeSeriesData.push({
          date: date.toISOString().split('T')[0],
          new_leads: newLeads || 0,
          converted_leads: convertedOnDay || 0,
          active_leads: activeLeads || 0
        });
      }

      // Get pipeline distribution
      const { data: pipelineData } = await supabase
        .from('crm_pipelines')
        .select(`
          id,
          name,
          crm_leads(count)
        `)
        .eq('is_active', true);

      const pipelineDistribution = await Promise.all(
        (pipelineData || []).map(async (pipeline) => {
          const { count: totalInPipeline } = await supabase
            .from('crm_leads')
            .select('*', { count: 'exact', head: true })
            .eq('pipeline_id', pipeline.id);

          const { count: convertedInPipeline } = await supabase
            .from('crm_leads')
            .select('*', { count: 'exact', head: true })
            .eq('pipeline_id', pipeline.id)
            .eq('status', 'ganho');

          return {
            pipeline_id: pipeline.id,
            pipeline_name: pipeline.name,
            leads_count: totalInPipeline || 0,
            conversion_rate: totalInPipeline ? ((convertedInPipeline || 0) / totalInPipeline) * 100 : 0
          };
        })
      );

      // Get responsible performance
      const { data: responsibleData } = await supabase
        .from('profiles')
        .select('id, name')
        .not('id', 'is', null);

      const responsiblePerformance = await Promise.all(
        (responsibleData || []).map(async (person) => {
          const { count: totalLeads } = await supabase
            .from('crm_leads')
            .select('*', { count: 'exact', head: true })
            .eq('responsible_id', person.id);

          const { count: convertedLeads } = await supabase
            .from('crm_leads')
            .select('*', { count: 'exact', head: true })
            .eq('responsible_id', person.id)
            .eq('status', 'ganho');

          // Get average time to convert
          const { data: convertedLeadsWithTime } = await supabase
            .from('crm_leads')
            .select('created_at, status_changed_at')
            .eq('responsible_id', person.id)
            .eq('status', 'ganho')
            .not('status_changed_at', 'is', null);

          let avgTimeToConvert = 0;
          if (convertedLeadsWithTime && convertedLeadsWithTime.length > 0) {
            const totalDays = convertedLeadsWithTime.reduce((sum, lead) => {
              const created = new Date(lead.created_at);
              const statusChanged = new Date(lead.status_changed_at!);
              const daysDiff = Math.ceil((statusChanged.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
              return sum + daysDiff;
            }, 0);
            avgTimeToConvert = Math.round(totalDays / convertedLeadsWithTime.length);
          }

          return {
            responsible_id: person.id,
            responsible_name: person.name || 'Sem nome',
            leads_count: totalLeads || 0,
            conversion_rate: totalLeads ? ((convertedLeads || 0) / totalLeads) * 100 : 0,
            avg_time_to_convert: avgTimeToConvert
          };
        })
      );

      return {
        totalLeads: totalLeads || 0,
        leadsThisWeek: leadsThisWeek || 0,
        conversionRate,
        averageTimeInPipeline,
        timeSeriesData,
        pipelineDistribution,
        responsiblePerformance: responsiblePerformance.filter(rp => rp.leads_count > 0)
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: leadSourceAnalysis } = useQuery({
    queryKey: ['crm-lead-sources', dateRange],
    queryFn: async (): Promise<LeadSourceData[]> => {
      // For now, we'll simulate lead sources since we don't have a source field
      // This could be enhanced by adding a source field to crm_leads table
      const sources = ['Website', 'Google Ads', 'Facebook', 'Indicação', 'LinkedIn'];
      
      return await Promise.all(sources.map(async (source, index) => {
        // Simulate distribution (this would need real source tracking)
        const { count: totalLeads } = await supabase
          .from('crm_leads')
          .select('*', { count: 'exact', head: true });

        const simulatedTotal = Math.floor((totalLeads || 0) * (0.3 - index * 0.05));
        const simulatedConverted = Math.floor(simulatedTotal * 0.2);

        return {
          source,
          total_leads: simulatedTotal,
          converted_leads: simulatedConverted,
          conversion_rate: simulatedTotal > 0 ? (simulatedConverted / simulatedTotal) * 100 : 0,
          avg_value: 2500 + (index * 300), // Simulate different values
          trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'stable' : 'down'
        };
      }));
    }
  });

  const { data: conversionFunnel } = useQuery({
    queryKey: ['crm-conversion-funnel', dateRange],
    queryFn: async (): Promise<FunnelStageData[]> => {
      const { count: totalLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true });

      const { count: openLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aberto');

      const { count: wonLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ganho');

      const { count: lostLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'perdido');

      const total = totalLeads || 0;
      
      return [
        {
          stage: 'Total de Leads',
          leads_count: total,
          conversion_rate: 100,
          drop_rate: 0
        },
        {
          stage: 'Leads Ativos',
          leads_count: openLeads || 0,
          conversion_rate: total > 0 ? ((openLeads || 0) / total) * 100 : 0,
          drop_rate: total > 0 ? (((lostLeads || 0) + (wonLeads || 0)) / total) * 100 : 0
        },
        {
          stage: 'Leads Convertidos',
          leads_count: wonLeads || 0,
          conversion_rate: total > 0 ? ((wonLeads || 0) / total) * 100 : 0,
          drop_rate: total > 0 ? ((lostLeads || 0) / total) * 100 : 0
        }
      ];
    }
  });

  return {
    analyticsMetrics,
    leadSourceAnalysis,
    conversionFunnel,
    isLoading
  };
};
