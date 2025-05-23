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
          name: string | null
          permission_group_id: string | null
          role: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          permission_group_id?: string | null
          role?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          permission_group_id?: string | null
          role?: string | null
          status?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_permission_groups: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      drop_policies_for_table: {
        Args: { table_name: string }
        Returns: undefined
      }
      execute_sql: {
        Args: { sql: string }
        Returns: undefined
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
