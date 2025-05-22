
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import FileUploader from "./files/FileUploader";
import FilesList from "./files/FilesList";
import StorageIndicator from "./files/StorageIndicator";
import { stringToBytes, formatBytes, STORAGE_LIMIT } from "./files/utils";

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

const FilesTab: React.FC<FilesTabProps> = ({ 
  files = [], 
  onUpdate,
  isEditing = true
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Calcular armazenamento usado
  const usedStorage = files.reduce((total, file) => total + stringToBytes(file.size), 0);
  
  const handleDeleteFile = (id: number) => {
    onUpdate(files.filter(file => file.id !== id));
    toast.success("Arquivo excluído com sucesso!");
  };
  
  const handleFileUpload = (file: File) => {
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
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Arquivos</CardTitle>
        <StorageIndicator 
          usedStorage={usedStorage} 
          storageLimit={STORAGE_LIMIT} 
          formatBytes={formatBytes} 
        />
      </CardHeader>
      <CardContent>
        {isEditing && (
          <FileUploader 
            usedStorage={usedStorage} 
            storageLimit={STORAGE_LIMIT} 
            onFileUpload={handleFileUpload} 
          />
        )}
        
        <FilesList 
          files={files} 
          onDeleteFile={handleDeleteFile} 
          isEditing={isEditing} 
        />
      </CardContent>
    </Card>
  );
};

export default FilesTab;
