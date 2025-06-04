
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CRMWebhookLog {
  id: string;
  pipeline_id?: string;
  payload_received: any;
  response_status: number;
  response_body?: any;
  ip_address?: string;
  user_agent?: string;
  lead_created_id?: string;
  processing_time_ms?: number;
  error_message?: string;
  success: boolean;
  webhook_url?: string;
  created_at: string;
  pipeline?: {
    id: string;
    name: string;
  };
  lead?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface WebhookLogFilters {
  pipeline_id?: string;
  success?: boolean;
  date_from?: string;
  date_to?: string;
  ip_address?: string;
}

export const useCRMWebhookLogs = (filters: WebhookLogFilters = {}) => {
  return useQuery({
    queryKey: ['crm-webhook-logs', filters],
    queryFn: async () => {
      let query = supabase
        .from('crm_webhook_logs')
        .select(`
          *,
          pipeline:crm_pipelines(id, name),
          lead:crm_leads(id, name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Aplicar filtros
      if (filters.pipeline_id) {
        query = query.eq('pipeline_id', filters.pipeline_id);
      }
      
      if (filters.success !== undefined) {
        query = query.eq('success', filters.success);
      }
      
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      
      if (filters.ip_address) {
        query = query.eq('ip_address', filters.ip_address);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as CRMWebhookLog[];
    }
  });
};

export const useCRMWebhookStats = (pipelineId?: string) => {
  return useQuery({
    queryKey: ['crm-webhook-stats', pipelineId],
    queryFn: async () => {
      let query = supabase
        .from('crm_webhook_logs')
        .select('success, created_at');

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const total = data.length;
      const successful = data.filter(log => log.success).length;
      const failed = total - successful;
      const successRate = total > 0 ? (successful / total) * 100 : 0;

      // Estatísticas por dia (últimos 7 dias)
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      
      const recentLogs = data.filter(log => new Date(log.created_at) >= last7Days);
      const dailyStats = recentLogs.reduce((acc, log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { total: 0, successful: 0 };
        }
        acc[date].total++;
        if (log.success) acc[date].successful++;
        return acc;
      }, {} as Record<string, { total: number; successful: number }>);

      return {
        total,
        successful,
        failed,
        successRate,
        dailyStats
      };
    }
  });
};
