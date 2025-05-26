
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  BookOpen, 
  Eye, 
  Edit, 
  Trash2,
  ToggleLeft,
  ToggleRight,
  Star
} from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface CatalogCardProps {
  catalog: MentoringCatalog;
  onEdit: (catalog: MentoringCatalog) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const CatalogCard: React.FC<CatalogCardProps> = ({
  catalog,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Grupo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 line-clamp-2">{catalog.name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(catalog.type)}>
                {catalog.type}
              </Badge>
              <Badge variant={catalog.active ? 'default' : 'secondary'} className="text-xs">
                {catalog.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(catalog.id, catalog.active)}
            className="flex-shrink-0"
          >
            {catalog.active ? (
              <ToggleRight className="h-5 w-5 text-green-600" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Imagem placeholder */}
          <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-blue-400" />
          </div>
          
          {/* Descrição */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {catalog.description}
          </p>
          
          {/* Informações em grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="truncate">{catalog.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-green-600">R$ {catalog.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{catalog.durationMonths} {catalog.durationMonths === 1 ? 'mês' : 'meses'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-gray-400" />
              <span>{catalog.numberOfSessions} sessões</span>
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex gap-1 pt-2 border-t border-gray-100">
            <Button variant="ghost" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(catalog)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(catalog.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogCard;
