
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
      // Mock data - em produção seria uma query real
      return {
        totalLeads: 150,
        leadsThisWeek: 12,
        conversionRate: 25,
        averageTimeInPipeline: 15,
        timeSeriesData: [
          {
            date: '2024-01-01',
            new_leads: 10,
            converted_leads: 3,
            active_leads: 25
          },
          {
            date: '2024-01-02',
            new_leads: 8,
            converted_leads: 2,
            active_leads: 31
          }
        ],
        pipelineDistribution: [
          {
            pipeline_id: '1',
            pipeline_name: 'Vendas',
            leads_count: 45,
            conversion_rate: 22.5
          }
        ],
        responsiblePerformance: [
          {
            responsible_id: '1',
            responsible_name: 'João Silva',
            leads_count: 25,
            conversion_rate: 28.0,
            avg_time_to_convert: 12
          },
          {
            responsible_id: '2',
            responsible_name: 'Maria Santos',
            leads_count: 30,
            conversion_rate: 23.3,
            avg_time_to_convert: 15
          }
        ]
      };
    }
  });

  const { data: leadSourceAnalysis } = useQuery({
    queryKey: ['crm-lead-sources', dateRange],
    queryFn: async (): Promise<LeadSourceData[]> => {
      return [
        {
          source: 'Website',
          total_leads: 45,
          converted_leads: 12,
          conversion_rate: 26.7,
          avg_value: 2500,
          trend: 'up'
        },
        {
          source: 'Google Ads',
          total_leads: 38,
          converted_leads: 8,
          conversion_rate: 21.1,
          avg_value: 3200,
          trend: 'stable'
        },
        {
          source: 'Facebook',
          total_leads: 22,
          converted_leads: 4,
          conversion_rate: 18.2,
          avg_value: 1800,
          trend: 'down'
        }
      ];
    }
  });

  const { data: conversionFunnel } = useQuery({
    queryKey: ['crm-conversion-funnel', dateRange],
    queryFn: async (): Promise<FunnelStageData[]> => {
      return [
        {
          stage: 'Prospects',
          leads_count: 100,
          conversion_rate: 100,
          drop_rate: 0
        },
        {
          stage: 'Qualificados',
          leads_count: 65,
          conversion_rate: 65,
          drop_rate: 35
        },
        {
          stage: 'Proposta',
          leads_count: 35,
          conversion_rate: 35,
          drop_rate: 46.2
        },
        {
          stage: 'Fechamento',
          leads_count: 25,
          conversion_rate: 25,
          drop_rate: 28.6
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
