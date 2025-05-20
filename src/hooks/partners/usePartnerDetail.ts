
import { useState } from "react";
import { Partner } from "@/types/partner.types";

export const usePartnerDetail = () => {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  const handleOpenPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };
  
  const handleClosePartner = () => {
    setSelectedPartner(null);
  };
  
  const calculateAverageRating = (ratings: Partner["ratings"]): string => {
    if (!ratings || !ratings.length) return "0.0";
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  return {
    selectedPartner,
    setSelectedPartner,
    handleOpenPartner,
    handleClosePartner,
    calculateAverageRating
  };
};
