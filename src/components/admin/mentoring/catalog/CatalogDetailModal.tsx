
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Calendar, 
  Star, 
  DollarSign, 
  Clock, 
  Plus,
  Edit
} from 'lucide-react';
import { MentoringExtensionOption } from '@/types/mentoring.types';

interface MentoringCatalog {
  id: string;
  title: string;
  mentor: string;
  students: number;
  duration: string;
  date: string;
  status: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada";
  category: string;
  type: "Individual" | "Grupo";
  price: number;
  description: string;
  extensions?: MentoringExtensionOption[];
}

interface CatalogDetailModalProps {
  catalog: MentoringCatalog | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (catalog: MentoringCatalog) => void;
}

const CatalogDetailModal: React.FC<CatalogDetailModalProps> = ({
  catalog,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!catalog) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Grupo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Em Andamento": return "bg-green-100 text-green-700 border-green-200";
      case "Concluída": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelada": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">{catalog.title}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(catalog)}
              className="ml-2"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Mentoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Mentor:</span>
                    <span className="font-medium">{catalog.mentor}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Duração:</span>
                    <span className="font-medium">{catalog.duration}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Alunos:</span>
                    <span className="font-medium">{catalog.students}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <Badge className={getTypeColor(catalog.type)}>
                      {catalog.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={getStatusColor(catalog.status)}>
                      {catalog.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Preço:</span>
                    <span className="font-bold text-green-600">R$ {catalog.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Descrição */}
          <div>
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-gray-700 leading-relaxed">{catalog.description}</p>
          </div>

          <Separator />

          {/* Extensões Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Extensões Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {catalog.extensions && catalog.extensions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {catalog.extensions.map((extension) => (
                    <div
                      key={extension.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {extension.months} {extension.months === 1 ? 'Mês' : 'Meses'}
                          </span>
                        </div>
                        <span className="font-bold text-green-600">
                          R$ {extension.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{extension.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhuma extensão configurada</p>
                  <p className="text-xs">Configure extensões para oferecer aos alunos</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Ações */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={() => onEdit(catalog)}>
              <Edit className="h-4 w-4 mr-1" />
              Editar Mentoria
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogDetailModal;
