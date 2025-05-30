
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMLeadComment } from '@/types/crm.types';
import RichCommentEditor from '../comments/RichCommentEditor';
import CommentItem from '../comments/CommentItem';

interface LeadCommentsTabProps {
  leadId: string;
}

const LeadCommentsTab = ({ leadId }: LeadCommentsTabProps) => {
  const [comments, setComments] = useState<CRMLeadComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    getCurrentUser();
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

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

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

  const handleAddComment = async (content: string, mentions: string[]) => {
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('crm_lead_comments')
        .insert({
          lead_id: leadId,
          user_id: currentUserId,
          content,
          mentions
        });

      if (error) throw error;
      
      toast.success('Comentário adicionado!');
      
      // Enviar notificações para usuários mencionados
      if (mentions.length > 0) {
        await sendMentionNotifications(mentions, content);
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_comments')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;
      toast.success('Comentário atualizado!');
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      toast.error('Erro ao editar comentário');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      toast.success('Comentário removido!');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      toast.error('Erro ao deletar comentário');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    // Implementar sistema de likes se necessário
    console.log('Like comment:', commentId);
  };

  // Corrigir a assinatura da função handleReply
  const handleReply = async (parentId: string, content: string, mentions: string[]) => {
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('crm_lead_comments')
        .insert({
          lead_id: leadId,
          user_id: currentUserId,
          parent_id: parentId,
          content,
          mentions
        });

      if (error) throw error;
      
      toast.success('Resposta adicionada!');
      
      // Enviar notificações para usuários mencionados
      if (mentions.length > 0) {
        await sendMentionNotifications(mentions, content);
      }
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
      toast.error('Erro ao adicionar resposta');
    } finally {
      setSubmitting(false);
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

  // Organizar comentários por thread (comentários principais e respostas)
  const organizeComments = (comments: CRMLeadComment[]) => {
    const commentMap = new Map();
    const rootComments = [];

    // Primeiro, mapear todos os comentários
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Organizar em threads
    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
  };

  const organizedComments = organizeComments(comments);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-4">
          Comentários ({comments.length})
        </h3>
        
        <RichCommentEditor
          onSubmit={handleAddComment}
          disabled={submitting}
          placeholder="Escreva um comentário... Use @ para mencionar alguém"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {organizedComments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum comentário</h4>
              <p className="text-gray-500 text-center">
                Seja o primeiro a comentar sobre este lead
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {organizedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onLike={handleLikeComment}
                onReply={handleReply}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                replies={comment.replies}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCommentsTab;
