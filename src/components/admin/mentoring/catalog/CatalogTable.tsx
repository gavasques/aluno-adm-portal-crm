
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
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
  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Ativa
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        Inativa
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const isIndividual = type === 'Individual';
    return (
      <Badge className={isIndividual ? 
        "bg-purple-100 text-purple-800 border-purple-200" : 
        "bg-yellow-100 text-yellow-800 border-yellow-200"
      }>
        {type}
      </Badge>
    );
  };

  console.log('📋 CatalogTable renderizando com:', catalogs.length, 'mentorias');

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Nome</TableHead>
              <TableHead className="font-semibold text-gray-900">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-900">Instrutor</TableHead>
              <TableHead className="font-semibold text-gray-900">Duração</TableHead>
              <TableHead className="font-semibold text-gray-900">Sessões</TableHead>
              <TableHead className="font-semibold text-gray-900">Preço</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalogs.map((catalog) => (
              <TableRow key={catalog.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{catalog.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {catalog.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {getTypeBadge(catalog.type)}
                </TableCell>
                <TableCell className="text-gray-900">
                  {catalog.instructor}
                </TableCell>
                <TableCell className="text-gray-600">
                  {catalog.durationMonths} {catalog.durationMonths === 1 ? 'mês' : 'meses'}
                </TableCell>
                <TableCell className="text-gray-600">
                  {catalog.numberOfSessions}
                </TableCell>
                <TableCell>
                  <span className="font-medium text-green-600">
                    R$ {catalog.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(catalog.active)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-blue-50 text-blue-600"
                      onClick={() => onView(catalog)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-gray-50"
                      onClick={() => onEdit(catalog)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-yellow-50 text-yellow-600"
                      onClick={() => onToggleStatus(catalog.id, catalog.active)}
                      title={catalog.active ? 'Desativar' : 'Ativar'}
                    >
                      {catalog.active ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                      onClick={() => onDelete(catalog.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CatalogTable;
