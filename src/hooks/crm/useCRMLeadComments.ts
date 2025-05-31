
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadComment } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadComments = (leadId: string) => {
  const [comments, setComments] = useState<CRMLeadComment[]>([]);
  const [loading, setLoading] = useState(true);

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

  const addComment = async (content: string, mentions: string[] = []) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('crm_lead_comments')
        .insert({
          lead_id: leadId,
          user_id: user.id,
          content,
          mentions
        });

      if (error) throw error;
      
      await fetchComments();
      toast.success('Comentário adicionado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário');
      return false;
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId);

      if (error) throw error;
      
      await fetchComments();
      toast.success('Comentário atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      toast.error('Erro ao atualizar comentário');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      await fetchComments();
      toast.success('Comentário removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover comentário:', error);
      toast.error('Erro ao remover comentário');
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchComments();
    }
  }, [leadId]);

  return { 
    comments, 
    loading, 
    addComment,
    updateComment,
    deleteComment
  };
};
