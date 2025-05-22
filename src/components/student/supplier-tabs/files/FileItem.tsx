
import React from "react";
import { Download, Trash, FileText, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CustomFile } from "./utils";

export interface FileItemProps extends CustomFile {
  onDelete?: (id: number) => void;
  isEditing?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  id,
  name,
  type,
  size,
  date,
  onDelete,
  isEditing = true
}) => {
  // Função para selecionar ícone baseado no tipo de arquivo
  const getFileIcon = (type: string) => {
    const typeLC = type.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt'].includes(typeLC)) {
      return <FileText className="h-6 w-6" />;
    } else if (['zip', 'rar', '7z'].includes(typeLC)) {
      return <FileArchive className="h-6 w-6" />;
    } else {
      return <FileText className="h-6 w-6" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
      <div className="flex items-center">
        <div className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-portal-primary">
          {getFileIcon(type)}
        </div>
        <div className="ml-3">
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">
            {type} • {size} • {date}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600"
          onClick={() => toast.info("Download iniciado.")}
        >
          <Download className="h-4 w-4" />
        </Button>
        
        {isEditing && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir arquivo</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{name}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default FileItem;
