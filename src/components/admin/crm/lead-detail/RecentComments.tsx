
import React from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';
import { useCRMLeadComments } from '@/hooks/crm/useCRMLeadComments';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface RecentCommentsProps {
  leadId: string;
}

export const RecentComments = ({ leadId }: RecentCommentsProps) => {
  const { comments, loading } = useCRMLeadComments(leadId);

  const recentComments = comments.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-purple-600" />
        Comentários Recentes
      </h3>
      
      {recentComments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhum comentário ainda</p>
          <p className="text-gray-400 text-xs">Seja o primeiro a comentar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50/50 rounded-lg p-4 border border-gray-200/50"
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
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {comment.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {comments.length > 3 && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                +{comments.length - 3} comentários adicionais
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
