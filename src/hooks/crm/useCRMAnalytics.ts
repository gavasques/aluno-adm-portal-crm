
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
    total_leads: number;
    conversion_rate: number;
  }>;
}

interface LeadSourceData {
  source: string;
  count: number;
  conversion_rate: number;
}

interface ConversionFunnelData {
  stage: string;
  count: number;
  conversion_rate: number;
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
        timeSeriesData: [],
        pipelineDistribution: [],
        responsiblePerformance: []
      };
    }
  });

  const { data: leadSourceAnalysis } = useQuery({
    queryKey: ['crm-lead-sources', dateRange],
    queryFn: async (): Promise<LeadSourceData[]> => {
      return [];
    }
  });

  const { data: conversionFunnel } = useQuery({
    queryKey: ['crm-conversion-funnel', dateRange],
    queryFn: async (): Promise<ConversionFunnelData[]> => {
      return [];
    }
  });

  return {
    analyticsMetrics,
    leadSourceAnalysis,
    conversionFunnel,
    isLoading
  };
};
