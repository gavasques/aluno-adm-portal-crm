
import { useState } from "react";
import { Partner } from "@/types/partner.types";
import { useToast } from "@/hooks/use-toast";

export const usePartnerComments = (
  selectedPartner: Partner | null, 
  setSelectedPartner: (partner: Partner | null) => void,
  updatePartner: (partner: Partner) => void
) => {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  
  const handleAddComment = () => {
    if (selectedPartner && commentText) {
      const newComment = {
        id: Date.now(),
        user: "Admin",
        text: commentText,
        date: new Date().toLocaleDateString(),
        likes: 0
      };
      
      const updatedComments = [...(selectedPartner.comments || []), newComment];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Comentário adicionado",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments,
        history: updatedHistory
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
      setCommentText("");
      
      toast({
        title: "Comentário adicionado com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleLikeComment = (commentId: number) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      });
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
    }
  };
  
  const handleDeleteComment = (commentId: number) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.filter(comment => comment.id !== commentId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Comentário removido",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments,
        history: updatedHistory
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
      
      toast({
        title: "Comentário removido com sucesso!",
        variant: "default",
      });
    }
  };
  
  return {
    commentText,
    setCommentText,
    handleAddComment,
    handleLikeComment,
    handleDeleteComment
  };
};
