
import React, { useState } from 'react';
import { MessageSquare, User, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCRMLeadComments } from '@/hooks/crm/useCRMLeadComments';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import CommentEditor from '../comments/CommentEditor';

interface RecentCommentsProps {
  leadId: string;
}

export const RecentComments = ({ leadId }: RecentCommentsProps) => {
  const { comments, loading, addComment } = useCRMLeadComments(leadId);
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmitComment = async (content: string, mentions: string[]) => {
    const success = await addComment(content, mentions);
    if (success) {
      setShowEditor(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          Comentários Recentes ({comments.length})
        </h3>
        <Button
          size="sm"
          onClick={() => setShowEditor(!showEditor)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Comentar
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
            <p className="text-gray-500 text-sm">Nenhum comentário ainda</p>
            <p className="text-gray-400 text-xs">Seja o primeiro a comentar</p>
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
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user?.name || 'Usuário'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
