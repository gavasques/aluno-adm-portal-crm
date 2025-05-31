
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
  created_at: string;
  updated_at: string;
  tags: CRMTag[];
  pipeline?: CRMPipeline;
  column?: CRMPipelineColumn;
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

export interface CRMFilters {
  pipeline_id?: string;
  column_id?: string;
  responsible_id?: string;
  search?: string;
  contact_filter?: string;
}
