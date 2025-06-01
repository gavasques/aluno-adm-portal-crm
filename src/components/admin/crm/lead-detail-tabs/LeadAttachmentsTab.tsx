
import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface LeadAttachmentsTabProps {
  leadId: string;
}

const LeadAttachmentsTab = ({ leadId }: LeadAttachmentsTabProps) => {
  const [attachments] = useState([
    {
      id: '1',
      name: 'Contrato_Assinado.pdf',
      size: '2.4 MB',
      type: 'PDF',
      uploadedAt: '2024-01-15',
      uploadedBy: 'João Silva'
    },
    {
      id: '2',
      name: 'Documentos_Empresa.zip',
      size: '8.1 MB',
      type: 'ZIP',
      uploadedAt: '2024-01-14',
      uploadedBy: 'Maria Santos'
    },
    {
      id: '3',
      name: 'Proposta_Comercial.docx',
      size: '1.2 MB',
      type: 'DOCX',
      uploadedAt: '2024-01-13',
      uploadedBy: 'João Silva'
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'zip':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Anexos ({attachments.length})</h3>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Adicionar Arquivo
        </Button>
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
                {getFileIcon(attachment.type)}
                <div>
                  <h4 className="font-medium text-gray-900">{attachment.name}</h4>
                  <p className="text-sm text-gray-500">
                    {attachment.size} • Enviado por {attachment.uploadedBy} em {attachment.uploadedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
          <p className="text-gray-500">Nenhum anexo encontrado</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Adicionar Primeiro Arquivo
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadAttachmentsTab;
