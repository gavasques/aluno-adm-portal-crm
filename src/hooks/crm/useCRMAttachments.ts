
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadAttachment } from '@/types/crm.types';

export const useCRMAttachments = (leadId: string) => {
  const [attachments, setAttachments] = useState<CRMLeadAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_lead_attachments')
        .select(`
          *,
          user:profiles!crm_lead_attachments_user_id_fkey(id, name, email)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match expected type
      const transformedAttachments = (data || []).map(attachment => ({
        ...attachment,
        user: attachment.user ? {
          id: attachment.user.id,
          name: attachment.user.name,
          email: attachment.user.email
        } : undefined
      }));

      setAttachments(transformedAttachments);
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchAttachments();
    }
  }, [leadId]);

  return {
    attachments,
    loading,
    refetch: fetchAttachments
  };
};
