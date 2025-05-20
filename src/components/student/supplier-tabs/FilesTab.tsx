
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash, Download, FileText, Image, File } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  url?: string; // URL for download (would be actual file URL in a real app)
}

interface FilesTabProps {
  files: FileItem[];
  onUpdate: (files: FileItem[]) => void;
}

const FilesTab: React.FC<FilesTabProps> = ({ files, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setIsLoading(true);
    
    // Process each file
    Array.from(selectedFiles).forEach(file => {
      // Get file size in KB or MB
      let fileSize;
      if (file.size < 1024 * 1024) {
        fileSize = (file.size / 1024).toFixed(1) + "KB";
      } else {
        fileSize = (file.size / (1024 * 1024)).toFixed(1) + "MB";
      }
      
      // Determine file type category
      let fileType;
      if (file.type.startsWith('image/')) {
        fileType = 'Imagem';
      } else if (file.type === 'application/pdf') {
        fileType = 'PDF';
      } else if (file.type.includes('word')) {
        fileType = 'Documento';
      } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
        fileType = 'Planilha';
      } else {
        fileType = 'Outro';
      }
      
      // Create a new file record
      const newFile: FileItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: file.name,
        type: fileType,
        size: fileSize,
        date: new Date().toISOString().split('T')[0],
        // In a real app, this would be a URL to the uploaded file
        url: URL.createObjectURL(file)
      };
      
      // Add to files list
      onUpdate([...files, newFile]);
    });
    
    // Reset the file input
    e.target.value = '';
    setIsLoading(false);
    toast.success("Arquivo(s) adicionado(s) com sucesso!");
  };

  const handleDeleteFile = (id: number) => {
    onUpdate(files.filter(file => file.id !== id));
    toast.success("Arquivo excluído com sucesso!");
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'imagem':
        return <Image className="h-5 w-5 text-blue-500" />;
      case 'documento':
        return <FileText className="h-5 w-5 text-blue-400" />;
      case 'planilha':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownload = (file: FileItem) => {
    // In a real app, this would actually download the file from the server
    toast.info(`Download do arquivo ${file.name} iniciado.`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Arquivos</CardTitle>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <Button onClick={handleUploadClick} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" /> 
            {isLoading ? "Carregando..." : "Adicionar Arquivo"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum arquivo cadastrado. Clique no botão acima para adicionar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <span className="ml-2">{file.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.date}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4 text-blue-500" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir arquivo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o arquivo {file.name}? Esta ação não pode ser desfeita.
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
        )}
      </CardContent>
    </Card>
  );
};

export default FilesTab;
