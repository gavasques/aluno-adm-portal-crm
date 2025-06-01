
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMReportsData, CRMStatusReport, CRMResponsiblePerformance, CRMLossReasonReport } from '@/types/crm.types';

interface CRMStatusReportsParams {
  pipeline_id?: string;
  date_from?: string;
  date_to?: string;
}

export const useCRMStatusReports = (params: CRMStatusReportsParams = {}) => {
  return useQuery({
    queryKey: ['crm-status-reports', params],
    queryFn: async (): Promise<CRMReportsData> => {
      // Query base para leads
      let leadsQuery = supabase
        .from('crm_leads')
        .select(`
          id,
          status,
          responsible_id,
          loss_reason_id,
          created_at,
          responsible:profiles!crm_leads_responsible_id_fkey(id, name),
          loss_reason:crm_loss_reasons(id, name)
        `);

      // Aplicar filtros
      if (params.pipeline_id) {
        leadsQuery = leadsQuery.eq('pipeline_id', params.pipeline_id);
      }

      if (params.date_from) {
        leadsQuery = leadsQuery.gte('created_at', params.date_from);
      }

      if (params.date_to) {
        leadsQuery = leadsQuery.lte('created_at', params.date_to);
      }

      const { data: leads, error } = await leadsQuery;

      if (error) throw error;

      const totalLeads = leads?.length || 0;
      const aberto = leads?.filter(lead => lead.status === 'aberto').length || 0;
      const ganho = leads?.filter(lead => lead.status === 'ganho').length || 0;
      const perdido = leads?.filter(lead => lead.status === 'perdido').length || 0;

      // Relatório de status geral
      const statusReport: CRMStatusReport = {
        total_leads: totalLeads,
        aberto,
        ganho,
        perdido,
        conversion_rate: totalLeads > 0 ? (ganho / totalLeads) * 100 : 0,
        loss_rate: totalLeads > 0 ? (perdido / totalLeads) * 100 : 0
      };

      // Performance por responsável
      const responsibleMap = new Map<string, {
        id: string;
        name: string;
        total: number;
        ganho: number;
        perdido: number;
        aberto: number;
      }>();

      leads?.forEach(lead => {
        if (lead.responsible_id && lead.responsible) {
          const current = responsibleMap.get(lead.responsible_id) || {
            id: lead.responsible_id,
            name: lead.responsible.name,
            total: 0,
            ganho: 0,
            perdido: 0,
            aberto: 0
          };

          current.total++;
          if (lead.status === 'ganho') current.ganho++;
          if (lead.status === 'perdido') current.perdido++;
          if (lead.status === 'aberto') current.aberto++;

          responsibleMap.set(lead.responsible_id, current);
        }
      });

      const responsiblePerformance: CRMResponsiblePerformance[] = Array.from(responsibleMap.values()).map(resp => ({
        responsible_id: resp.id,
        responsible_name: resp.name,
        total_leads: resp.total,
        ganho: resp.ganho,
        perdido: resp.perdido,
        aberto: resp.aberto,
        conversion_rate: resp.total > 0 ? (resp.ganho / resp.total) * 100 : 0,
        win_rate: (resp.ganho + resp.perdido) > 0 ? (resp.ganho / (resp.ganho + resp.perdido)) * 100 : 0
      }));

      // Motivos de perda
      const lossReasonMap = new Map<string, { id: string; name: string; count: number; }>();
      
      leads?.filter(lead => lead.status === 'perdido' && lead.loss_reason)
        .forEach(lead => {
          if (lead.loss_reason) {
            const current = lossReasonMap.get(lead.loss_reason.id) || {
              id: lead.loss_reason.id,
              name: lead.loss_reason.name,
              count: 0
            };
            current.count++;
            lossReasonMap.set(lead.loss_reason.id, current);
          }
        });

      const totalLossReasons = Array.from(lossReasonMap.values()).reduce((sum, reason) => sum + reason.count, 0);
      
      const lossReasons: CRMLossReasonReport[] = Array.from(lossReasonMap.values()).map(reason => ({
        loss_reason_id: reason.id,
        loss_reason_name: reason.name,
        count: reason.count,
        percentage: totalLossReasons > 0 ? (reason.count / totalLossReasons) * 100 : 0
      }));

      return {
        status_report: statusReport,
        responsible_performance: responsiblePerformance,
        loss_reasons: lossReasons
      };
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
