
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Reply, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CRMLeadComment } from '@/types/crm.types';
import RichCommentEditor from './RichCommentEditor';

interface CommentItemProps {
  comment: CRMLeadComment;
  currentUserId?: string;
  onLike?: (commentId: string) => void;
  onReply?: (parentId: string, content: string, mentions: string[]) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  isReply?: boolean;
  replies?: CRMLeadComment[];
}

const CommentItem = ({
  comment,
  currentUserId,
  onLike,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
  replies = []
}: CommentItemProps) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(comment.id);
  };

  const handleReplySubmit = (content: string, mentions: string[]) => {
    onReply?.(comment.id, content, mentions);
    setShowReplyEditor(false);
  };

  const handleEditSubmit = (content: string, mentions: string[]) => {
    onEdit?.(comment.id, content);
    setIsEditing(false);
  };

  const renderFormattedContent = (content: string) => {
    // Converter markdown básico para HTML
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/@(\w+)/g, '<span class="mention">@$1</span>');

    return (
      <div 
        className="text-sm whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formatted }}
        style={{
          wordBreak: 'break-word'
        }}
      />
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`space-y-3 ${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            {comment.user ? getInitials(comment.user.name) : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {comment.user?.name || 'Usuário'}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
                {comment.updated_at !== comment.created_at && (
                  <Badge variant="secondary" className="text-xs">
                    Editado
                  </Badge>
                )}
              </div>
              
              {currentUserId === comment.user_id && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    onClick={() => onDelete?.(comment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <RichCommentEditor
                  onSubmit={handleEditSubmit}
                  placeholder="Editar comentário..."
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleEditSubmit(editContent, [])}
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {renderFormattedContent(comment.content)}
                
                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {comment.mentions.map((mention, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        @{mention}
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex items-center gap-4 mt-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-1 h-7 px-2 ${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount > 0 ? likesCount : 'Curtir'}</span>
              </Button>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyEditor(!showReplyEditor)}
                  className="flex items-center gap-1 h-7 px-2 text-gray-500"
                >
                  <Reply className="h-4 w-4" />
                  Responder
                </Button>
              )}
            </div>
          )}
          
          {showReplyEditor && (
            <div className="mt-3">
              <RichCommentEditor
                onSubmit={handleReplySubmit}
                placeholder="Escreva uma resposta..."
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setShowReplyEditor(false)}
              >
                Cancelar
              </Button>
            </div>
          )}
          
          {replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onLike={onLike}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
