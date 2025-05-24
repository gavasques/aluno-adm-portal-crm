
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface CommentsTabProps {
  partner: Partner;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: () => void;
  onLikeComment: (commentId: number) => void;
}

const CommentsTab: React.FC<CommentsTabProps> = ({
  partner,
  commentText,
  onCommentTextChange,
  onAddComment,
  onLikeComment
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Comentários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {partner.comments && partner.comments.map((comment) => (
            <div key={comment.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">{comment.user}</span>
                </div>
                <span className="text-sm text-gray-500">{comment.date}</span>
              </div>
              <p className="mt-2 text-gray-700">{comment.text}</p>
              <div className="mt-2 flex items-center">
                <Button variant="ghost" size="sm" className="h-8 text-gray-500" onClick={() => onLikeComment(comment.id)}>
                  <Star className="h-4 w-4 mr-1" />
                  {comment.likes} likes
                </Button>
              </div>
            </div>
          ))}

          {(!partner.comments || partner.comments.length === 0) && (
            <p className="text-center py-4 text-gray-500">
              Nenhum comentário disponível.
            </p>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Adicionar comentário</h3>
          <textarea 
            className="w-full border rounded-md p-2 min-h-[100px]" 
            placeholder="Digite seu comentário..."
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
          />
          <Button className="mt-2" onClick={onAddComment}>
            <Users className="mr-2 h-4 w-4" />
            Enviar Comentário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
