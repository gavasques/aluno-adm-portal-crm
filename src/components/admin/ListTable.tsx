
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Search, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface ListTableProps {
  items: ListItem[];
  onDelete: (id: string | number) => void;
  onEdit?: (item: ListItem) => void;
  showDescription?: boolean;
  showStatus?: boolean;
  showDates?: boolean;
}

const ListTable: React.FC<ListTableProps> = ({
  items,
  onDelete,
  onEdit,
  showDescription = true,
  showStatus = false,
  showDates = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ListItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof ListItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedItems = items
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      
      if (sortDirection === "asc") {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

  const SortIcon = ({ field }: { field: keyof ListItem }) => {
    if (sortField !== field) return <SortAsc className="h-4 w-4 text-gray-400" />;
    return sortDirection === "asc" ? 
      <SortAsc className="h-4 w-4 text-blue-600" /> : 
      <SortDesc className="h-4 w-4 text-blue-600" />;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Nenhum item encontrado</div>
        <div className="text-gray-400 text-sm">Adicione o primeiro item para começar</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar itens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {filteredAndSortedItems.length} de {items.length} itens
        </Badge>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 hover:bg-transparent p-0 font-semibold text-gray-900"
                >
                  Nome
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              {showDescription && (
                <TableHead className="font-semibold text-gray-900">Descrição</TableHead>
              )}
              {showStatus && (
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
              )}
              {showDates && (
                <TableHead className="font-semibold text-gray-900">Criado em</TableHead>
              )}
              <TableHead className="text-right font-semibold text-gray-900">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedItems.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                </TableCell>
                {showDescription && (
                  <TableCell>
                    <span className="text-gray-600 text-sm">
                      {item.description || "Sem descrição"}
                    </span>
                  </TableCell>
                )}
                {showStatus && (
                  <TableCell>
                    <Badge 
                      variant={item.status === "Ativo" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.status || "Ativo"}
                    </Badge>
                  </TableCell>
                )}
                {showDates && (
                  <TableCell>
                    <span className="text-gray-500 text-sm">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : "-"}
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="hover:bg-blue-50 text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{item.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListTable;
