
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useCRMLeadComments } from '@/hooks/crm/useCRMLeadComments';
import { CRMLeadComment } from '@/types/crm.types';
import CommentEditor from '../comments/CommentEditor';
import CommentItem from '../comments/CommentItem';

interface LeadCommentsTabProps {
  leadId: string;
}

const LeadCommentsTab = ({ leadId }: LeadCommentsTabProps) => {
  const { comments, loading, addComment, updateComment, deleteComment } = useCRMLeadComments(leadId);

  const handleAddComment = async (content: string, mentions: string[]) => {
    await addComment(content, mentions);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    await updateComment(commentId, content);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      await deleteComment(commentId);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    // Implementar sistema de likes se necessário
    console.log('Like comment:', commentId);
  };

  const handleReply = async (parentId: string, content: string, mentions: string[]) => {
    // Por enquanto, tratamos respostas como comentários normais
    await addComment(content, mentions);
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
        
        <CommentEditor
          onSubmit={handleAddComment}
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
                currentUserId="current-user-id" // TODO: Pegar do contexto de auth
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
