
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, 
  AlertDialogAction } from "@/components/ui/alert-dialog";
import { Star, MessageSquare, Users, Trash } from "lucide-react";
import { Partner } from "@/hooks/usePartnersState";

interface CommentsTabProps {
  partner: Partner;
  commentText: string;
  setCommentText: (value: string) => void;
  handleAddComment: () => void;
  handleLikeComment: (commentId: number) => void;
  handleDeleteComment: (commentId: number) => void;
}

const CommentsTab = ({
  partner,
  commentText,
  setCommentText,
  handleAddComment,
  handleLikeComment,
  handleDeleteComment
}: CommentsTabProps) => {
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
                <Button variant="ghost" size="sm" className="h-8 text-gray-500" onClick={() => handleLikeComment(comment.id)}>
                  <Star className="h-4 w-4 mr-1" />
                  {comment.likes} likes
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Responder
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-red-500">
                      <Trash className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
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
              </div>
              
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 space-y-4">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="pt-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="font-medium text-sm">{reply.user}</span>
                        </div>
                        <span className="text-xs text-gray-500">{reply.date}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
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
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button className="mt-2" onClick={handleAddComment}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Comentário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
