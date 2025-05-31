
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadHistory } from '@/types/crm.types';

export const useCRMLeadHistory = (leadId: string) => {
  const [history, setHistory] = useState<CRMLeadHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crm_lead_history')
          .select(`
            *,
            user:profiles!crm_lead_history_user_id_fkey(id, name, email)
          `)
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match expected type
        const transformedHistory = (data || []).map(item => ({
          id: item.id,
          lead_id: item.lead_id || '',
          user_id: item.user_id || '',
          action_type: item.action_type,
          field_name: item.field_name || undefined,
          old_value: item.old_value || undefined,
          new_value: item.new_value || undefined,
          description: item.description || '',
          created_at: item.created_at || new Date().toISOString(),
          user: item.user ? {
            id: item.user.id,
            name: item.user.name,
            email: item.user.email
          } : undefined
        }));

        setHistory(transformedHistory);
      } catch (error) {
        console.error('Erro ao buscar histórico do lead:', error);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchHistory();
    }
  }, [leadId]);

  return { history, loading };
};
