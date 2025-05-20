
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, ThumbsUp, Trash } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RatingItem {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  userLiked: boolean;
}

interface RatingsTabProps {
  ratings: RatingItem[];
  onUpdate: (ratings: RatingItem[]) => void;
}

const RatingsTab: React.FC<RatingsTabProps> = ({ ratings, onUpdate }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usuário atual (simulado)
  const currentUser = {
    id: 1,
    name: "Usuário Atual",
    avatar: ""
  };

  const handleAddRating = () => {
    if (newRating === 0) {
      toast.error("Por favor, selecione uma classificação.");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Por favor, adicione um comentário para sua avaliação.");
      return;
    }

    setIsSubmitting(true);
    
    // Simular atraso de rede
    setTimeout(() => {
      const newRatingObj: RatingItem = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        rating: newRating,
        comment: newComment,
        date: new Date().toISOString(),
        likes: 0,
        userLiked: false
      };
      
      onUpdate([newRatingObj, ...ratings]);
      setNewRating(0);
      setNewComment("");
      setIsSubmitting(false);
      setIsAddDialogOpen(false);
      toast.success("Avaliação adicionada com sucesso!");
    }, 500);
  };

  const handleLikeRating = (ratingId: number) => {
    const updatedRatings = ratings.map(rating => {
      if (rating.id === ratingId) {
        // Se o usuário já curtiu, remover o like
        // Se não curtiu, adicionar o like (limitado a 1)
        return {
          ...rating,
          likes: rating.userLiked ? rating.likes - 1 : rating.likes + 1,
          userLiked: !rating.userLiked
        };
      }
      return rating;
    });
    
    onUpdate(updatedRatings);
    toast.success("Ação registrada com sucesso!");
  };

  const handleDeleteRating = (ratingId: number) => {
    const updatedRatings = ratings.filter(rating => rating.id !== ratingId);
    onUpdate(updatedRatings);
    toast.success("Avaliação excluída com sucesso!");
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (e) {
      return "data desconhecida";
    }
  };

  // Função para exibir estrelas de avaliação
  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            onClick={interactive ? () => setNewRating(star) : undefined}
            style={interactive ? { cursor: 'pointer' } : {}}
          />
        ))}
      </div>
    );
  };

  // Ordenar avaliações
  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === 'highest') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  // Calcular média das avaliações
  const averageRating = ratings.length 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Avaliações</CardTitle>
          {ratings.length > 0 && (
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>{averageRating}</span>
              <span className="text-xs">({ratings.length})</span>
            </div>
          )}
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>Adicionar avaliação</Button>
      </CardHeader>
      <CardContent>
        {/* Opções de ordenação */}
        {ratings.length > 0 && (
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <select 
                className="text-sm border rounded px-2 py-1"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'highest' | 'lowest')}
              >
                <option value="newest">Mais recentes</option>
                <option value="highest">Maiores avaliações</option>
                <option value="lowest">Menores avaliações</option>
              </select>
            </div>
          </div>
        )}

        {/* Lista de avaliações */}
        {ratings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-6">
              {sortedRatings.map((rating) => (
                <div key={rating.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{rating.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      {rating.userAvatar && <AvatarImage src={rating.userAvatar} alt={rating.userName} />}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{rating.userName}</h4>
                          <div className="flex items-center gap-2">
                            {renderStars(rating.rating)}
                            <span className="text-xs text-gray-500">{formatDate(rating.date)}</span>
                          </div>
                        </div>
                        {rating.userId === currentUser.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir avaliação</AlertDialogTitle>
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
                        )}
                      </div>
                      
                      <p className="mt-2">{rating.comment}</p>
                      
                      <div className="flex gap-4 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex gap-1 h-7 ${rating.userLiked ? 'text-blue-500' : 'text-gray-500'}`}
                          onClick={() => handleLikeRating(rating.id)}
                          disabled={rating.userId === currentUser.id} // Não permitir like em sua própria avaliação
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {rating.likes > 0 && (
                            <span>{rating.likes}</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Dialog para adicionar avaliação */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Avaliação</DialogTitle>
              <DialogDescription>
                Compartilhe sua experiência com este fornecedor.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Sua classificação*</label>
                <div className="flex items-center gap-1">
                  {renderStars(newRating, true)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Seu comentário*</label>
                <Textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Compartilhe sua experiência com este fornecedor..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewRating(0);
                  setNewComment("");
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddRating}
                disabled={isSubmitting || newRating === 0 || !newComment.trim()}
              >
                {isSubmitting ? "Enviando..." : "Publicar Avaliação"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RatingsTab;
