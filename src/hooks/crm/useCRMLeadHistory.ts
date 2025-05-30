
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadHistory } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadHistory = (leadId: string) => {
  const [history, setHistory] = useState<CRMLeadHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_history')
        .select(`
          *,
          user:profiles!crm_lead_history_user_id_fkey(name)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast explícito para garantir que action_type seja do tipo correto
      const typedHistory: CRMLeadHistory[] = (data || []).map(item => ({
        ...item,
        action_type: item.action_type as CRMLeadHistory['action_type']
      }));
      
      setHistory(typedHistory);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const addHistoryEntry = async (
    actionType: CRMLeadHistory['action_type'],
    description: string,
    fieldName?: string,
    oldValue?: string,
    newValue?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('crm_lead_history')
        .insert({
          lead_id: leadId,
          user_id: user?.id,
          action_type: actionType,
          description,
          field_name: fieldName,
          old_value: oldValue,
          new_value: newValue
        });

      if (error) throw error;
      await fetchHistory();
    } catch (error) {
      console.error('Erro ao adicionar entrada no histórico:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`lead-history-${leadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'crm_lead_history',
          filter: `lead_id=eq.${leadId}`
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leadId]);

  return {
    history,
    loading,
    addHistoryEntry,
    fetchHistory
  };
};
