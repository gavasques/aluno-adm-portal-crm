
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Video, 
  File,
  Download,
  Eye
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress?: number;
  uploaded?: boolean;
}

interface FileUploadWithPreviewProps {
  onFilesUpload: (files: File[]) => Promise<void>;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
  existingFiles?: UploadedFile[];
  onFileDelete?: (fileId: string) => void;
}

const FileUploadWithPreview = ({
  onFilesUpload,
  acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mov",
  maxSize = 50,
  maxFiles = 10,
  className = '',
  existingFiles = [],
  onFileDelete
}: FileUploadWithPreviewProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const validateFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`Arquivo muito grande. Máximo: ${maxSize}MB`);
    }
    
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      throw new Error(`Tipo de arquivo não suportado: ${extension}`);
    }
    
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      alert('Erros encontrados:\n' + errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    // Simulate upload progress
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      uploaded: false
    }));

    setUploadingFiles(newFiles);

    // Simulate upload progress
    for (const fileData of newFiles) {
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, progress } : f)
        );
      }
    }

    // Mark as completed
    setUploadingFiles(prev => 
      prev.map(f => ({ ...f, uploaded: true, url: '#' }))
    );

    // Move to uploaded files
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, ...uploadingFiles.map(f => ({ ...f, uploaded: true }))]);
      setUploadingFiles([]);
    }, 500);

    // Call the parent handler
    await onFilesUpload(validFiles);
  };

  const handleDelete = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (onFileDelete) {
      onFileDelete(fileId);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <div className="text-lg font-medium">
            Arraste arquivos aqui ou clique para selecionar
          </div>
          <div className="text-sm text-gray-500">
            Tipos aceitos: {acceptedTypes}
          </div>
          <div className="text-sm text-gray-500">
            Tamanho máximo: {maxSize}MB por arquivo
          </div>
        </div>
        <input
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <Button asChild className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            Selecionar Arquivos
          </label>
        </Button>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Enviando...</h4>
          {uploadingFiles.map((file) => {
            const IconComponent = getFileIcon(file.type);
            return (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-gray-500" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      <Progress value={file.progress} className="mt-2" />
                      <div className="text-sm text-gray-500 mt-1">
                        {file.progress}% enviado
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Arquivos ({uploadedFiles.length})</h4>
          {uploadedFiles.map((file) => {
            const IconComponent = getFileIcon(file.type);
            return (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-gray-500" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {file.url && (
                        <>
                          <Button variant="ghost" size="sm" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(file.id)}
                        title="Remover"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUploadWithPreview;
