
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Calendar, Clock } from "lucide-react";
import { Bonus } from "@/types/bonus.types";

interface BonusCardProps {
  bonus: Bonus;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const BonusCard: React.FC<BonusCardProps> = ({ bonus, onView, onDelete }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      Software: "bg-blue-100 text-blue-800",
      Sistema: "bg-green-100 text-green-800", 
      IA: "bg-purple-100 text-purple-800",
      Ebook: "bg-orange-100 text-orange-800",
      Lista: "bg-yellow-100 text-yellow-800",
      Outros: "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || colors.Outros;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500">{bonus.bonus_id}</span>
              <Badge className={getTypeColor(bonus.type)}>
                {bonus.type}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {bonus.name}
            </h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {bonus.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {bonus.access_period}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(bonus.created_at)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(bonus.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(bonus.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusCard;
