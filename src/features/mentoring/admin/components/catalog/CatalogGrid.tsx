
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, BookOpen, DollarSign, Eye, Edit, Plus } from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface CatalogGridProps {
  catalogs: MentoringCatalog[];
  onViewCatalog: (catalog: MentoringCatalog) => void;
  onEditCatalog: (catalog: MentoringCatalog) => void;
  onCreateCatalog: () => void;
  getMentorName: (instructor: string) => string;
  renderFormattedDescription: (htmlDescription: string) => React.ReactNode;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  catalogs,
  onViewCatalog,
  onEditCatalog,
  onCreateCatalog,
  getMentorName,
  renderFormattedDescription
}) => {
  if (catalogs.length === 0) {
    return (
      <div className="text-center py-8 lg:py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma mentoria cadastrada
        </h3>
        <p className="text-gray-500 mb-4">
          Comece criando sua primeira mentoria.
        </p>
        <Button onClick={onCreateCatalog}>
          <Plus className="h-4 w-4 mr-2" />
          Criar primeira mentoria
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {catalogs.map((catalog) => (
        <Card key={catalog.id} className="hover:shadow-md transition-all duration-200 border border-gray-200">
          <CardContent className="p-3 lg:p-4">
            <div className="space-y-3">
              {/* Header do card */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm lg:text-base text-gray-900 line-clamp-2 mb-1">
                    {catalog.name}
                  </h3>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge 
                      variant={catalog.type === 'Individual' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {catalog.type}
                    </Badge>
                    <Badge 
                      variant={catalog.active ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {catalog.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                    {catalog.extensions && catalog.extensions.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                        {catalog.extensions.length} ext.
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="text-xs text-gray-600 line-clamp-2">
                {renderFormattedDescription(catalog.description)}
              </div>

              {/* Informações principais */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-gray-400" />
                  <span className="truncate">{getMentorName(catalog.instructor)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span>{catalog.durationMonths} {catalog.durationMonths === 1 ? 'mês' : 'meses'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3 text-gray-400" />
                  <span>{catalog.numberOfSessions} sessões</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span className="font-medium text-green-600">R$ {catalog.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-1 pt-2 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 h-7 text-xs"
                  onClick={() => onViewCatalog(catalog)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 h-7 text-xs"
                  onClick={() => onEditCatalog(catalog)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
