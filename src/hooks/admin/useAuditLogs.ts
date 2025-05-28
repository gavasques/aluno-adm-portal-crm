
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditLog {
  id: string;
  user_id?: string;
  event_type: string;
  event_category: string;
  action: string;
  description?: string;
  entity_type?: string;
  entity_id?: string;
  risk_level: string; // Mudança: aceitar qualquer string do banco
  success: boolean;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
}

export interface AuditFilters {
  event_category?: string;
  risk_level?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export const useAuditLogs = (filters: AuditFilters = {}, limit = 100) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Aplicar filtros
      if (filters.event_category) {
        query = query.eq('event_category', filters.event_category);
      }
      if (filters.risk_level) {
        query = query.eq('risk_level', filters.risk_level);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,action.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar logs de auditoria:', error);
        setError('Erro ao carregar logs de auditoria');
        toast.error('Erro ao carregar logs de auditoria');
        return;
      }

      setLogs(data || []);
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro interno ao carregar logs');
      toast.error('Erro interno ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters.event_category, filters.risk_level, filters.user_id, filters.date_from, filters.date_to, filters.search]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs
  };
};
