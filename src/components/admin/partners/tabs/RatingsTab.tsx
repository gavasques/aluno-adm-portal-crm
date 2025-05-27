
import React from "react";
import { Star } from "lucide-react";

interface RatingsTabProps {
  partnerId: number;
}

export const RatingsTab: React.FC<RatingsTabProps> = ({ partnerId }) => {
  return (
    <div className="text-center py-8">
      <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500">Nenhuma avaliação disponível</p>
    </div>
  );
};
