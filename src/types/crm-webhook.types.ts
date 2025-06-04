
export interface CRMWebhookToken {
  id: string;
  pipeline_id: string;
  token: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  created_by?: string;
  deactivated_at?: string;
  deactivated_by?: string;
  reason?: string;
}

export interface CRMWebhookFieldMapping {
  id: string;
  pipeline_id: string;
  webhook_field_name: string;
  crm_field_name: string;
  crm_field_type: 'standard' | 'custom';
  custom_field_id?: string;
  field_type: 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email';
  transformation_rules: Record<string, any>;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  custom_field?: {
    id: string;
    field_name: string;
    field_key: string;
  };
}

export interface CRMWebhookTokenInput {
  pipeline_id: string;
  expires_at?: string;
  reason?: string;
}

export interface CRMWebhookFieldMappingInput {
  pipeline_id: string;
  webhook_field_name: string;
  crm_field_name: string;
  crm_field_type: 'standard' | 'custom';
  custom_field_id?: string;
  field_type: 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email';
  transformation_rules?: Record<string, any>;
  is_required?: boolean;
  is_active?: boolean;
}

export interface WebhookTokenAction {
  type: 'deactivate' | 'renew';
  reason: string;
}
