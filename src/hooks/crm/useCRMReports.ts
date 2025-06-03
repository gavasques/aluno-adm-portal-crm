
import { useQuery } from '@tanstack/react-query';
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
      // Mock data - substitua por chamada real à API
      return {
        total_leads: 245,
        new_leads_this_month: 32,
        conversion_rate: 24.5,
        avg_deal_size: 3500,
        total_revenue: 85000,
        monthly_growth: 12.5,
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
          avg_time_to_convert: 15,
          columnBreakdown: [
            { columnName: 'Prospect', count: 40, percentage: 33.3, color: '#3b82f6' },
            { columnName: 'Qualificado', count: 35, percentage: 29.2, color: '#10b981' },
            { columnName: 'Proposta', count: 25, percentage: 20.8, color: '#f59e0b' },
            { columnName: 'Fechado', count: 20, percentage: 16.7, color: '#ef4444' }
          ]
        },
        {
          pipeline_id: '2',
          pipeline_name: 'Leads Qualificados',
          total_leads: 85,
          converted_leads: 25,
          conversion_rate: 29.4,
          avg_time_to_convert: 12,
          columnBreakdown: [
            { columnName: 'Contato Inicial', count: 30, percentage: 35.3, color: '#3b82f6' },
            { columnName: 'Demo', count: 25, percentage: 29.4, color: '#10b981' },
            { columnName: 'Negociação', count: 20, percentage: 23.5, color: '#f59e0b' },
            { columnName: 'Fechado', count: 10, percentage: 11.8, color: '#ef4444' }
          ]
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
          period: '2024-01',
          new_leads: 45,
          converted_leads: 12,
          lost_leads: 8,
          active_leads: 25
        },
        {
          period: '2024-02',
          new_leads: 52,
          converted_leads: 15,
          lost_leads: 10,
          active_leads: 27
        },
        {
          period: '2024-03',
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
