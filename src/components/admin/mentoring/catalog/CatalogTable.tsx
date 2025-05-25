
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown
} from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface CatalogTableProps {
  catalogs: MentoringCatalog[];
  onView: (catalog: MentoringCatalog) => void;
  onEdit: (catalog: MentoringCatalog) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const CatalogTable: React.FC<CatalogTableProps> = ({
  catalogs,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Grupo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRowClick = (catalog: MentoringCatalog, event: React.MouseEvent) => {
    // Prevenir o clique se for em um botão
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    onView(catalog);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mentorias Cadastradas ({catalogs.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">
                  <Button variant="ghost" size="sm" className="h-auto p-0 font-medium">
                    Nome <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium">Tipo</TableHead>
                <TableHead className="font-medium text-center">Duração</TableHead>
                <TableHead className="font-medium text-center">Sessões</TableHead>
                <TableHead className="font-medium text-center">Status</TableHead>
                <TableHead className="font-medium text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalogs.map((catalog) => (
                <TableRow 
                  key={catalog.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => handleRowClick(catalog, e)}
                >
                  <TableCell className="font-medium max-w-80">
                    <div>
                      <p className="font-medium truncate">{catalog.name}</p>
                      <p className="text-sm text-gray-500 truncate">{catalog.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(catalog.type)}>
                      {catalog.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {catalog.durationWeeks} sem
                  </TableCell>
                  <TableCell className="text-center">
                    {catalog.numberOfSessions}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus(catalog.id, catalog.active);
                        }}
                        className="p-1"
                        title={catalog.active ? 'Desativar mentoria' : 'Ativar mentoria'}
                      >
                        {catalog.active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(catalog);
                        }}
                        title="Visualizar detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(catalog);
                        }}
                        title="Editar mentoria"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(catalog.id);
                        }}
                        title="Excluir mentoria"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogTable;
