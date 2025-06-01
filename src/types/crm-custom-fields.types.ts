
export interface CRMCustomFieldGroup {
  id: string;
  name: string;
  description?: string;
  pipeline_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRMCustomField {
  id: string;
  group_id?: string;
  field_key: string;
  field_name: string;
  field_type: 'text' | 'number' | 'phone' | 'boolean' | 'select';
  is_required: boolean;
  sort_order: number;
  is_active: boolean;
  placeholder?: string;
  help_text?: string;
  validation_rules: Record<string, any>;
  options: string[];
  created_at: string;
  updated_at: string;
  group?: CRMCustomFieldGroup;
}

export interface CRMCustomFieldValue {
  id: string;
  lead_id: string;
  field_id: string;
  field_value?: string;
  created_at: string;
  updated_at: string;
  field?: CRMCustomField;
}

export interface CRMCustomFieldInput {
  group_id?: string;
  field_key: string;
  field_name: string;
  field_type: 'text' | 'number' | 'phone' | 'boolean' | 'select';
  is_required?: boolean;
  sort_order?: number;
  is_active?: boolean;
  placeholder?: string;
  help_text?: string;
  validation_rules?: Record<string, any>;
  options?: string[];
}

export interface CRMCustomFieldGroupInput {
  name: string;
  description?: string;
  pipeline_id?: string;
  sort_order?: number;
  is_active?: boolean;
}
