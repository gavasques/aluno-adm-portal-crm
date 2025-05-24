
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash, FileText, FileArchive, Image } from "lucide-react";
import { MentoriaMaterialAnexado } from "@/types/mentoring.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MaterialsListProps {
  materials: MentoriaMaterialAnexado[];
  onDownload: (material: MentoriaMaterialAnexado) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const MaterialsList: React.FC<MaterialsListProps> = ({ 
  materials, 
  onDownload, 
  onDelete, 
  isAdmin = true 
}) => {
  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="h-5 w-5" />;
    
    if (mimeType.includes('image')) return <Image className="h-5 w-5" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <FileArchive className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getFileTypeBadge = (mimeType?: string) => {
    if (!mimeType) return "Arquivo";
    if (mimeType.includes('pdf')) return "PDF";
    if (mimeType.includes('word') || mimeType.includes('document')) return "DOC";
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return "XLS";
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return "PPT";
    if (mimeType.includes('image')) return "IMG";
    return "Arquivo";
  };

  if (materials.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p>Nenhum material anexado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => (
        <div
          key={material.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-blue-500">
              {getFileIcon(material.tipo_mime_arquivo)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {material.nome_arquivo}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Por: {material.uploader_nome}</span>
                <span>•</span>
                <span>
                  {format(new Date(material.data_upload), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
                <span>•</span>
                <span>{formatFileSize(material.tamanho_arquivo_bytes)}</span>
              </div>
              {material.descricao_material && (
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {material.descricao_material}
                </p>
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {getFileTypeBadge(material.tipo_mime_arquivo)}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(material)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Download className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(material.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaterialsList;
