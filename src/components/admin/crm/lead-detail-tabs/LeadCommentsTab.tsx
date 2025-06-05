
import React from 'react';
import { useCRMLeadComments } from '@/hooks/crm/useCRMLeadComments';
import { MessageSquare, User, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CommentEditor from '../comments/CommentEditor';
import { useState } from 'react';

interface LeadCommentsTabProps {
  leadId: string;
}

const LeadCommentsTab = ({ leadId }: LeadCommentsTabProps) => {
  const { comments, loading, addComment, updateComment, deleteComment } = useCRMLeadComments(leadId);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const handleSubmitComment = async (content: string, mentions: string[] = []) => {
    const success = await addComment(content, mentions);
    if (success) {
      setShowEditor(false);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    await updateComment(commentId, content);
    setEditingCommentId(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Tem certeza que deseja remover este comentário?')) {
      await deleteComment(commentId);
    }
  };

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          Comentários ({comments.length})
        </h3>
        <Button
          size="sm"
          onClick={() => setShowEditor(!showEditor)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Comentário
        </Button>
      </div>

      {/* Editor de comentário */}
      {showEditor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 flex-shrink-0"
        >
          <CommentEditor
            onSubmit={handleSubmitComment}
            onCancel={() => setShowEditor(false)}
            showCancel={true}
            placeholder="Escreva um comentário sobre este lead..."
          />
        </motion.div>
      )}
      
      {comments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">Nenhum comentário para este lead ainda</p>
            <Button
              onClick={() => setShowEditor(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Comentário
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.user?.avatar_url ? (
                    <img 
                      src={comment.user.avatar_url} 
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {comment.user?.name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCommentId(comment.id)}
                        className="text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <CommentEditor
                      initialContent={comment.content}
                      onSubmit={(content) => handleEditComment(comment.id, content)}
                      onCancel={() => setEditingCommentId(null)}
                      showCancel={true}
                      placeholder="Edite seu comentário..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700 break-words">
                      {comment.content}
                    </p>
                  )}
                  
                  {comment.updated_at !== comment.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Editado {formatDistanceToNow(new Date(comment.updated_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadCommentsTab;
