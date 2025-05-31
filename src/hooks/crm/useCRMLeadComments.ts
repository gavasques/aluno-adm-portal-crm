
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadComment } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadComments = (leadId: string) => {
  const [comments, setComments] = useState<CRMLeadComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_comments')
        .select(`
          *,
          user:profiles!crm_lead_comments_user_id_fkey(name, avatar_url)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      toast.error('Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, mentions: string[] = []) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

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
      toast.success('Comentário adicionado!');
      
      // Enviar notificações para usuários mencionados
      if (mentions.length > 0) {
        await sendMentionNotifications(mentions, content);
      }
      
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
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;
      await fetchComments();
      toast.success('Comentário atualizado!');
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      toast.error('Erro ao editar comentário');
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
      toast.success('Comentário removido!');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      toast.error('Erro ao deletar comentário');
    }
  };

  const sendMentionNotifications = async (mentions: string[], content: string) => {
    try {
      const notifications = mentions.map(userId => ({
        user_id: userId,
        lead_id: leadId,
        type: 'mention' as const,
        title: 'Você foi mencionado em um comentário',
        message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        read: false
      }));

      const { error } = await supabase
        .from('crm_notifications')
        .insert(notifications);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`lead-comments-${leadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_lead_comments',
          filter: `lead_id=eq.${leadId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leadId]);

  return {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    fetchComments
  };
};
