
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Rating {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  likes: number;
  userLiked: boolean;
}

interface RatingSystemProps {
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
  onSubmitRating: (rating: number, comment?: string) => void;
  onLikeRating: (ratingId: string) => void;
  currentUserId?: string;
  userRating?: Rating;
  allowMultipleRatings?: boolean;
  className?: string;
}

const RatingSystem = ({
  ratings,
  averageRating,
  totalRatings,
  onSubmitRating,
  onLikeRating,
  currentUserId,
  userRating,
  allowMultipleRatings = false,
  className = ''
}: RatingSystemProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(!userRating || allowMultipleRatings);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onSubmitRating(selectedRating, comment.trim() || undefined);
      setSelectedRating(0);
      setComment('');
      setShowForm(false);
    }
  };

  const StarRating = ({ 
    rating, 
    interactive = false, 
    size = "h-5 w-5",
    onRatingChange
  }: { 
    rating: number; 
    interactive?: boolean; 
    size?: string;
    onRatingChange?: (rating: number) => void;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`${size} ${
                star <= (interactive ? (hoveredRating || selectedRating) : rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
    ratings.forEach(rating => {
      distribution[rating.rating - 1]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size="h-6 w-6" />
              <div className="text-sm text-gray-500 mt-1">
                {totalRatings} avaliação{totalRatings !== 1 ? 'ões' : ''}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${totalRatings > 0 ? (distribution[stars - 1] / totalRatings) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">{distribution[stars - 1]}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Rating */}
      {userRating && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Sua avaliação</Badge>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={userRating.rating} />
                  <span className="text-sm text-gray-500">
                    {format(new Date(userRating.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                {userRating.comment && (
                  <p className="text-sm text-gray-700">{userRating.comment}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {userRating ? 'Nova Avaliação' : 'Avaliar'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Sua nota
              </label>
              <StarRating
                rating={selectedRating}
                interactive={true}
                size="h-8 w-8"
                onRatingChange={setSelectedRating}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Comentário (opcional)
              </label>
              <Textarea
                placeholder="Compartilhe sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={selectedRating === 0}>
                Enviar Avaliação
              </Button>
              {(userRating || allowMultipleRatings) && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!showForm && (userRating || allowMultipleRatings) && (
        <Button 
          variant="outline" 
          onClick={() => setShowForm(true)}
          className="w-full"
        >
          {userRating ? 'Avaliar Novamente' : 'Adicionar Avaliação'}
        </Button>
      )}

      {/* Ratings List */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma avaliação ainda</p>
            <p className="text-sm">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          ratings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rating.userAvatar} />
                    <AvatarFallback>
                      {rating.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rating.userName}</span>
                        <StarRating rating={rating.rating} size="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(rating.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    
                    {rating.comment && (
                      <p className="text-gray-700 mb-3">{rating.comment}</p>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLikeRating(rating.id)}
                      className={`flex items-center gap-1 ${
                        rating.userLiked ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${rating.userLiked ? 'fill-current' : ''}`} />
                      <span>{rating.likes}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingSystem;
