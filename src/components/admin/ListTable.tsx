
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface ListItem {
  id: string | number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface ListTableProps {
  items: ListItem[];
  onDelete?: (id: string | number) => void;
  onEdit?: (item: ListItem) => void;
  showDescription?: boolean;
  showDates?: boolean;
}

const ListTable: React.FC<ListTableProps> = ({
  items,
  onDelete,
  onEdit,
  showDescription = false,
  showDates = false
}) => {
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const handleDelete = (id: string | number) => {
    setDeletingId(id);
    onDelete?.(id);
    setDeletingId(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum item encontrado.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            {showDescription && <TableHead>Descrição</TableHead>}
            {showDates && <TableHead>Criado em</TableHead>}
            {showDates && <TableHead>Atualizado em</TableHead>}
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              {showDescription && (
                <TableCell className="max-w-xs truncate">
                  {item.description || '-'}
                </TableCell>
              )}
              {showDates && <TableCell>{formatDate(item.created_at)}</TableCell>}
              {showDates && <TableCell>{formatDate(item.updated_at)}</TableCell>}
              <TableCell>
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={deletingId === item.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{item.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListTable;
