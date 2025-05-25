
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Clock, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  Users, 
  Edit 
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
      case 'Individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Grupo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEdit = () => {
    onEdit(catalog);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Mentoria</span>
            <Badge className={getTypeColor(catalog.type)}>
              {catalog.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {catalog.name}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {catalog.description}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Instrutor</p>
                      <p className="text-sm text-gray-600">{catalog.instructor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Preço</p>
                      <p className="text-sm text-green-600 font-semibold">
                        R$ {catalog.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Duração</p>
                      <p className="text-sm text-gray-600">{catalog.durationWeeks} semanas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Sessões</p>
                      <p className="text-sm text-gray-600">{catalog.numberOfSessions} sessões</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status e Datas */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-medium mb-4">Status e Informações</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={catalog.active ? "default" : "secondary"}>
                    {catalog.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium">Tipo de Mentoria</p>
                  <div className="flex items-center gap-2 mt-1">
                    {catalog.type === 'Grupo' ? (
                      <Users className="h-4 w-4 text-gray-500" />
                    ) : (
                      <User className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-600">{catalog.type}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Criado em</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(catalog.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Atualizado em</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(catalog.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          <Button 
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar Mentoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogDetailDialog;
