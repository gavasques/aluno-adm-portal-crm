
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Calendar, 
  DollarSign, 
  Clock, 
  Plus,
  Edit,
  BookOpen,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface CatalogDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: MentoringCatalog | null;
  onEdit: (catalog: MentoringCatalog) => void;
}

const CatalogDetailDialog: React.FC<CatalogDetailDialogProps> = ({
  open,
  onOpenChange,
  catalog,
  onEdit
}) => {
  if (!catalog) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'Grupo': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa": return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      case "Inativa": return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300";
      case "Cancelada": return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300";
      default: return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300";
    }
  };

  // Função para renderizar descrição HTML formatada
  const renderFormattedDescription = (htmlDescription: string) => {
    if (!htmlDescription) return '';
    
    const cleanHtml = htmlDescription
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    return (
      <div 
        className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">{catalog.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs px-2 py-1 border ${getTypeColor(catalog.type)}`}>
                    {catalog.type === 'Individual' ? (
                      <><User className="h-3 w-3 mr-1" />{catalog.type}</>
                    ) : (
                      <><Users className="h-3 w-3 mr-1" />{catalog.type}</>
                    )}
                  </Badge>
                  <Badge className={`text-xs px-2 py-1 border ${getStatusColor(catalog.status)}`}>
                    {catalog.status}
                  </Badge>
                  {catalog.extensions && catalog.extensions.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200">
                      <Plus className="h-3 w-3 mr-1" />
                      {catalog.extensions.length} extensão(ões)
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(catalog)}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Principais */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Informações da Mentoria
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-xs text-gray-500 block">Mentor</span>
                    <span className="font-medium text-sm text-gray-900 truncate">{catalog.instructor}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <div>
                    <span className="text-xs text-gray-500 block">Duração</span>
                    <span className="font-medium text-sm text-gray-900">{catalog.durationMonths} {catalog.durationMonths === 1 ? 'mês' : 'meses'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <div>
                    <span className="text-xs text-gray-500 block">Sessões</span>
                    <span className="font-medium text-sm text-gray-900">{catalog.numberOfSessions} sessões</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="text-xs text-gray-500 block">Preço</span>
                    <span className="font-bold text-sm text-green-600">R$ {catalog.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-4" />

          {/* Descrição */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Descrição
            </h3>
            <div className="max-h-32 overflow-y-auto">
              {renderFormattedDescription(catalog.description)}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Extensões Disponíveis */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                Extensões Disponíveis
              </h3>
              {catalog.extensions && catalog.extensions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {catalog.extensions.map((extension, index) => (
                    <div
                      key={extension.id || index}
                      className="border border-blue-200 rounded-lg p-3 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm text-gray-900">
                            {extension.months} {extension.months === 1 ? 'Mês' : 'Meses'}
                          </span>
                        </div>
                        <span className="font-bold text-sm text-green-600">
                          R$ {extension.price.toLocaleString()}
                        </span>
                      </div>
                      {extension.description && (
                        <p className="text-xs text-gray-600 leading-relaxed">{extension.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">Nenhuma extensão configurada</p>
                  <p className="text-xs">Configure extensões para oferecer aos alunos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200">
          <div className="flex gap-2 w-full justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => onEdit(catalog)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar Mentoria
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogDetailDialog;
