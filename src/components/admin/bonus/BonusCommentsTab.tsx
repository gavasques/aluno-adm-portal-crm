
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: Date;
  likes: number;
  userLiked: boolean;
}

interface BonusCommentsTabProps {
  comments: Comment[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
  onLikeComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const BonusCommentsTab: React.FC<BonusCommentsTabProps> = ({
  comments,
  newComment,
  onNewCommentChange,
  onAddComment,
  onLikeComment,
  onDeleteComment
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="flex gap-2">
          <Textarea 
            placeholder="Adicionar um comentário..." 
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            className="flex-1"
            rows={3}
          />
          <Button onClick={onAddComment} className="self-start">
            Adicionar
          </Button>
        </div>
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{comment.authorName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <p className="text-base mb-4">{comment.text}</p>
                  <div className="flex justify-between">
                    <Button 
                      variant={comment.userLiked ? "default" : "outline"} 
                      size="sm"
                      onClick={() => onLikeComment(comment.id)}
                    >
                      {comment.likes} {comment.likes === 1 ? "Curtida" : "Curtidas"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1">Excluir</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusCommentsTab;
