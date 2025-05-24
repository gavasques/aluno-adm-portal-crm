
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface BonusFile {
  id: string;
  name: string;
  size: number;
  type: string;
  description: string;
  uploadedAt: Date;
}

interface BonusFilesTabProps {
  files: BonusFile[];
  newFileDescription: string;
  onNewFileDescriptionChange: (value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (fileId: string) => void;
}

const BonusFilesTab: React.FC<BonusFilesTabProps> = ({
  files,
  newFileDescription,
  onNewFileDescriptionChange,
  onFileUpload,
  onDeleteFile
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card className="p-4">
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Adicionar Arquivo</h3>
            <div className="space-y-2">
              <Input 
                type="file" 
                id="file" 
                onChange={onFileUpload}
              />
              
              <Textarea 
                placeholder="Descrição do arquivo (opcional)" 
                value={newFileDescription}
                onChange={(e) => onNewFileDescriptionChange(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </Card>
        
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium mb-1">{file.name}</div>
                      <div className="text-sm text-gray-500 mb-1">
                        {formatFileSize(file.size)} &bull; {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                      {file.description && (
                        <p className="text-sm mt-1">{file.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDeleteFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1">Remover</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum arquivo adicionado.
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusFilesTab;
