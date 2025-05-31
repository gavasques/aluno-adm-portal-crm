
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead } from '@/types/crm.types';

export const useCRMLeadDetail = (leadId: string) => {
  const [lead, setLead] = useState<CRMLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) {
      setLead(null);
      setLoading(false);
      return;
    }

    const fetchLead = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crm_leads')
          .select(`
            *,
            pipeline:crm_pipelines(id, name),
            column:crm_pipeline_columns(id, name, color),
            responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
            tags:crm_lead_tags(
              tag:crm_tags(id, name, color, created_at)
            )
          `)
          .eq('id', leadId)
          .single();

        if (error) throw error;

        if (data) {
          // Transform the data to match CRMLead interface
          const transformedLead: CRMLead = {
            ...data,
            has_company: data.has_company ?? false,
            sells_on_amazon: data.sells_on_amazon ?? false,
            works_with_fba: data.works_with_fba ?? false,
            had_contact_with_lv: data.had_contact_with_lv ?? false,
            seeks_private_label: data.seeks_private_label ?? false,
            ready_to_invest_3k: data.ready_to_invest_3k ?? false,
            calendly_scheduled: data.calendly_scheduled ?? false,
            phone: data.phone || undefined,
            what_sells: data.what_sells || undefined,
            keep_or_new_niches: data.keep_or_new_niches || undefined,
            amazon_store_link: data.amazon_store_link || undefined,
            amazon_state: data.amazon_state || undefined,
            amazon_tax_regime: data.amazon_tax_regime || undefined,
            main_doubts: data.main_doubts || undefined,
            calendly_link: data.calendly_link || undefined,
            pipeline_id: data.pipeline_id || undefined,
            column_id: data.column_id || undefined,
            responsible_id: data.responsible_id || undefined,
            created_by: data.created_by || undefined,
            notes: data.notes || undefined,
            tags: data.tags?.map((tagWrapper: any) => tagWrapper.tag) || []
          };

          setLead(transformedLead);
        }
      } catch (err) {
        console.error('Erro ao buscar lead:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  return { lead, loading, error };
};
