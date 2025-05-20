import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Star, Users, Trash } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface RatingsTabProps {
  partner: Partner;
  calculateAverageRating: (ratings: any[]) => string;
  ratingValue: number;
  ratingText: string;
  setRatingValue: (value: number) => void;
  setRatingText: (value: string) => void;
  handleAddRating: () => void;
  handleLikeRating: (ratingId: number) => void;
  handleDeleteRating: (ratingId: number) => void;
}

const RatingsTab = ({
  partner,
  calculateAverageRating,
  ratingValue,
  ratingText,
  setRatingValue,
  setRatingText,
  handleAddRating,
  handleLikeRating,
  handleDeleteRating
}: RatingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Avaliações</CardTitle>
        <CardDescription>
          Avaliação média: {calculateAverageRating(partner.ratings)}/5
        </CardDescription>
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
              <div className="mt-2 flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleLikeRating(rating.id)}>
                  <Star className="h-4 w-4 mr-1" />
                  {rating.likes} likes
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteRating(rating.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}

          {(!partner.ratings || partner.ratings.length === 0) && (
            <p className="text-center py-4 text-gray-500">
              Nenhuma avaliação disponível.
            </p>
          )}
        </div>
        
        <div className="mt-6 p-4 border rounded-md">
          <h3 className="font-medium mb-2">Adicionar avaliação</h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingValue(star)}
                className="focus:outline-none"
              >
                <Star 
                  className={`h-6 w-6 cursor-pointer ${star <= ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              </button>
            ))}
          </div>
          <textarea 
            className="w-full border rounded-md p-2 min-h-[100px]" 
            placeholder="Digite sua avaliação..."
            value={ratingText}
            onChange={(e) => setRatingText(e.target.value)}
          />
          <Button className="mt-2" onClick={handleAddRating}>
            <Star className="mr-2 h-4 w-4" />
            Enviar Avaliação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingsTab;
