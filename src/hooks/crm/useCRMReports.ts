
import { useQuery } from '@tanstack/react-query';

export interface PipelineMetrics {
  pipeline_id: string;
  pipeline_name: string;
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
  avg_time_to_convert: number;
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
  leads_by_status: {
    aberto: number;
    ganho: number;
    perdido: number;
  };
}

export const useCRMReports = (dateRange: { from: Date; to: Date }) => {
  const { data: metrics, isLoading: loading } = useQuery({
    queryKey: ['crm-reports-metrics', dateRange],
    queryFn: async (): Promise<CRMMetrics> => {
      // Mock data - substitua por chamada real à API
      return {
        total_leads: 245,
        new_leads_this_month: 32,
        conversion_rate: 24.5,
        avg_deal_size: 3500,
        total_revenue: 85000,
        leads_by_status: {
          aberto: 120,
          ganho: 60,
          perdido: 65
        }
      };
    }
  });

  const { data: pipelineMetrics } = useQuery({
    queryKey: ['crm-pipeline-metrics', dateRange],
    queryFn: async (): Promise<PipelineMetrics[]> => {
      return [
        {
          pipeline_id: '1',
          pipeline_name: 'Vendas Diretas',
          total_leads: 120,
          converted_leads: 30,
          conversion_rate: 25.0,
          avg_time_to_convert: 15
        },
        {
          pipeline_id: '2',
          pipeline_name: 'Leads Qualificados',
          total_leads: 85,
          converted_leads: 25,
          conversion_rate: 29.4,
          avg_time_to_convert: 12
        }
      ];
    }
  });

  const { data: responsibleMetrics } = useQuery({
    queryKey: ['crm-responsible-metrics', dateRange],
    queryFn: async (): Promise<ResponsibleMetrics[]> => {
      return [
        {
          responsible_id: '1',
          responsible_name: 'João Silva',
          total_leads: 45,
          converted_leads: 12,
          conversion_rate: 26.7,
          avg_deal_size: 4200
        },
        {
          responsible_id: '2',
          responsible_name: 'Maria Santos',
          total_leads: 38,
          converted_leads: 11,
          conversion_rate: 28.9,
          avg_deal_size: 3800
        }
      ];
    }
  });

  const { data: periodData } = useQuery({
    queryKey: ['crm-period-data', dateRange],
    queryFn: async (): Promise<LeadsByPeriod[]> => {
      return [
        {
          period: 'Janeiro',
          new_leads: 45,
          converted_leads: 12,
          lost_leads: 8,
          active_leads: 25
        },
        {
          period: 'Fevereiro',
          new_leads: 52,
          converted_leads: 15,
          lost_leads: 10,
          active_leads: 27
        },
        {
          period: 'Março',
          new_leads: 38,
          converted_leads: 18,
          lost_leads: 6,
          active_leads: 14
        }
      ];
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
