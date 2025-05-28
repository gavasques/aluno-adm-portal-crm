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
          stripe_session_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          stripe_session_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          stripe_session_id?: string | null
          type?: string
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
          is_mentor: boolean
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
          is_mentor?: boolean
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
          is_mentor?: boolean
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
      detect_suspicious_activity: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      drop_policies_for_table: {
        Args: { table_name: string }
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      renew_monthly_credits: {
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
