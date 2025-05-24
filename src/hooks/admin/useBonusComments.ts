
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: Date;
  likes: number;
  userLiked: boolean;
}

export const useBonusComments = (bonusId: string | undefined) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!bonusId) return;
    
    const storedComments = localStorage.getItem(`bonus_${bonusId}_comments`);
    if (storedComments) {
      setComments(JSON.parse(storedComments).map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt)
      })));
    }
  }, [bonusId]);

  const addComment = () => {
    if (!newComment.trim() || !bonusId) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      authorName: "Administrador",
      createdAt: new Date(),
      likes: 0,
      userLiked: false
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`bonus_${bonusId}_comments`, JSON.stringify(updatedComments));
    setNewComment("");
    toast.success("Comentário adicionado!");
  };
  
  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const userLiked = !comment.userLiked;
        return {
          ...comment,
          likes: userLiked ? comment.likes + 1 : comment.likes - 1,
          userLiked
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    if (bonusId) {
      localStorage.setItem(`bonus_${bonusId}_comments`, JSON.stringify(updatedComments));
    }
  };
  
  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    if (bonusId) {
      localStorage.setItem(`bonus_${bonusId}_comments`, JSON.stringify(updatedComments));
    }
    toast.success("Comentário removido!");
  };

  return {
    comments,
    newComment,
    setNewComment,
    addComment,
    handleLikeComment,
    deleteComment
  };
};
