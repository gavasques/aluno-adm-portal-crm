
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadComment } from '@/types/crm.types';

export const useCRMLeadComments = (leadId: string) => {
  const [comments, setComments] = useState<CRMLeadComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crm_lead_comments')
          .select(`
            *,
            user:profiles!crm_lead_comments_user_id_fkey(id, name, email, avatar_url)
          `)
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match expected type
        const transformedComments = (data || []).map(comment => ({
          ...comment,
          user: comment.user ? {
            id: comment.user.id,
            name: comment.user.name,
            email: comment.user.email,
            avatar_url: comment.user.avatar_url
          } : undefined
        }));

        setComments(transformedComments);
      } catch (error) {
        console.error('Erro ao buscar comentários do lead:', error);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchComments();
    }
  }, [leadId]);

  return { comments, loading };
};
