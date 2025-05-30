
export interface CRMPipeline {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRMPipelineColumn {
  id: string;
  pipeline_id: string;
  name: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRMTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

// Tipos para dados vindos do Supabase (estrutura exata da query)
export interface CRMLeadFromDB {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  has_company: boolean | null;
  what_sells?: string | null;
  keep_or_new_niches?: string | null;
  sells_on_amazon: boolean | null;
  amazon_store_link?: string | null;
  amazon_state?: string | null;
  amazon_tax_regime?: string | null;
  works_with_fba: boolean | null;
  had_contact_with_lv: boolean | null;
  seeks_private_label: boolean | null;
  main_doubts?: string | null;
  ready_to_invest_3k: boolean | null;
  calendly_scheduled: boolean | null;
  calendly_link?: string | null;
  pipeline_id?: string | null;
  column_id?: string | null;
  responsible_id?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  scheduled_contact_date?: string | null;
  notes?: string | null;
  
  // Relacionamentos vindos do Supabase (estrutura exata)
  pipeline?: { id: string; name: string } | null;
  column?: { id: string; name: string; color: string } | null;
  responsible?: { id: string; name: string; email: string } | null;
  tags?: { tag: CRMTag }[];
}

// Tipo para dados processados na aplicação
export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  has_company: boolean;
  what_sells?: string;
  keep_or_new_niches?: string;
  sells_on_amazon: boolean;
  amazon_store_link?: string;
  amazon_state?: string;
  amazon_tax_regime?: string;
  works_with_fba: boolean;
  had_contact_with_lv: boolean;
  seeks_private_label: boolean;
  main_doubts?: string;
  ready_to_invest_3k: boolean;
  calendly_scheduled: boolean;
  calendly_link?: string;
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  scheduled_contact_date?: string;
  notes?: string;
  
  // Relacionamentos processados
  pipeline?: { id: string; name: string };
  column?: { id: string; name: string; color: string };
  responsible?: { id: string; name: string; email: string };
  tags?: CRMTag[];
}

// Tipo para inserção no Supabase (apenas campos da tabela)
export interface CRMLeadInsert {
  name: string;
  email: string;
  phone?: string;
  has_company?: boolean;
  what_sells?: string;
  keep_or_new_niches?: string;
  sells_on_amazon?: boolean;
  amazon_store_link?: string;
  amazon_state?: string;
  amazon_tax_regime?: string;
  works_with_fba?: boolean;
  had_contact_with_lv?: boolean;
  seeks_private_label?: boolean;
  main_doubts?: string;
  ready_to_invest_3k?: boolean;
  calendly_scheduled?: boolean;
  calendly_link?: string;
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  scheduled_contact_date?: string;
  notes?: string;
}

// Tipo para criação de leads (campos obrigatórios)
export interface CRMLeadCreate {
  name: string;
  email: string;
  phone?: string;
  has_company?: boolean;
  what_sells?: string;
  keep_or_new_niches?: string;
  sells_on_amazon?: boolean;
  amazon_store_link?: string;
  amazon_state?: string;
  amazon_tax_regime?: string;
  works_with_fba?: boolean;
  had_contact_with_lv?: boolean;
  seeks_private_label?: boolean;
  main_doubts?: string;
  ready_to_invest_3k?: boolean;
  calendly_scheduled?: boolean;
  calendly_link?: string;
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  scheduled_contact_date?: string;
  notes?: string;
}

export interface CRMLeadComment {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface CRMLeadAttachment {
  id: string;
  lead_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
}

export interface CRMLeadHistory {
  id: string;
  lead_id: string;
  user_id?: string;
  action_type: 'created' | 'updated' | 'moved' | 'assigned' | 'commented';
  field_name?: string;
  old_value?: string;
  new_value?: string;
  description?: string;
  created_at: string;
  user?: {
    name: string;
  };
}

export interface CRMNotification {
  id: string;
  user_id: string;
  lead_id: string;
  type: 'mention' | 'assignment' | 'status_change';
  title: string;
  message?: string;
  read: boolean;
  created_at: string;
}

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  is_closer: boolean;
  is_onboarding: boolean;
  role?: string;
}

export type ViewMode = 'kanban' | 'list';

export interface CRMFilters {
  search?: string;
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  tags?: string[];
  date_from?: string;
  date_to?: string;
}
