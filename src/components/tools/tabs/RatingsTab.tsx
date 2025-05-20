
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Tool } from "../ToolsTable";

interface RatingsTabProps {
  tool: Tool;
  onUpdateTool: (updatedTool: Tool) => void;
}

const RatingsTab: React.FC<RatingsTabProps> = ({ tool, onUpdateTool }) => {
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  
  const ratingForm = useForm({
    resolver: zodResolver(
      z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().min(3, "Comentário deve ter pelo menos 3 caracteres"),
      })
    ),
    defaultValues: {
      rating: 5,
      comment: "",
    }
  });
  
  const handleAddRating = (data) => {
    const newRating = {
      id: Date.now(),
      user: "Usuário Atual",
      rating: data.rating,
      comment: data.comment,
      date: new Date().toLocaleDateString(),
      likes: 0,
    };
    
    const updatedTool = {
      ...tool,
      ratings_list: [...tool.ratings_list, newRating]
    };
    
    onUpdateTool(updatedTool);
    toast.success("Avaliação adicionada com sucesso!");
    ratingForm.reset();
    setIsRatingDialogOpen(false);
  };
  
  const handleLike = (ratingId) => {
    const updatedRatings = tool.ratings_list.map(rating => {
      if (rating.id === ratingId) {
        return { ...rating, likes: rating.likes + 1 };
      }
      return rating;
    });
    
    const updatedTool = {
      ...tool,
      ratings_list: updatedRatings
    };
    
    onUpdateTool(updatedTool);
    toast.success("Like adicionado!");
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Avaliações</CardTitle>
          <CardDescription>
            Avaliação média: {tool.rating}/5
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tool.ratings_list && tool.ratings_list.length > 0 ? (
            <div className="space-y-4 mb-6">
              {tool.ratings_list.map((ratingItem) => (
                <div key={ratingItem.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {ratingItem.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{ratingItem.user}</p>
                        <p className="text-sm text-gray-500">{ratingItem.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= ratingItem.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2">{ratingItem.comment}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(ratingItem.id);
                    }}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" /> {ratingItem.likes}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 mb-6">
              Nenhuma avaliação disponível.
            </div>
          )}
          
          <div className="mt-4">
            <Button className="w-full" onClick={() => setIsRatingDialogOpen(true)}>
              <Star className="h-4 w-4 mr-2" /> Adicionar Avaliação
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Ferramenta</DialogTitle>
            <DialogDescription>
              Compartilhe sua experiência com esta ferramenta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={ratingForm.handleSubmit(handleAddRating)}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação*</Label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`h-8 w-8 cursor-pointer ${
                        value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => {
                        setRating(value);
                        ratingForm.setValue("rating", value);
                      }}
                    />
                  ))}
                </div>
                {ratingForm.formState.errors.rating && (
                  <p className="text-sm text-red-500">{ratingForm.formState.errors.rating.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comentário*</Label>
                <Textarea
                  id="comment"
                  placeholder="Compartilhe sua experiência com esta ferramenta"
                  {...ratingForm.register("comment")}
                  className="min-h-[100px]"
                />
                {ratingForm.formState.errors.comment && (
                  <p className="text-sm text-red-500">{ratingForm.formState.errors.comment.message}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Avaliação</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RatingsTab;
