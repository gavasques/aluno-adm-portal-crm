
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMLeadFromDB } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadDetail = (leadId: string) => {
  const [lead, setLead] = useState<CRMLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformLeadData = (dbLead: CRMLeadFromDB): CRMLead => {
    return {
      ...dbLead,
      has_company: dbLead.has_company ?? false,
      sells_on_amazon: dbLead.sells_on_amazon ?? false,
      works_with_fba: dbLead.works_with_fba ?? false,
      had_contact_with_lv: dbLead.had_contact_with_lv ?? false,
      seeks_private_label: dbLead.seeks_private_label ?? false,
      ready_to_invest_3k: dbLead.ready_to_invest_3k ?? false,
      calendly_scheduled: dbLead.calendly_scheduled ?? false,
      phone: dbLead.phone || undefined,
      what_sells: dbLead.what_sells || undefined,
      keep_or_new_niches: dbLead.keep_or_new_niches || undefined,
      amazon_store_link: dbLead.amazon_store_link || undefined,
      amazon_state: dbLead.amazon_state || undefined,
      amazon_tax_regime: dbLead.amazon_tax_regime || undefined,
      main_doubts: dbLead.main_doubts || undefined,
      calendly_link: dbLead.calendly_link || undefined,
      pipeline_id: dbLead.pipeline_id || undefined,
      column_id: dbLead.column_id || undefined,
      responsible_id: dbLead.responsible_id || undefined,
      created_by: dbLead.created_by || undefined,
      scheduled_contact_date: dbLead.scheduled_contact_date || undefined,
      notes: dbLead.notes || undefined,
      tags: dbLead.tags?.map(tagWrapper => tagWrapper.tag) || []
    };
  };

  const fetchLead = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          tags:crm_lead_tags(
            tag:crm_tags(id, name, color)
          )
        `)
        .eq('id', leadId)
        .single();

      if (error) throw error;

      if (data) {
        const transformedLead = transformLeadData(data as CRMLeadFromDB);
        setLead(transformedLead);
      } else {
        setError('Lead não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      setError('Erro ao carregar detalhes do lead');
      toast.error('Erro ao carregar detalhes do lead');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchLead();
  };

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  return {
    lead,
    loading,
    error,
    refetch
  };
};
