import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BonusComment } from "@/types/bonus.types";

export const useBonusComments = (bonusId: string) => {
  const [comments, setComments] = useState<BonusComment[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar comentários
  const loadComments = async () => {
    if (!bonusId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bonus_comments')
        .select('*')
        .eq('bonus_id', bonusId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar comentários:', error);
        toast.error('Erro ao carregar comentários');
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar comentários');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar comentário
  const addComment = async (content: string, authorName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Você precisa estar logado para comentar');
        return false;
      }

      const { data, error } = await supabase
        .from('bonus_comments')
        .insert([{
          bonus_id: bonusId,
          user_id: user.id,
          content,
          author_name: authorName
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar comentário:', error);
        toast.error('Erro ao adicionar comentário');
        return false;
      }

      setComments(prev => [data, ...prev]);
      toast.success('Comentário adicionado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao adicionar comentário');
      return false;
    }
  };

  // Curtir/descurtir comentário
  const toggleLike = async (commentId: string) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      const newLiked = !comment.user_liked;
      const newLikes = newLiked ? comment.likes + 1 : comment.likes - 1;

      const { error } = await supabase
        .from('bonus_comments')
        .update({
          likes: newLikes,
          user_liked: newLiked
        })
        .eq('id', commentId);

      if (error) {
        console.error('Erro ao curtir comentário:', error);
        toast.error('Erro ao curtir comentário');
        return;
      }

      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, likes: newLikes, user_liked: newLiked }
          : c
      ));
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao curtir comentário');
    }
  };

  // Excluir comentário
  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('bonus_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Erro ao excluir comentário:', error);
        toast.error('Erro ao excluir comentário');
        return false;
      }

      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comentário excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao excluir comentário');
      return false;
    }
  };

  useEffect(() => {
    loadComments();
  }, [bonusId]);

  return {
    comments,
    loading,
    addComment,
    toggleLike,
    deleteComment,
    loadComments
  };
};
