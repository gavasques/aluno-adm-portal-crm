
import React, { useState } from "react";
import { FilePlus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FileUploaderProps {
  usedStorage: number;
  storageLimit: number;
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  usedStorage,
  storageLimit,
  onFileUpload,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSize = file.size;
      
      // Verificar se tem espaço suficiente
      if (usedStorage + fileSize > storageLimit) {
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
          setIsUploading(false);
          setUploadProgress(0);
          onFileUpload(file);
          
          // Limpar o input
          e.target.value = '';
        }
      }, 100);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="border-2 border-dashed rounded-md p-6 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleAddFile}
          disabled={isUploading || disabled || usedStorage >= storageLimit}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center cursor-pointer ${
            usedStorage >= storageLimit || disabled ? 'opacity-50' : ''
          }`}
        >
          <FilePlus className="h-10 w-10 text-portal-primary mb-2" />
          <span className="text-portal-primary font-medium">
            {usedStorage >= storageLimit ? 
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
  );
};

export default FileUploader;
