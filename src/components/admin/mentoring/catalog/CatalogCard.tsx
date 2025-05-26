
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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
  Star,
  ChevronDown,
  Clock,
  Link as LinkIcon
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
  const [showExtensions, setShowExtensions] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Grupo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleExtensionClick = (extension: any, platform: string, link: string) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      console.log(`Link para ${platform} não configurado para esta extensão`);
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
              {catalog.extensions && catalog.extensions.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {catalog.extensions.length} extensão(ões)
                </Badge>
              )}
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

          {/* Extensões Disponíveis */}
          {catalog.extensions && catalog.extensions.length > 0 && (
            <div className="border-t pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Extensões Disponíveis ({catalog.extensions.length})
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="start">
                  {catalog.extensions.map((extension, index) => (
                    <div key={extension.id}>
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            +{extension.months} {extension.months === 1 ? 'mês' : 'meses'}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            R$ {extension.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          Total: {catalog.durationMonths + extension.months} {(catalog.durationMonths + extension.months) === 1 ? 'mês' : 'meses'}
                        </div>
                        {extension.description && (
                          <div className="text-xs text-gray-600 mb-2">
                            {extension.description}
                          </div>
                        )}
                        
                        {/* Links de checkout para a extensão */}
                        {extension.checkoutLinks && (
                          <div className="flex gap-1">
                            {extension.checkoutLinks.mercadoPago && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleExtensionClick(extension, 'Mercado Pago', extension.checkoutLinks!.mercadoPago!)}
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                MP
                              </Button>
                            )}
                            {extension.checkoutLinks.hubla && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleExtensionClick(extension, 'Hubla', extension.checkoutLinks!.hubla!)}
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                Hubla
                              </Button>
                            )}
                            {extension.checkoutLinks.hotmart && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleExtensionClick(extension, 'Hotmart', extension.checkoutLinks!.hotmart!)}
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                Hotmart
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      {index < catalog.extensions!.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
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
