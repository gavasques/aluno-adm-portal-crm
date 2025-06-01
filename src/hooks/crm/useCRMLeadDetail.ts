
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, LeadStatus } from '@/types/crm.types';
import { CRMCustomField, CRMCustomFieldValue } from '@/types/crm-custom-fields.types';

interface LeadDetailData extends CRMLead {
  customFields?: CRMCustomField[];
  customFieldValues?: CRMCustomFieldValue[];
}

export const useCRMLeadDetail = (leadId: string) => {
  const [lead, setLead] = useState<LeadDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLead = async () => {
    if (!leadId) {
      console.log('⚠️ useCRMLeadDetail: No leadId provided');
      setLead(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCRMLeadDetail: Fetching lead details for ID:', leadId);
      
      // Buscar dados do lead com relações usando foreign key específico
      const { data: leadData, error: leadError } = await supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name, sort_order, is_active, created_at, updated_at),
          column:crm_pipeline_columns(id, name, color, pipeline_id, sort_order, is_active, created_at, updated_at),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          tags:crm_lead_tags(
            tag:crm_tags(id, name, color, created_at)
          )
        `)
        .eq('id', leadId)
        .maybeSingle();

      console.log('🔍 useCRMLeadDetail: Lead query result:', { leadData, leadError });

      if (leadError) {
        console.error('❌ useCRMLeadDetail: Lead query error:', leadError);
        throw leadError;
      }

      // Buscar campos customizados ativos
      const { data: customFields, error: fieldsError } = await supabase
        .from('crm_custom_fields')
        .select(`
          *,
          group:crm_custom_field_groups(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      console.log('🔍 useCRMLeadDetail: Custom fields query result:', { customFields, fieldsError });

      if (fieldsError) {
        console.error('❌ useCRMLeadDetail: Custom fields query error:', fieldsError);
        // Não falhar se não conseguir buscar campos customizados
      }

      // Buscar valores dos campos customizados para este lead
      const { data: customFieldValues, error: valuesError } = await supabase
        .from('crm_custom_field_values')
        .select(`
          *,
          field:crm_custom_fields(*)
        `)
        .eq('lead_id', leadId);

      console.log('🔍 useCRMLeadDetail: Custom field values query result:', { customFieldValues, valuesError });

      if (valuesError) {
        console.error('❌ useCRMLeadDetail: Custom field values query error:', valuesError);
        // Não falhar se não conseguir buscar valores
      }

      if (leadData) {
        console.log('✅ useCRMLeadDetail: Lead data fetched successfully:', leadData);
        
        // Transform the data to match CRMLead interface
        const transformedLead: LeadDetailData = {
          id: leadData.id,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone || undefined,
          has_company: leadData.has_company ?? false,
          sells_on_amazon: leadData.sells_on_amazon ?? false,
          works_with_fba: leadData.works_with_fba ?? false,
          had_contact_with_lv: leadData.had_contact_with_lv ?? false,
          seeks_private_label: leadData.seeks_private_label ?? false,
          ready_to_invest_3k: leadData.ready_to_invest_3k ?? false,
          calendly_scheduled: leadData.calendly_scheduled ?? false,
          what_sells: leadData.what_sells || undefined,
          keep_or_new_niches: leadData.keep_or_new_niches || undefined,
          amazon_store_link: leadData.amazon_store_link || undefined,
          amazon_state: leadData.amazon_state || undefined,
          amazon_tax_regime: leadData.amazon_tax_regime || undefined,
          main_doubts: leadData.main_doubts || undefined,
          calendly_link: leadData.calendly_link || undefined,
          pipeline_id: leadData.pipeline_id || undefined,
          column_id: leadData.column_id || undefined,
          responsible_id: leadData.responsible_id || undefined,
          created_by: leadData.created_by || undefined,
          notes: leadData.notes || undefined,
          scheduled_contact_date: leadData.scheduled_contact_date || undefined,
          status: (leadData.status || 'aberto') as LeadStatus,
          status_reason: leadData.status_reason || undefined,
          status_changed_at: leadData.status_changed_at || undefined,
          status_changed_by: leadData.status_changed_by || undefined,
          created_at: leadData.created_at,
          updated_at: leadData.updated_at,
          tags: Array.isArray(leadData.tags) ? leadData.tags.map((tagWrapper: any) => tagWrapper.tag).filter(Boolean) : [],
          pipeline: leadData.pipeline || undefined,
          column: leadData.column || undefined,
          responsible: leadData.responsible ? {
            id: leadData.responsible.id,
            name: leadData.responsible.name,
            email: leadData.responsible.email
          } : undefined,
          customFields: customFields ? customFields.map(field => ({
            ...field,
            field_type: field.field_type as 'text' | 'number' | 'phone' | 'boolean' | 'select',
            options: Array.isArray(field.options) ? field.options as string[] : [],
            validation_rules: (field.validation_rules && typeof field.validation_rules === 'object' && !Array.isArray(field.validation_rules)) 
              ? field.validation_rules as Record<string, any>
              : {}
          })) : [],
          customFieldValues: customFieldValues ? customFieldValues.map(value => ({
            ...value,
            field: value.field ? {
              ...value.field,
              field_type: value.field.field_type as 'text' | 'number' | 'phone' | 'boolean' | 'select',
              options: Array.isArray(value.field.options) ? value.field.options as string[] : [],
              validation_rules: (value.field.validation_rules && typeof value.field.validation_rules === 'object' && !Array.isArray(value.field.validation_rules)) 
                ? value.field.validation_rules as Record<string, any>
                : {}
            } : undefined
          })) : []
        };

        console.log('✅ useCRMLeadDetail: Lead transformed and set:', transformedLead);
        setLead(transformedLead);
      } else {
        console.log('⚠️ useCRMLeadDetail: No lead data returned for ID:', leadId);
        setLead(null);
        setError('Lead não encontrado');
      }
    } catch (err) {
      console.error('❌ useCRMLeadDetail: Error in fetchLead:', err);
      setLead(null);
      setError(err instanceof Error ? err.message : 'Erro ao carregar lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useCRMLeadDetail: Effect triggered with leadId:', leadId);
    fetchLead();
  }, [leadId]);

  return { 
    lead, 
    loading, 
    error, 
    refetch: fetchLead 
  };
};
