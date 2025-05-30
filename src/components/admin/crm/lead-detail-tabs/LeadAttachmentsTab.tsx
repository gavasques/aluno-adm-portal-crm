
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Download, Trash2, Plus } from 'lucide-react';
import { useCRMLeadAttachments } from '@/hooks/crm/useCRMLeadAttachments';

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadAttachment(file);
    
    // Limpar input
    event.target.value = '';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho desconhecido';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Anexos ({attachments.length})</h3>
        <div>
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Label htmlFor="file-upload">
            <Button asChild disabled={uploading}>
              <span className="cursor-pointer">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Arquivo
                  </>
                )}
              </span>
            </Button>
          </Label>
        </div>
      </div>

      {attachments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum anexo</h4>
            <p className="text-gray-500 text-center mb-4">
              Adicione arquivos para compartilhar com a equipe
            </p>
            <Label htmlFor="file-upload">
              <Button asChild variant="outline">
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Arquivo
                </span>
              </Button>
            </Label>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <Card key={attachment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {attachment.file_name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(attachment.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(attachment.created_at)}</span>
                        {attachment.user && (
                          <>
                            <span>•</span>
                            <span>Por {attachment.user.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
                      onClick={() => deleteAttachment(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadAttachmentsTab;
