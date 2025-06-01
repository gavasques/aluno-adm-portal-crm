
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead } from '@/types/crm.types';

export const useCRMLeadDetail = (leadId: string) => {
  const [lead, setLead] = useState<CRMLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLead = async () => {
    if (!leadId) {
      setLead(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching lead details for ID:', leadId);
      
      // Buscar dados do lead com relações usando sintaxe mais simples
      const { data, error } = await supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name, sort_order, is_active, created_at, updated_at),
          column:crm_pipeline_columns(id, name, color, pipeline_id, sort_order, is_active, created_at, updated_at),
          responsible:profiles(id, name, email),
          tags:crm_lead_tags(
            tag:crm_tags(id, name, color, created_at)
          )
        `)
        .eq('id', leadId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching lead:', error);
        throw error;
      }

      if (data) {
        console.log('✅ Lead data fetched successfully:', data);
        
        // Transform the data to match CRMLead interface
        const transformedLead: CRMLead = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          has_company: data.has_company ?? false,
          sells_on_amazon: data.sells_on_amazon ?? false,
          works_with_fba: data.works_with_fba ?? false,
          had_contact_with_lv: data.had_contact_with_lv ?? false,
          seeks_private_label: data.seeks_private_label ?? false,
          ready_to_invest_3k: data.ready_to_invest_3k ?? false,
          calendly_scheduled: data.calendly_scheduled ?? false,
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
          scheduled_contact_date: data.scheduled_contact_date || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at,
          tags: data.tags?.map((tagWrapper: any) => tagWrapper.tag).filter(Boolean) || [],
          pipeline: data.pipeline || undefined,
          column: data.column || undefined,
          responsible: data.responsible ? {
            id: data.responsible.id,
            name: data.responsible.name,
            email: data.responsible.email
          } : undefined
        };

        setLead(transformedLead);
        console.log('✅ Lead transformed and set:', transformedLead);
      } else {
        console.log('⚠️ No lead data returned');
        setLead(null);
        setError('Lead não encontrado');
      }
    } catch (err) {
      console.error('❌ Error in fetchLead:', err);
      setLead(null);
      setError(err instanceof Error ? err.message : 'Erro ao carregar lead');
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
