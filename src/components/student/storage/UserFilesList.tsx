
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Trash2, FileText, Search } from "lucide-react";
import { useUserStorage } from "@/hooks/useUserStorage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserFile {
  id: string;
  file_name: string;
  file_size_mb: number;
  file_type: string;
  upload_date: string;
  supplier_id?: string;
}

interface UserFilesListProps {
  files: UserFile[];
}

const UserFilesList: React.FC<UserFilesListProps> = ({ files }) => {
  const { deleteFile } = useUserStorage();
  const [searchQuery, setSearchQuery] = useState("");

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const filteredFiles = files.filter(file =>
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.file_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId);
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Nenhum arquivo encontrado.</p>
        <p className="text-sm text-gray-400 mt-1">
          Comece fazendo upload de arquivos em seus fornecedores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar arquivos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabela de arquivos */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Arquivo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Data de Upload</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="truncate max-w-xs" title={file.file_name}>
                      {file.file_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                    {file.file_type || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {formatFileSize(file.file_size_mb)}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDate(file.upload_date)}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir arquivo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o arquivo "{file.file_name}"? 
                          Esta ação não pode ser desfeita e liberará {formatFileSize(file.file_size_mb)} de espaço.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFile(file.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredFiles.length === 0 && searchQuery && (
        <div className="text-center py-4">
          <p className="text-gray-500">
            Nenhum arquivo encontrado para "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
};

export default UserFilesList;
