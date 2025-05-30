
import React, { useState } from "react";
import { FilePlus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useUserStorage } from "@/hooks/useUserStorage";

interface FileUploaderProps {
  onFileUpload: (file: globalThis.File) => void;
  disabled?: boolean;
  supplierId?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  disabled = false,
  supplierId
}) => {
  const { storageInfo, canUploadFile, recordFileUpload } = useUserStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar se pode fazer upload
      const canUpload = await canUploadFile(file.size / (1024 * 1024)); // Convert bytes to MB
      
      if (!canUpload) {
        toast.error(
          "Limite de armazenamento atingido! " +
          "Exclua alguns arquivos ou entre em contato com o administrador para solicitar mais espaço."
        );
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
          
          // Registrar o arquivo no sistema
          recordFileUpload(
            file.name,
            file.size / (1024 * 1024), // Convert bytes to MB
            file.type,
            supplierId
          );
          
          // Chamar função original de upload
          onFileUpload(file);
          
          // Limpar o input
          e.target.value = '';
        }
      }, 100);
    }
  };

  const isStorageFull = storageInfo && storageInfo.storage_available_mb <= 0;
  const isNearLimit = storageInfo && storageInfo.usage_percentage >= 90;
  
  return (
    <div className="mb-6">
      {/* Aviso de limite */}
      {isNearLimit && !isStorageFull && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Seu armazenamento está quase cheio ({storageInfo?.usage_percentage.toFixed(0)}% usado). 
            Considere excluir alguns arquivos.
          </p>
        </div>
      )}

      {isStorageFull && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-800 text-sm">
            🚫 Limite de armazenamento atingido! 
            Exclua alguns arquivos ou entre em contato com o administrador.
          </p>
        </div>
      )}

      <div className="border-2 border-dashed rounded-md p-6 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleAddFile}
          disabled={isUploading || disabled || isStorageFull}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center cursor-pointer ${
            isStorageFull || disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FilePlus className="h-10 w-10 text-portal-primary mb-2" />
          <span className="text-portal-primary font-medium">
            {isStorageFull ? 
              "Limite de armazenamento atingido" : 
              "Clique para enviar um arquivo"}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            ou arraste e solte aqui
          </span>
          {storageInfo && (
            <span className="text-xs text-gray-400 mt-2">
              Espaço disponível: {(storageInfo.storage_available_mb).toFixed(1)} MB
            </span>
          )}
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
