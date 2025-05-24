
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Heart, 
  Reply, 
  MoreHorizontal,
  Paperclip,
  Send,
  Trash2,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  userLiked: boolean;
  replies?: Comment[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

interface CommentSystemProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string, attachments?: File[]) => void;
  onLikeComment: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  currentUserId?: string;
  placeholder?: string;
  allowAttachments?: boolean;
  className?: string;
}

const CommentSystem = ({
  comments,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onEditComment,
  currentUserId,
  placeholder = "Escreva um comentário...",
  allowAttachments = true,
  className = ''
}: CommentSystemProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, undefined, attachments);
      setNewComment('');
      setAttachments([]);
    }
  };

  const handleSubmitReply = () => {
    if (replyContent.trim() && replyToId) {
      onAddComment(replyContent, replyToId);
      setReplyContent('');
      setReplyToId(null);
    }
  };

  const handleSubmitEdit = () => {
    if (editContent.trim() && editingId && onEditComment) {
      onEditComment(editingId, editContent);
      setEditContent('');
      setEditingId(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.authorAvatar} />
          <AvatarFallback>
            {comment.authorName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.authorName}</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
              </div>
              
              {currentUserId === comment.authorId && (
                <div className="flex gap-1">
                  {onEditComment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  {onDeleteComment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {editingId === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-16"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSubmitEdit}>
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{comment.content}</p>
            )}
            
            {comment.attachments && comment.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {comment.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 text-xs">
                    <Paperclip className="h-3 w-3" />
                    <a 
                      href={attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {attachment.name}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLikeComment(comment.id)}
              className={`flex items-center gap-1 ${comment.userLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`h-4 w-4 ${comment.userLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyToId(comment.id)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Responder
              </Button>
            )}
          </div>
          
          {replyToId === comment.id && (
            <div className="space-y-2">
              <Textarea
                placeholder="Escreva uma resposta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-16"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitReply}>
                  <Send className="h-4 w-4 mr-1" />
                  Responder
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyToId(null);
                    setReplyContent('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* New Comment Form */}
      <div className="space-y-3">
        <Textarea
          placeholder={placeholder}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-20"
        />
        
        {allowAttachments && (
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="comment-attachments"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="comment-attachments" className="cursor-pointer">
                <Paperclip className="h-4 w-4 mr-1" />
                Anexar
              </label>
            </Button>
            
            {attachments.length > 0 && (
              <div className="flex gap-1">
                {attachments.map((file, index) => (
                  <Badge key={index} variant="secondary">
                    {file.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-1" />
            Comentar
          </Button>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum comentário ainda</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;
