
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, Download } from 'lucide-react';
import { useCRMAttachments } from '@/hooks/crm/useCRMAttachments';
import { cn } from '@/lib/utils';

interface CRMAttachmentUploadProps {
  leadId: string;
  className?: string;
}

const CRMAttachmentUpload: React.FC<CRMAttachmentUploadProps> = ({ 
  leadId, 
  className 
}) => {
  const { 
    attachments, 
    loading, 
    uploading, 
    fetchAttachments, 
    uploadAttachment, 
    deleteAttachment, 
    downloadAttachment 
  } = useCRMAttachments(leadId);

  React.useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        console.warn('Arquivo muito grande:', file.name);
        continue;
      }
      await uploadAttachment(file);
    }
  }, [uploadAttachment]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {uploading ? (
              <p className="text-sm text-gray-600">Enviando arquivo...</p>
            ) : isDragActive ? (
              <p className="text-sm text-blue-600">Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-xs text-gray-500">
                  Suporte: Imagens, PDF, DOC, DOCX, TXT (até 50MB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">Anexos ({attachments.length})</h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{attachment.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.file_size || 0)} • {formatDate(attachment.created_at)}
                        {attachment.user && ` • ${attachment.user.name}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadAttachment(attachment.file_path, attachment.file_name)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAttachment(attachment.id, attachment.file_path)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CRMAttachmentUpload;
