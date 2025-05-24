
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import FileUploader from "./files/FileUploader";
import FilesList from "./files/FilesList";
import StorageIndicator from "./files/StorageIndicator";
import { stringToBytes, formatBytes, STORAGE_LIMIT, CustomFile } from "./files/utils";
import { useUserStorage } from "@/hooks/useUserStorage";

interface FilesTabProps {
  files: CustomFile[];
  onUpdate: (files: CustomFile[]) => void;
  isEditing?: boolean;
  supplierId?: string;
}

const FilesTab: React.FC<FilesTabProps> = ({ 
  files = [], 
  onUpdate,
  isEditing = true,
  supplierId
}) => {
  const { storageInfo } = useUserStorage();
  
  // Usar dados reais de armazenamento se disponível
  const usedStorage = storageInfo ? storageInfo.storage_used_mb * 1024 * 1024 : 
    files.reduce((total, file) => total + stringToBytes(file.size), 0);
  
  const storageLimit = storageInfo ? storageInfo.storage_limit_mb * 1024 * 1024 : STORAGE_LIMIT;
  
  const handleDeleteFile = (id: number) => {
    onUpdate(files.filter(file => file.id !== id));
    toast.success("Arquivo excluído com sucesso!");
  };
  
  const handleFileUpload = (file: globalThis.File) => {
    // Adicionar novo arquivo à lista local
    const newFile: CustomFile = {
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
          storageLimit={storageLimit} 
          formatBytes={formatBytes} 
        />
      </CardHeader>
      <CardContent>
        {isEditing && (
          <FileUploader 
            onFileUpload={handleFileUpload}
            supplierId={supplierId}
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
