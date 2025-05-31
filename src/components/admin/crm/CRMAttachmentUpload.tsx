
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, Download, Eye } from 'lucide-react';
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
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
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

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) return '🖼️';
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return '📊';
    if (fileType?.includes('text')) return '📄';
    return '📎';
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
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Enviando arquivo...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2"></div>
                </div>
              </div>
            ) : isDragActive ? (
              <p className="text-sm text-blue-600">Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-xs text-gray-500">
                  Suporte: Imagens, PDF, DOC, DOCX, XLS, XLSX, TXT, CSV (até 50MB)
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
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <File className="h-4 w-4" />
              Anexos ({attachments.length})
            </h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getFileIcon(attachment.file_type || '')}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {attachment.file_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.file_size || 0)} • {formatDate(attachment.created_at)}
                        {attachment.user && ` • ${attachment.user.name}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {attachment.file_type?.startsWith('image/') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadAttachment(attachment.file_path, attachment.file_name)}
                        className="h-8 w-8 p-0"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadAttachment(attachment.file_path, attachment.file_name)}
                      className="h-8 w-8 p-0"
                      title="Baixar"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAttachment(attachment.id, attachment.file_path)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Remover"
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
