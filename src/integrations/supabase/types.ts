export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          event_category: string
          event_type: string
          expires_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          request_method: string | null
          request_path: string | null
          risk_level: string | null
          session_id: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_category?: string
          event_type: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          request_method?: string | null
          request_path?: string | null
          risk_level?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_category?: string
          event_type?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          request_method?: string | null
          request_path?: string | null
          risk_level?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bonus_comments: {
        Row: {
          author_name: string
          bonus_id: string
          content: string
          created_at: string
          id: string
          likes: number | null
          user_id: string
          user_liked: boolean | null
        }
        Insert: {
          author_name: string
          bonus_id: string
          content: string
          created_at?: string
          id?: string
          likes?: number | null
          user_id: string
          user_liked?: boolean | null
        }
        Update: {
          author_name?: string
          bonus_id?: string
          content?: string
          created_at?: string
          id?: string
          likes?: number | null
          user_id?: string
          user_liked?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bonus_comments_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses"
            referencedColumns: ["id"]
          },
        ]
      }
      bonus_files: {
        Row: {
          bonus_id: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          bonus_id: string
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          bonus_id?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bonus_files_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses"
            referencedColumns: ["id"]
          },
        ]
      }
      bonuses: {
        Row: {
          access_period: string
          bonus_id: string
          created_at: string
          description: string
          id: string
          name: string
          observations: string | null
          type: string
          updated_at: string
        }
        Insert: {
          access_period: string
          bonus_id: string
          created_at?: string
          description: string
          id?: string
          name: string
          observations?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          access_period?: string
          bonus_id?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          observations?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendly_configs: {
        Row: {
          active: boolean | null
          calendly_username: string
          created_at: string | null
          event_type_slug: string
          id: string
          mentor_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          calendly_username: string
          created_at?: string | null
          event_type_slug: string
          id?: string
          mentor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          calendly_username?: string
          created_at?: string | null
          event_type_slug?: string
          id?: string
          mentor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendly_configs_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendly_events: {
        Row: {
          calendly_cancel_url: string | null
          calendly_event_uri: string
          calendly_reschedule_url: string | null
          created_at: string | null
          duration_minutes: number
          end_time: string
          event_name: string
          id: string
          meeting_link: string | null
          mentor_id: string | null
          start_time: string
          status: string | null
          student_id: string | null
          synced_at: string | null
          updated_at: string | null
        }
        Insert: {
          calendly_cancel_url?: string | null
          calendly_event_uri: string
          calendly_reschedule_url?: string | null
          created_at?: string | null
          duration_minutes: number
          end_time: string
          event_name: string
          id?: string
          meeting_link?: string | null
          mentor_id?: string | null
          start_time: string
          status?: string | null
          student_id?: string | null
          synced_at?: string | null
          updated_at?: string | null
        }
        Update: {
          calendly_cancel_url?: string | null
          calendly_event_uri?: string
          calendly_reschedule_url?: string | null
          created_at?: string | null
          duration_minutes?: number
          end_time?: string
          event_name?: string
          id?: string
          meeting_link?: string | null
          mentor_id?: string | null
          start_time?: string
          status?: string | null
          student_id?: string | null
          synced_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendly_events_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendly_events_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      credit_packages: {
        Row: {
          created_at: string
          credits: number
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          original_price: number
          price: number
          sort_order: number | null
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits: number
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          original_price: number
          price: number
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          original_price?: number
          price?: number
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      credit_subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          monthly_credits: number
          name: string
          price: number
          sort_order: number | null
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_credits: number
          name: string
          price: number
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_credits?: number
          name?: string
          price?: number
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      credit_subscriptions: {
        Row: {
          created_at: string
          id: string
          monthly_credits: number
          next_billing_date: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_credits: number
          next_billing_date: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_credits?: number
          next_billing_date?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          package_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          package_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          package_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "credit_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_custom_field_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          pipeline_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          pipeline_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          pipeline_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_custom_field_groups_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_custom_field_values: {
        Row: {
          created_at: string
          field_id: string
          field_value: string | null
          id: string
          lead_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_id: string
          field_value?: string | null
          id?: string
          lead_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_id?: string
          field_value?: string | null
          id?: string
          lead_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_custom_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "crm_custom_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_custom_field_values_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_custom_fields: {
        Row: {
          created_at: string
          field_key: string
          field_name: string
          field_type: string
          group_id: string | null
          help_text: string | null
          id: string
          is_active: boolean
          is_required: boolean
          options: Json | null
          placeholder: string | null
          sort_order: number
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          field_key: string
          field_name: string
          field_type: string
          group_id?: string | null
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          options?: Json | null
          placeholder?: string | null
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          field_key?: string
          field_name?: string
          field_type?: string
          group_id?: string | null
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          options?: Json | null
          placeholder?: string | null
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_custom_fields_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "crm_custom_field_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_field_configurations: {
        Row: {
          amazon_section: boolean
          business_section: boolean
          created_at: string
          id: string
          notes_section: boolean
          qualification_section: boolean
          updated_at: string
        }
        Insert: {
          amazon_section?: boolean
          business_section?: boolean
          created_at?: string
          id?: string
          notes_section?: boolean
          qualification_section?: boolean
          updated_at?: string
        }
        Update: {
          amazon_section?: boolean
          business_section?: boolean
          created_at?: string
          id?: string
          notes_section?: boolean
          qualification_section?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      crm_lead_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          lead_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          lead_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          lead_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_attachments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lead_id: string | null
          mentions: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          mentions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          mentions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_comments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_contacts: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          contact_date: string
          contact_reason: string
          contact_type: string
          created_at: string
          id: string
          lead_id: string
          notes: string | null
          responsible_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          contact_date: string
          contact_reason: string
          contact_type: string
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
          responsible_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          contact_date?: string
          contact_reason?: string
          contact_type?: string
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          responsible_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_contacts_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_contacts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_contacts_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_history: {
        Row: {
          action_type: string
          created_at: string | null
          description: string | null
          field_name: string | null
          id: string
          lead_id: string | null
          new_value: string | null
          old_value: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          description?: string | null
          field_name?: string | null
          id?: string
          lead_id?: string | null
          new_value?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          description?: string | null
          field_name?: string | null
          id?: string
          lead_id?: string | null
          new_value?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_tags: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          tag_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          tag_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_tags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "crm_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          amazon_state: string | null
          amazon_store_link: string | null
          amazon_tax_regime: string | null
          calendly_link: string | null
          calendly_scheduled: boolean | null
          column_id: string | null
          created_at: string | null
          created_by: string | null
          email: string
          had_contact_with_lv: boolean | null
          has_company: boolean | null
          id: string
          keep_or_new_niches: string | null
          loss_reason_id: string | null
          main_doubts: string | null
          name: string
          notes: string | null
          phone: string | null
          pipeline_id: string | null
          ready_to_invest_3k: boolean | null
          responsible_id: string | null
          scheduled_contact_date: string | null
          seeks_private_label: boolean | null
          sells_on_amazon: boolean | null
          status: string
          status_changed_at: string | null
          status_changed_by: string | null
          status_reason: string | null
          updated_at: string | null
          what_sells: string | null
          works_with_fba: boolean | null
        }
        Insert: {
          amazon_state?: string | null
          amazon_store_link?: string | null
          amazon_tax_regime?: string | null
          calendly_link?: string | null
          calendly_scheduled?: boolean | null
          column_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email: string
          had_contact_with_lv?: boolean | null
          has_company?: boolean | null
          id?: string
          keep_or_new_niches?: string | null
          loss_reason_id?: string | null
          main_doubts?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          pipeline_id?: string | null
          ready_to_invest_3k?: boolean | null
          responsible_id?: string | null
          scheduled_contact_date?: string | null
          seeks_private_label?: boolean | null
          sells_on_amazon?: boolean | null
          status?: string
          status_changed_at?: string | null
          status_changed_by?: string | null
          status_reason?: string | null
          updated_at?: string | null
          what_sells?: string | null
          works_with_fba?: boolean | null
        }
        Update: {
          amazon_state?: string | null
          amazon_store_link?: string | null
          amazon_tax_regime?: string | null
          calendly_link?: string | null
          calendly_scheduled?: boolean | null
          column_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          had_contact_with_lv?: boolean | null
          has_company?: boolean | null
          id?: string
          keep_or_new_niches?: string | null
          loss_reason_id?: string | null
          main_doubts?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          pipeline_id?: string | null
          ready_to_invest_3k?: boolean | null
          responsible_id?: string | null
          scheduled_contact_date?: string | null
          seeks_private_label?: boolean | null
          sells_on_amazon?: boolean | null
          status?: string
          status_changed_at?: string | null
          status_changed_by?: string | null
          status_reason?: string | null
          updated_at?: string | null
          what_sells?: string | null
          works_with_fba?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "crm_pipeline_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_loss_reason_id_fkey"
            columns: ["loss_reason_id"]
            isOneToOne: false
            referencedRelation: "crm_loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_loss_reasons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      crm_notifications: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_notifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipeline_columns: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          pipeline_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pipeline_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pipeline_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_pipeline_columns_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipelines: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      crm_user_card_preferences: {
        Row: {
          created_at: string | null
          field_order: Json | null
          id: string
          updated_at: string | null
          user_id: string
          visible_fields: Json | null
        }
        Insert: {
          created_at?: string | null
          field_order?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
          visible_fields?: Json | null
        }
        Update: {
          created_at?: string | null
          field_order?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
          visible_fields?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_user_card_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_webhook_field_mappings: {
        Row: {
          created_at: string
          crm_field_name: string
          crm_field_type: string
          custom_field_id: string | null
          field_type: string
          id: string
          is_active: boolean
          is_required: boolean
          pipeline_id: string
          transformation_rules: Json | null
          updated_at: string
          webhook_field_name: string
        }
        Insert: {
          created_at?: string
          crm_field_name: string
          crm_field_type?: string
          custom_field_id?: string | null
          field_type: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          pipeline_id: string
          transformation_rules?: Json | null
          updated_at?: string
          webhook_field_name: string
        }
        Update: {
          created_at?: string
          crm_field_name?: string
          crm_field_type?: string
          custom_field_id?: string | null
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          pipeline_id?: string
          transformation_rules?: Json | null
          updated_at?: string
          webhook_field_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_webhook_field_mappings_custom_field_id_fkey"
            columns: ["custom_field_id"]
            isOneToOne: false
            referencedRelation: "crm_custom_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_webhook_field_mappings_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_webhook_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          ip_address: unknown | null
          lead_created_id: string | null
          payload_received: Json
          pipeline_id: string | null
          processing_time_ms: number | null
          response_body: Json | null
          response_status: number
          success: boolean
          user_agent: string | null
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          lead_created_id?: string | null
          payload_received: Json
          pipeline_id?: string | null
          processing_time_ms?: number | null
          response_body?: Json | null
          response_status: number
          success?: boolean
          user_agent?: string | null
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          lead_created_id?: string | null
          payload_received?: Json
          pipeline_id?: string | null
          processing_time_ms?: number | null
          response_body?: Json | null
          response_status?: number
          success?: boolean
          user_agent?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_webhook_logs_lead_created_id_fkey"
            columns: ["lead_created_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_webhook_logs_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_webhook_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          deactivated_at: string | null
          deactivated_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          pipeline_id: string
          reason: string | null
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deactivated_at?: string | null
          deactivated_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          pipeline_id: string
          reason?: string | null
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deactivated_at?: string | null
          deactivated_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          pipeline_id?: string
          reason?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_webhook_tokens_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      livi_ai_messages: {
        Row: {
          ai_response: string | null
          created_at: string
          credits_used: number
          error_message: string | null
          id: string
          message_order: number
          message_text: string
          response_time_ms: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          ai_response?: string | null
          created_at?: string
          credits_used?: number
          error_message?: string | null
          id?: string
          message_order: number
          message_text: string
          response_time_ms?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          ai_response?: string | null
          created_at?: string
          credits_used?: number
          error_message?: string | null
          id?: string
          message_order?: number
          message_text?: string
          response_time_ms?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "livi_ai_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "livi_ai_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      livi_ai_session_logs: {
        Row: {
          action_data: Json | null
          action_type: string
          created_at: string
          id: string
          session_id: string
          user_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          created_at?: string
          id?: string
          session_id: string
          user_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          created_at?: string
          id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "livi_ai_session_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "livi_ai_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      livi_ai_sessions: {
        Row: {
          created_at: string
          credits_consumed: number
          ended_at: string | null
          id: string
          is_active: boolean
          session_duration_minutes: number | null
          session_name: string
          started_at: string
          total_messages: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_consumed?: number
          ended_at?: string | null
          id?: string
          is_active?: boolean
          session_duration_minutes?: number | null
          session_name: string
          started_at?: string
          total_messages?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_consumed?: number
          ended_at?: string | null
          id?: string
          is_active?: boolean
          session_duration_minutes?: number | null
          session_name?: string
          started_at?: string
          total_messages?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentoring_catalogs: {
        Row: {
          active: boolean
          created_at: string
          description: string
          duration_months: number
          id: string
          image_url: string | null
          instructor: string
          name: string
          number_of_sessions: number
          price: number
          status: string
          tags: string[] | null
          total_sessions: number
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          duration_months: number
          id?: string
          image_url?: string | null
          instructor: string
          name: string
          number_of_sessions: number
          price: number
          status?: string
          tags?: string[] | null
          total_sessions: number
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          duration_months?: number
          id?: string
          image_url?: string | null
          instructor?: string
          name?: string
          number_of_sessions?: number
          price?: number
          status?: string
          tags?: string[] | null
          total_sessions?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentoring_enrollment_extensions: {
        Row: {
          admin_id: string | null
          applied_date: string
          created_at: string
          enrollment_id: string
          extension_months: number
          id: string
          notes: string | null
        }
        Insert: {
          admin_id?: string | null
          applied_date?: string
          created_at?: string
          enrollment_id: string
          extension_months: number
          id?: string
          notes?: string | null
        }
        Update: {
          admin_id?: string | null
          applied_date?: string
          created_at?: string
          enrollment_id?: string
          extension_months?: number
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_enrollment_extensions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentoring_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_enrollments: {
        Row: {
          created_at: string
          end_date: string
          enrollment_date: string
          group_id: string | null
          has_extension: boolean | null
          id: string
          mentoring_id: string
          observations: string | null
          original_end_date: string | null
          payment_status: string
          responsible_mentor: string
          sessions_used: number
          start_date: string
          status: string
          student_id: string
          total_sessions: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          enrollment_date?: string
          group_id?: string | null
          has_extension?: boolean | null
          id?: string
          mentoring_id: string
          observations?: string | null
          original_end_date?: string | null
          payment_status?: string
          responsible_mentor: string
          sessions_used?: number
          start_date: string
          status?: string
          student_id: string
          total_sessions: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          enrollment_date?: string
          group_id?: string | null
          has_extension?: boolean | null
          id?: string
          mentoring_id?: string
          observations?: string | null
          original_end_date?: string | null
          payment_status?: string
          responsible_mentor?: string
          sessions_used?: number
          start_date?: string
          status?: string
          student_id?: string
          total_sessions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_enrollments_mentoring_id_fkey"
            columns: ["mentoring_id"]
            isOneToOne: false
            referencedRelation: "mentoring_catalogs"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_extensions: {
        Row: {
          catalog_id: string
          created_at: string
          description: string | null
          id: string
          months: number
          price: number
        }
        Insert: {
          catalog_id: string
          created_at?: string
          description?: string | null
          id?: string
          months: number
          price: number
        }
        Update: {
          catalog_id?: string
          created_at?: string
          description?: string | null
          id?: string
          months?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_mentoring_extensions_catalog"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "mentoring_catalogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_extensions_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "mentoring_catalogs"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_materials: {
        Row: {
          created_at: string
          description: string | null
          enrollment_id: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          session_id: string | null
          size_mb: number | null
          storage_path: string | null
          tags: string[] | null
          updated_at: string
          uploader_id: string | null
          uploader_type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          enrollment_id?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          session_id?: string | null
          size_mb?: number | null
          storage_path?: string | null
          tags?: string[] | null
          updated_at?: string
          uploader_id?: string | null
          uploader_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          enrollment_id?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          session_id?: string | null
          size_mb?: number | null
          storage_path?: string | null
          tags?: string[] | null
          updated_at?: string
          uploader_id?: string | null
          uploader_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_materials_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentoring_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_materials_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentoring_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_sessions: {
        Row: {
          calendly_link: string | null
          created_at: string
          duration_minutes: number
          enrollment_id: string
          group_id: string | null
          id: string
          meeting_link: string | null
          mentor_notes: string | null
          observations: string | null
          recording_link: string | null
          scheduled_date: string | null
          session_number: number
          status: string
          student_notes: string | null
          title: string
          transcription: string | null
          type: string
          updated_at: string
        }
        Insert: {
          calendly_link?: string | null
          created_at?: string
          duration_minutes?: number
          enrollment_id: string
          group_id?: string | null
          id?: string
          meeting_link?: string | null
          mentor_notes?: string | null
          observations?: string | null
          recording_link?: string | null
          scheduled_date?: string | null
          session_number: number
          status?: string
          student_notes?: string | null
          title: string
          transcription?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          calendly_link?: string | null
          created_at?: string
          duration_minutes?: number
          enrollment_id?: string
          group_id?: string | null
          id?: string
          meeting_link?: string | null
          mentor_notes?: string | null
          observations?: string | null
          recording_link?: string | null
          scheduled_date?: string | null
          session_number?: number
          status?: string
          student_notes?: string | null
          title?: string
          transcription?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_sessions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentoring_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      module_actions: {
        Row: {
          action_key: string
          action_name: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          module_id: string | null
        }
        Insert: {
          action_key: string
          action_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_id?: string | null
        }
        Update: {
          action_key?: string
          action_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_actions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      my_supplier_branches: {
        Row: {
          address: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          supplier_id: string
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          supplier_id: string
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_supplier_branches_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "my_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      my_supplier_brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          supplier_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          supplier_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_supplier_brands_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "my_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      my_supplier_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes: number | null
          parent_id: string | null
          supplier_id: string
          user_avatar: string | null
          user_id: string
          user_liked: boolean | null
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes?: number | null
          parent_id?: string | null
          supplier_id: string
          user_avatar?: string | null
          user_id: string
          user_liked?: boolean | null
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes?: number | null
          parent_id?: string | null
          supplier_id?: string
          user_avatar?: string | null
          user_id?: string
          user_liked?: boolean | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_supplier_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "my_supplier_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "my_supplier_comments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "my_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      my_supplier_communications: {
        Row: {
          contact: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          supplier_id: string
          type: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          supplier_id: string
          type: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          supplier_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_supplier_communications_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "my_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      my_supplier_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          supplier_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          supplier_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_supplier_contacts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "my_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      my_supplier_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          likes: number | null
          rating: number
          supplier_id: string
          user_id: string
          user_liked: boolean | null
          user_name: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          rating: number
          supplier_id: string
          user_id: string
          user_liked?: boolean | null
          user_name: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          rating?: number
          supplier_id?: string
          user_id?: string
          user_liked?: boolean | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_supplier_ratings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "my_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      my_suppliers: {
        Row: {
          address: string | null
          category: string
          cnpj: string | null
          comment_count: number | null
          created_at: string
          email: string | null
          id: string
          logo: string | null
          name: string
          phone: string | null
          rating: number | null
          type: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          cnpj?: string | null
          comment_count?: number | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          type?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          cnpj?: string | null
          comment_count?: number | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author_id: string | null
          author_name: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      permission_group_menus: {
        Row: {
          created_at: string
          id: string
          menu_key: string
          permission_group_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_key: string
          permission_group_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_key?: string
          permission_group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_group_menus_permission_group_id_fkey"
            columns: ["permission_group_id"]
            isOneToOne: false
            referencedRelation: "permission_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_group_modules: {
        Row: {
          action_id: string | null
          created_at: string | null
          granted: boolean | null
          id: string
          module_id: string | null
          permission_group_id: string | null
        }
        Insert: {
          action_id?: string | null
          created_at?: string | null
          granted?: boolean | null
          id?: string
          module_id?: string | null
          permission_group_id?: string | null
        }
        Update: {
          action_id?: string | null
          created_at?: string | null
          granted?: boolean | null
          id?: string
          module_id?: string | null
          permission_group_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permission_group_modules_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "module_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_group_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_group_modules_permission_group_id_fkey"
            columns: ["permission_group_id"]
            isOneToOne: false
            referencedRelation: "permission_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_groups: {
        Row: {
          allow_admin_access: boolean
          created_at: string
          description: string | null
          id: string
          is_admin: boolean
          name: string
          updated_at: string
        }
        Insert: {
          allow_admin_access?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_admin?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          allow_admin_access?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_admin?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          is_closer: boolean | null
          is_mentor: boolean
          is_onboarding: boolean | null
          name: string | null
          permission_group_id: string | null
          role: string | null
          status: string
          storage_limit_mb: number | null
          storage_used_mb: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          is_closer?: boolean | null
          is_mentor?: boolean
          is_onboarding?: boolean | null
          name?: string | null
          permission_group_id?: string | null
          role?: string | null
          status?: string
          storage_limit_mb?: number | null
          storage_used_mb?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_closer?: boolean | null
          is_mentor?: boolean
          is_onboarding?: boolean | null
          name?: string | null
          permission_group_id?: string | null
          role?: string | null
          status?: string
          storage_limit_mb?: number | null
          storage_used_mb?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_permission_group_id_fkey"
            columns: ["permission_group_id"]
            isOneToOne: false
            referencedRelation: "permission_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      security_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      software_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      storage_upgrades: {
        Row: {
          admin_id: string
          id: string
          new_limit_mb: number
          notes: string | null
          previous_limit_mb: number
          upgrade_amount_mb: number
          upgrade_date: string
          user_id: string
        }
        Insert: {
          admin_id: string
          id?: string
          new_limit_mb: number
          notes?: string | null
          previous_limit_mb: number
          upgrade_amount_mb: number
          upgrade_date?: string
          user_id: string
        }
        Update: {
          admin_id?: string
          id?: string
          new_limit_mb?: number
          notes?: string | null
          previous_limit_mb?: number
          upgrade_amount_mb?: number
          upgrade_date?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_webhook_events: {
        Row: {
          created_at: string | null
          credits_added: number | null
          error_message: string | null
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          retry_count: number | null
          session_id: string | null
          stripe_event_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credits_added?: number | null
          error_message?: string | null
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          retry_count?: number | null
          session_id?: string | null
          stripe_event_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credits_added?: number | null
          error_message?: string | null
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          retry_count?: number | null
          session_id?: string | null
          stripe_event_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_credit_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_menus: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          icon: string | null
          id: string
          menu_key: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          menu_key: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          menu_key?: string
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          module_key: string
          module_name: string
          sort_order: number | null
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          module_key: string
          module_name: string
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          module_key?: string
          module_name?: string
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          current_credits: number
          id: string
          monthly_limit: number
          renewal_date: string
          subscription_type: string | null
          updated_at: string
          used_this_month: number
          user_id: string
        }
        Insert: {
          created_at?: string
          current_credits?: number
          id?: string
          monthly_limit?: number
          renewal_date?: string
          subscription_type?: string | null
          updated_at?: string
          used_this_month?: number
          user_id: string
        }
        Update: {
          created_at?: string
          current_credits?: number
          id?: string
          monthly_limit?: number
          renewal_date?: string
          subscription_type?: string | null
          updated_at?: string
          used_this_month?: number
          user_id?: string
        }
        Relationships: []
      }
      user_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string | null
          file_size_mb: number
          file_type: string | null
          id: string
          supplier_id: string | null
          upload_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path?: string | null
          file_size_mb: number
          file_type?: string | null
          id?: string
          supplier_id?: string | null
          upload_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string | null
          file_size_mb?: number
          file_type?: string | null
          id?: string
          supplier_id?: string | null
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_storage: {
        Row: {
          created_at: string
          id: string
          storage_limit_mb: number
          storage_used_mb: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          storage_limit_mb?: number
          storage_used_mb?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          storage_limit_mb?: number
          storage_used_mb?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      youtube_cache: {
        Row: {
          created_at: string
          description: string | null
          duration: string
          id: string
          published_at: string
          thumbnail: string
          title: string
          updated_at: string
          video_id: string
          view_count: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: string
          id?: string
          published_at: string
          thumbnail: string
          title: string
          updated_at?: string
          video_id: string
          view_count?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string
          id?: string
          published_at?: string
          thumbnail?: string
          title?: string
          updated_at?: string
          video_id?: string
          view_count?: string
        }
        Relationships: []
      }
      youtube_channel_info: {
        Row: {
          channel_id: string
          channel_name: string
          created_at: string
          id: string
          last_sync: string
          subscriber_count: string
          sync_status: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          channel_name: string
          created_at?: string
          id?: string
          last_sync?: string
          subscriber_count?: string
          sync_status?: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          channel_name?: string
          created_at?: string
          id?: string
          last_sync?: string
          subscriber_count?: string
          sync_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      youtube_sync_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          status: string
          sync_duration_ms: number | null
          sync_type: string
          videos_synced: number
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          status: string
          sync_duration_ms?: number | null
          sync_type?: string
          videos_synced?: number
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          status?: string
          sync_duration_ms?: number | null
          sync_type?: string
          videos_synced?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_storage_upgrade: {
        Args: {
          target_user_id: string
          admin_user_id: string
          upgrade_mb: number
          upgrade_notes?: string
        }
        Returns: boolean
      }
      admin_adjust_user_credits: {
        Args: {
          target_user_id: string
          adjustment_amount: number
          adjustment_type: string
          reason: string
        }
        Returns: Json
      }
      calculate_user_storage_usage: {
        Args: { user_uuid: string }
        Returns: number
      }
      can_access_permission_groups: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      can_user_upload: {
        Args: { user_uuid: string; file_size_mb: number }
        Returns: boolean
      }
      cleanup_old_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      detect_contact_inconsistencies: {
        Args: Record<PropertyKey, never>
        Returns: {
          lead_id: string
          lead_name: string
          scheduled_date: string
          actual_next_contact: string
          inconsistent: boolean
        }[]
      }
      detect_suspicious_activity: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      drop_policies_for_table: {
        Args: { table_name: string }
        Returns: undefined
      }
      ensure_user_credits: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      execute_sql: {
        Args: { sql: string }
        Returns: undefined
      }
      generate_bonus_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_session_name: {
        Args: { first_message: string }
        Returns: string
      }
      generate_webhook_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_allowed_menus: {
        Args: Record<PropertyKey, never>
        Returns: {
          menu_key: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_allowed_modules: {
        Args: { user_id: string }
        Returns: {
          module_key: string
          module_name: string
          actions: string[]
        }[]
      }
      has_crm_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      renew_monthly_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_overdue_contacts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_storage_counter: {
        Args: { user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
