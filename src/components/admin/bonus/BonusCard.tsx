
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
      Software: "bg-blue-100 text-blue-800 border-blue-200",
      Sistema: "bg-green-100 text-green-800 border-green-200", 
      IA: "bg-purple-100 text-purple-800 border-purple-200",
      Ebook: "bg-orange-100 text-orange-800 border-orange-200",
      Lista: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Outros: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[type as keyof typeof colors] || colors.Outros;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="h-full hover:shadow-md transition-all duration-200 group border border-gray-100 bg-white">
      <CardHeader className="pb-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
              {bonus.bonus_id}
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs font-medium ${getTypeColor(bonus.type)}`}
            >
              {bonus.type}
            </Badge>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
          {bonus.name}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
          {bonus.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{bonus.access_period}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(bonus.created_at)}</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(bonus.id)}
            className="flex-1 text-xs h-8"
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver Detalhes
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(bonus.id);
            }}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusCard;
