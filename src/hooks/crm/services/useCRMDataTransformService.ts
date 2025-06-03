
import { useCallback } from 'react';
import { CRMLead } from '@/types/crm.types';

export const useCRMDataTransformService = () => {
  const transformLeadData = useCallback((dbLead: any): CRMLead => {
    return {
      ...dbLead,
      // Campos booleanos com valores padrão
      has_company: dbLead.has_company ?? false,
      sells_on_amazon: dbLead.sells_on_amazon ?? false,
      works_with_fba: dbLead.works_with_fba ?? false,
      had_contact_with_lv: dbLead.had_contact_with_lv ?? false,
      seeks_private_label: dbLead.seeks_private_label ?? false,
      ready_to_invest_3k: dbLead.ready_to_invest_3k ?? false,
      calendly_scheduled: dbLead.calendly_scheduled ?? false,
      
      // Campos opcionais
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
      notes: dbLead.notes || undefined,
      status_reason: dbLead.status_reason || undefined,
      status_changed_at: dbLead.status_changed_at || undefined,
      status_changed_by: dbLead.status_changed_by || undefined,
      
      // Transformar tags aninhadas
      tags: dbLead.tags?.map((tagWrapper: any) => tagWrapper.tag) || [],
      
      // Status padrão
      status: dbLead.status || 'aberto'
    };
  }, []);

  const validateLeadData = useCallback((lead: any): boolean => {
    return !!(
      lead &&
      lead.id &&
      lead.name &&
      lead.email &&
      lead.column_id
    );
  }, []);

  const normalizeLeadForDisplay = useCallback((lead: CRMLead): CRMLead => {
    return {
      ...lead,
      name: lead.name?.trim() || 'Nome não informado',
      email: lead.email?.toLowerCase().trim() || '',
      phone: lead.phone?.replace(/\D/g, '') || undefined,
    };
  }, []);

  return {
    transformLeadData,
    validateLeadData,
    normalizeLeadForDisplay
  };
};
