
import React from 'react';
import { FileText, Upload, Download, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useCRMLeadAttachments } from '@/hooks/crm/useCRMLeadAttachments';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadAttachmentsTabProps {
  leadId: string;
}

const LeadAttachmentsTab = ({ leadId }: LeadAttachmentsTabProps) => {
  const { 
    attachments, 
    loading, 
    uploading, 
    uploadAttachment, 
    deleteAttachment, 
    downloadAttachment 
  } = useCRMLeadAttachments(leadId);

  const getFileIcon = (type: string) => {
    const fileType = type.toLowerCase();
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('zip') || fileType.includes('rar')) {
      return <FileText className="h-5 w-5 text-purple-500" />;
    } else if (fileType.includes('doc') || fileType.includes('docx')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('xls') || fileType.includes('xlsx')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else if (fileType.includes('image')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAttachment(file);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (confirm('Tem certeza que deseja remover este anexo?')) {
      await deleteAttachment(attachmentId);
    }
  };

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Anexos ({attachments.length})</h3>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Enviando...' : 'Adicionar Arquivo'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {attachments.map((attachment, index) => (
          <motion.div
            key={attachment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(attachment.file_type || '')}
                <div>
                  <h4 className="font-medium text-gray-900">{attachment.file_name}</h4>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(attachment.file_size)} • 
                    Enviado por {attachment.user?.name} • 
                    {formatDistanceToNow(new Date(attachment.created_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => downloadAttachment(attachment)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => downloadAttachment(attachment)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteAttachment(attachment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {attachments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhum anexo encontrado para este lead</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Adicionar Primeiro Arquivo
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadAttachmentsTab;
