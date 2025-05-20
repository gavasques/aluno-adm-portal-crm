
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Download, Trash, FileText, FilePlus, FileArchive } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface File {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
}

interface FilesTabProps {
  files: File[];
  onUpdate: (files: File[]) => void;
  isEditing?: boolean;
}

// Função para converter tamanho string para bytes
const stringToBytes = (sizeStr: string): number => {
  const size = parseFloat(sizeStr);
  if (sizeStr.includes("KB")) return size * 1024;
  if (sizeStr.includes("MB")) return size * 1024 * 1024;
  if (sizeStr.includes("GB")) return size * 1024 * 1024 * 1024;
  return size;
};

// Função para formatar bytes para string legível
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Total de armazenamento disponível em bytes (100MB)
const STORAGE_LIMIT = 100 * 1024 * 1024;

const FilesTab: React.FC<FilesTabProps> = ({ 
  files = [], 
  onUpdate,
  isEditing = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Calcular armazenamento usado
  const usedStorage = files.reduce((total, file) => total + stringToBytes(file.size), 0);
  const usedPercentage = (usedStorage / STORAGE_LIMIT) * 100;
  
  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSize = file.size;
      
      // Verificar se tem espaço suficiente
      if (usedStorage + fileSize > STORAGE_LIMIT) {
        toast.error("Limite de armazenamento excedido! Remova alguns arquivos antes de adicionar novos.");
        return;
      }

      // Simular upload
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Adicionar novo arquivo
          const newFile = {
            id: Date.now(),
            name: file.name,
            type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
            size: formatBytes(file.size),
            date: new Date().toISOString().split('T')[0]
          };
          
          onUpdate([...files, newFile]);
          toast.success("Arquivo enviado com sucesso!");
          setIsUploading(false);
          setUploadProgress(0);
          
          // Limpar o input
          e.target.value = '';
        }
      }, 100);
    }
  };

  const handleDeleteFile = (id: number) => {
    onUpdate(files.filter(file => file.id !== id));
    toast.success("Arquivo excluído com sucesso!");
  };
  
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Arquivos</CardTitle>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-1">
            {formatBytes(usedStorage)} de {formatBytes(STORAGE_LIMIT)} usados
          </div>
          <div className="w-40">
            <Progress value={usedPercentage} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="mb-6">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleAddFile}
                disabled={isUploading || usedStorage >= STORAGE_LIMIT}
              />
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  usedStorage >= STORAGE_LIMIT ? 'opacity-50' : ''
                }`}
              >
                <FilePlus className="h-10 w-10 text-portal-primary mb-2" />
                <span className="text-portal-primary font-medium">
                  {usedStorage >= STORAGE_LIMIT ? 
                    "Limite de armazenamento atingido" : 
                    "Clique para enviar um arquivo"}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  ou arraste e solte aqui
                </span>
              </label>
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Enviando...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}
        
        {files.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-portal-primary">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {file.type} • {file.size} • {file.date}
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
                    
                    {isEditing && (
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
                              Tem certeza que deseja excluir "{file.name}"? Esta ação não pode ser desfeita.
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhum arquivo cadastrado.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesTab;
