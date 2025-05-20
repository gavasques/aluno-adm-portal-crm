
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MessageSquare, ThumbsUp, Reply, Trash, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CommentReply {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
}

interface CommentItem {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  likes: number;
  userLiked: boolean;
  replies: CommentReply[];
}

interface CommentsTabProps {
  comments: CommentItem[];
  onUpdate: (comments: CommentItem[]) => void;
}

const CommentsTab: React.FC<CommentsTabProps> = ({ comments, onUpdate }) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usuário atual (simulado)
  const currentUser = {
    id: 1,
    name: "Usuário Atual",
    avatar: ""
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Por favor, escreva um comentário antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    
    // Simular atraso de rede
    setTimeout(() => {
      const newCommentObj: CommentItem = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: newComment,
        date: new Date().toISOString(),
        likes: 0,
        userLiked: false,
        replies: []
      };
      
      onUpdate([newCommentObj, ...comments]);
      setNewComment("");
      setIsSubmitting(false);
      toast.success("Comentário adicionado com sucesso!");
    }, 500);
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) {
      toast.error("Por favor, escreva uma resposta antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    
    // Simular atraso de rede
    setTimeout(() => {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now(),
                userId: currentUser.id,
                userName: currentUser.name,
                userAvatar: currentUser.avatar,
                content: replyContent,
                date: new Date().toISOString()
              }
            ]
          };
        }
        return comment;
      });
      
      onUpdate(updatedComments);
      setReplyingTo(null);
      setReplyContent("");
      setIsSubmitting(false);
      toast.success("Resposta adicionada com sucesso!");
    }, 500);
  };

  const handleLikeComment = (commentId: number) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
          userLiked: !comment.userLiked
        };
      }
      return comment;
    });
    
    onUpdate(updatedComments);
    toast.success("Ação registrada com sucesso!");
  };

  const handleDeleteComment = (commentId: number) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    onUpdate(updatedComments);
    toast.success("Comentário excluído com sucesso!");
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (e) {
      return "data desconhecida";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Comentários</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Área para adicionar novo comentário */}
        <div className="mb-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              {currentUser.avatar && <AvatarImage src={currentUser.avatar} alt={currentUser.name} />}
            </Avatar>
            <div className="flex-1">
              <Textarea 
                placeholder="Adicione um comentário..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] mb-2"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddComment} 
                  disabled={isSubmitting || !newComment.trim()}
                  className="flex gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Enviando..." : "Comentar"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de comentários */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-6 last:border-b-0">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    {comment.userAvatar && <AvatarImage src={comment.userAvatar} alt={comment.userName} />}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{comment.userName}</h4>
                        <p className="text-xs text-gray-500">{formatDate(comment.date)}</p>
                      </div>
                      {comment.userId === currentUser.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    
                    <p className="mt-1">{comment.content}</p>
                    
                    <div className="flex gap-4 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`flex gap-1 h-7 ${comment.userLiked ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {comment.likes > 0 && (
                          <span>{comment.likes}</span>
                        )}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex gap-1 h-7 text-gray-500"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="h-4 w-4" />
                        <span>Responder</span>
                      </Button>
                    </div>
                    
                    {/* Área de resposta */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 ml-6">
                        <Textarea 
                          placeholder="Adicione uma resposta..." 
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[60px] mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleAddReply(comment.id)} 
                            disabled={isSubmitting || !replyContent.trim()}
                          >
                            {isSubmitting ? "Enviando..." : "Responder"}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Respostas */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{reply.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                              {reply.userAvatar && <AvatarImage src={reply.userAvatar} alt={reply.userName} />}
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-sm">{reply.userName}</h5>
                                <span className="text-xs text-gray-500">{formatDate(reply.date)}</span>
                              </div>
                              <p className="text-sm mt-1">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
