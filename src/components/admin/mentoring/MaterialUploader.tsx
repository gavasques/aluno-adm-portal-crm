
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface MaterialUploaderProps {
  sessionId: string;
  onUpload: (sessionId: string, file: File, description?: string) => Promise<boolean>;
}

const MaterialUploader: React.FC<MaterialUploaderProps> = ({ sessionId, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo permitido: 10MB");
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo primeiro");
      return;
    }

    setUploading(true);
    const success = await onUpload(sessionId, selectedFile, description);
    
    if (success) {
      setSelectedFile(null);
      setDescription("");
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
    setUploading(false);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Arraste um arquivo aqui ou clique para selecionar
            </span>
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeSelectedFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-3">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição para o arquivo..."
              rows={2}
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="mt-3 w-full"
          >
            {uploading ? "Enviando..." : "Enviar Arquivo"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MaterialUploader;
