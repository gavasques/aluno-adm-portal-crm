
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Trash2, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
  onClearSelection: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkAction,
  onClearSelection
}) => {
  if (selectedCount === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCount} selecionada{selectedCount > 1 ? 's' : ''}
            </Badge>
            <span className="text-sm text-gray-600">
              Ações em lote disponíveis
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onBulkAction('activate')}
              className="hover:bg-green-50"
            >
              <Play className="h-4 w-4 mr-2" />
              Ativar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onBulkAction('pause')}
              className="hover:bg-yellow-50"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onBulkAction('delete')}
              className="hover:bg-red-50 text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
