
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, Image, Video, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaterialUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollmentId?: string;
  sessionId?: string;
  onUploadSuccess?: () => void;
}

export const MaterialUploadDialog: React.FC<MaterialUploadDialogProps> = ({
  open,
  onOpenChange,
  enrollmentId,
  sessionId,
  onUploadSuccess
}) => {
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileName.trim() || !description.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos e selecione um arquivo.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simular upload - aqui você implementaria a lógica real de upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Uploading material:', {
        fileName,
        description,
        file: selectedFile,
        enrollmentId,
        sessionId
      });

      toast({
        title: "Sucesso",
        description: "Material enviado com sucesso!"
      });

      // Reset form
      setFileName('');
      setDescription('');
      setSelectedFile(null);
      onUploadSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar material. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Material</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nome do arquivo */}
          <div className="space-y-2">
            <Label htmlFor="fileName">Nome do Material</Label>
            <Input
              id="fileName"
              placeholder="Ex: Plano de Negócios Template"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o que é este arquivo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label>Arquivo</Label>
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div>
                  <label className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Clique para selecionar um arquivo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, XLS, PPT, imagens ou vídeos (máx. 50MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(selectedFile)}
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile || !fileName.trim() || !description.trim()}
            >
              {isUploading ? 'Enviando...' : 'Enviar Material'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialUploadDialog;
