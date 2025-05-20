
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageCircle, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Tool } from "../ToolsTable";

interface CommentsTabProps {
  tool: Tool;
  onUpdateTool: (updatedTool: Tool) => void;
}

const CommentsTab: React.FC<CommentsTabProps> = ({ tool, onUpdateTool }) => {
  const [newComment, setNewComment] = useState("");
  const [isReplyingTo, setIsReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  
  const handleAddComment = () => {
    if (newComment.trim() === "") {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    const newCommentObj = {
      id: Date.now(),
      user: "Usuário Atual",
      text: newComment,
      date: new Date().toLocaleDateString(),
      likes: 0,
      replies: [],
    };
    
    const updatedTool = {
      ...tool,
      comments_list: [...tool.comments_list, newCommentObj]
    };
    
    onUpdateTool(updatedTool);
    toast.success("Comentário adicionado com sucesso!");
    setNewComment("");
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) {
      toast.error("A resposta não pode estar vazia");
      return;
    }

    const newReply = {
      id: Date.now(),
      user: "Usuário Atual",
      text: replyText,
      date: new Date().toLocaleDateString(),
      likes: 0,
    };
    
    const updatedComments = tool.comments_list.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    });
    
    const updatedTool = {
      ...tool,
      comments_list: updatedComments
    };
    
    onUpdateTool(updatedTool);
    toast.success("Resposta adicionada com sucesso!");
    setReplyText("");
    setIsReplyingTo(null);
  };

  const handleLike = (itemId, type) => {
    let updatedTool;
    
    if (type === "comment") {
      const updatedComments = tool.comments_list.map(comment => {
        if (comment.id === itemId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      });
      updatedTool = { ...tool, comments_list: updatedComments };
    } else if (type === "reply") {
      const updatedComments = tool.comments_list.map(comment => {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === itemId) {
              return { ...reply, likes: reply.likes + 1 };
            }
            return reply;
          })
        };
      });
      updatedTool = { ...tool, comments_list: updatedComments };
    }
    
    if (updatedTool) {
      onUpdateTool(updatedTool);
      toast.success("Like adicionado!");
    }
  };
  
  return (
    <Card>
      <CardContent className="py-6">
        {tool.comments_list && tool.comments_list.length > 0 ? (
          <div className="space-y-6 mb-6">
            {tool.comments_list.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {comment.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{comment.user}</p>
                      <p className="text-sm text-gray-500">{comment.date}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-3">{comment.text}</p>
                <div className="mt-3 flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={(e) => {
                      e.preventDefault(); 
                      handleLike(comment.id, 'comment');
                    }}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" /> {comment.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => setIsReplyingTo(comment.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" /> Responder
                  </Button>
                </div>
                
                {isReplyingTo === comment.id && (
                  <div className="mt-4 ml-8 bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        {"U"}
                      </div>
                      <p className="font-medium text-sm">Usuário Atual</p>
                    </div>
                    <Textarea 
                      placeholder="Digite sua resposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px] mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsReplyingTo(null)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddReply(comment.id)}
                      >
                        <MessageSquarePlus className="h-4 w-4 mr-1" /> Responder
                      </Button>
                    </div>
                  </div>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 pl-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            {reply.user.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{reply.user}</p>
                            <p className="text-xs text-gray-500">{reply.date}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{reply.text}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500 text-xs mt-1"
                          onClick={(e) => {
                            e.preventDefault(); 
                            handleLike(reply.id, 'reply');
                          }}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" /> {reply.likes}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 mb-6">
            Nenhum comentário disponível.
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Adicionar comentário</h3>
          <Textarea 
            className="min-h-[100px]" 
            placeholder="Digite seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button className="mt-2" onClick={handleAddComment}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Enviar Comentário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
