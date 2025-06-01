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
  name: string;
  pipeline_id: string;
  sort_order: number;
  is_active: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CRMTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
}

export interface CRMLossReason {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'aberto' | 'ganho' | 'perdido';

export interface CRMLeadInput {
  name: string;
  email: string;
  phone?: string;
  has_company?: boolean;
  sells_on_amazon?: boolean;
  works_with_fba?: boolean;
  had_contact_with_lv?: boolean;
  seeks_private_label?: boolean;
  ready_to_invest_3k?: boolean;
  calendly_scheduled?: boolean;
  what_sells?: string;
  keep_or_new_niches?: string;
  amazon_store_link?: string;
  amazon_state?: string;
  amazon_tax_regime?: string;
  main_doubts?: string;
  calendly_link?: string;
  notes?: string;
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  scheduled_contact_date?: string;
  status?: LeadStatus;
  status_reason?: string;
  loss_reason_id?: string;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  has_company: boolean;
  sells_on_amazon: boolean;
  works_with_fba: boolean;
  had_contact_with_lv: boolean;
  seeks_private_label: boolean;
  ready_to_invest_3k: boolean;
  calendly_scheduled: boolean;
  what_sells?: string;
  keep_or_new_niches?: string;
  amazon_store_link?: string;
  amazon_state?: string;
  amazon_tax_regime?: string;
  main_doubts?: string;
  calendly_link?: string;
  notes?: string;
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  created_by?: string;
  scheduled_contact_date?: string;
  status: LeadStatus;
  status_reason?: string;
  loss_reason_id?: string;
  status_changed_at?: string;
  status_changed_by?: string;
  created_at: string;
  updated_at: string;
  tags: CRMTag[];
  pipeline?: CRMPipeline;
  column?: CRMPipelineColumn;
  loss_reason?: CRMLossReason;
  responsible?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CRMLeadFromDB extends Omit<CRMLead, 'tags'> {
  tags?: { tag: CRMTag }[];
}

export interface CRMLeadContact {
  id: string;
  lead_id: string;
  contact_type: 'call' | 'email' | 'whatsapp' | 'meeting';
  contact_reason: string;
  contact_date: string;
  status: 'pending' | 'completed' | 'overdue';
  notes?: string;
  responsible_id: string;
  completed_by?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  responsible?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CRMLeadContactCreate {
  lead_id: string;
  contact_type: 'call' | 'email' | 'whatsapp' | 'meeting';
  contact_reason: string;
  contact_date: string;
  responsible_id: string;
  notes?: string;
}

export interface ContactFilters {
  status?: 'pending' | 'completed' | 'overdue';
  contact_type?: 'call' | 'email' | 'whatsapp' | 'meeting';
  responsible_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface CRMLeadComment {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  mentions?: string[];
  parent_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface CRMLeadAttachment {
  id: string;
  lead_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  user_id: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CRMLeadHistory {
  id: string;
  lead_id: string;
  user_id: string;
  action_type: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  description: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CRMNotification {
  id: string;
  user_id: string;
  lead_id?: string;
  type: 'mention' | 'assignment' | 'status_change' | 'comment';
  title: string;
  message?: string;
  read: boolean;
  created_at: string;
}

export interface CRMFilters {
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  search?: string;
  contact_filter?: string;
  tag_ids?: string[];
  status?: LeadStatus;
}

export interface LeadWithContacts extends CRMLead {
  pending_contacts: CRMLeadContact[];
  last_completed_contact?: CRMLeadContact;
}
