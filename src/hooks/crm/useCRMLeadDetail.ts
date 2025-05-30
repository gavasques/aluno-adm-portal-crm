
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMLeadFromDB } from '@/types/crm.types';

export const useCRMLeadDetail = (leadId: string) => {
  const [lead, setLead] = useState<CRMLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformLeadData = (leadData: CRMLeadFromDB): CRMLead => {
    return {
      id: leadData.id,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || undefined,
      has_company: leadData.has_company || false,
      what_sells: leadData.what_sells || undefined,
      keep_or_new_niches: leadData.keep_or_new_niches || undefined,
      sells_on_amazon: leadData.sells_on_amazon || false,
      amazon_store_link: leadData.amazon_store_link || undefined,
      amazon_state: leadData.amazon_state || undefined,
      amazon_tax_regime: leadData.amazon_tax_regime || undefined,
      works_with_fba: leadData.works_with_fba || false,
      had_contact_with_lv: leadData.had_contact_with_lv || false,
      seeks_private_label: leadData.seeks_private_label || false,
      main_doubts: leadData.main_doubts || undefined,
      ready_to_invest_3k: leadData.ready_to_invest_3k || false,
      calendly_scheduled: leadData.calendly_scheduled || false,
      calendly_link: leadData.calendly_link || undefined,
      pipeline_id: leadData.pipeline_id || undefined,
      column_id: leadData.column_id || undefined,
      responsible_id: leadData.responsible_id || undefined,
      created_by: leadData.created_by || undefined,
      created_at: leadData.created_at,
      updated_at: leadData.updated_at,
      scheduled_contact_date: leadData.scheduled_contact_date || undefined,
      notes: leadData.notes || undefined,
      pipeline: leadData.pipeline || undefined,
      column: leadData.column || undefined,
      responsible: leadData.responsible || undefined,
      tags: leadData.tags?.map(tagRel => tagRel.tag) || []
    };
  };

  const fetchLead = async () => {
    if (!leadId) {
      setError('ID do lead não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines!crm_leads_pipeline_id_fkey(id, name),
          column:crm_pipeline_columns!crm_leads_column_id_fkey(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          tags:crm_lead_tags(
            tag:crm_tags(id, name, color)
          )
        `)
        .eq('id', leadId)
        .single();

      if (supabaseError) {
        console.error('Erro ao buscar lead:', supabaseError);
        setError('Erro ao carregar dados do lead');
        return;
      }

      if (!data) {
        setError('Lead não encontrado');
        return;
      }

      const transformedLead = transformLeadData(data as CRMLeadFromDB);
      setLead(transformedLead);
    } catch (err) {
      console.error('Erro inesperado ao buscar lead:', err);
      setError('Erro inesperado ao carregar lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  return {
    lead,
    loading,
    error,
    refetch: fetchLead
  };
};
