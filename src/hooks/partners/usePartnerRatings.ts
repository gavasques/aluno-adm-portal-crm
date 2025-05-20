
import { useState } from "react";
import { Partner } from "@/types/partner.types";
import { useToast } from "@/hooks/use-toast";

export const usePartnerRatings = (
  selectedPartner: Partner | null, 
  setSelectedPartner: (partner: Partner | null) => void,
  updatePartner: (partner: Partner) => void
) => {
  const { toast } = useToast();
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingText, setRatingText] = useState("");
  
  const handleAddRating = () => {
    if (selectedPartner && ratingText) {
      const newRating = {
        id: Date.now(),
        user: "Admin",
        rating: ratingValue,
        comment: ratingText,
        likes: 0
      };
      
      const updatedRatings = [...(selectedPartner.ratings || []), newRating];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Avaliação adicionada",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings,
        history: updatedHistory
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
      setRatingText("");
      setRatingValue(5);
      
      toast({
        title: "Avaliação adicionada com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleLikeRating = (ratingId: number) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.map(rating => {
        if (rating.id === ratingId) {
          return { ...rating, likes: rating.likes + 1 };
        }
        return rating;
      });
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
    }
  };
  
  const handleDeleteRating = (ratingId: number) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.filter(rating => rating.id !== ratingId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Avaliação removida",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings,
        history: updatedHistory
      };
      
      updatePartner(updatedPartner);
      setSelectedPartner(updatedPartner);
      
      toast({
        title: "Avaliação removida com sucesso!",
        variant: "default",
      });
    }
  };
  
  return {
    ratingValue,
    ratingText,
    setRatingValue,
    setRatingText,
    handleAddRating,
    handleLikeRating,
    handleDeleteRating
  };
};
