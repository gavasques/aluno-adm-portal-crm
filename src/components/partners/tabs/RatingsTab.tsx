
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface RatingsTabProps {
  partner: Partner;
  ratingText: string;
  onRatingTextChange: (text: string) => void;
  onAddRating: () => void;
  onLikeRating: (ratingId: number) => void;
  calculateAverageRating: (ratings: any[]) => string;
}

const RatingsTab: React.FC<RatingsTabProps> = ({
  partner,
  ratingText,
  onRatingTextChange,
  onAddRating,
  onLikeRating,
  calculateAverageRating
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Avaliações</CardTitle>
        <div>
          Avaliação média: {calculateAverageRating(partner.ratings)}/5
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {partner.ratings && partner.ratings.map((rating) => (
            <div key={rating.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">{rating.user}</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-gray-700">{rating.comment}</p>
              <div className="mt-2">
                <Button variant="ghost" size="sm" onClick={() => onLikeRating(rating.id)}>
                  <Star className="h-4 w-4 mr-1" />
                  {rating.likes} likes
                </Button>
              </div>
            </div>
          ))}

          {(!partner.ratings || partner.ratings.length === 0) && (
            <p className="text-center py-4 text-gray-500">
              Nenhuma avaliação disponível.
            </p>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Adicionar avaliação</h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-6 w-6 cursor-pointer text-yellow-400 fill-yellow-400" 
              />
            ))}
          </div>
          <textarea 
            className="w-full border rounded-md p-2 min-h-[100px]" 
            placeholder="Digite sua avaliação..."
            value={ratingText}
            onChange={(e) => onRatingTextChange(e.target.value)}
          />
          <Button className="mt-2" onClick={onAddRating}>
            <Star className="mr-2 h-4 w-4" />
            Enviar Avaliação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingsTab;
