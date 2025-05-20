
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FilePlus, FileText } from "lucide-react";
import { toast } from "sonner";
import { Tool } from "../ToolsTable";

interface FilesTabProps {
  tool: Tool;
  onUpdateTool: (updatedTool: Tool) => void;
}

const FilesTab: React.FC<FilesTabProps> = ({ tool, onUpdateTool }) => {
  
  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo não pode ter mais de 5MB");
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Por favor, envie um arquivo PDF, DOC, DOCX, XLS, XLSX, ZIP ou TXT.");
      return;
    }
    
    const newFile = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      date: new Date().toLocaleDateString()
    };
    
    const updatedTool = {
      ...tool,
      files: [...tool.files, newFile]
    };
    
    onUpdateTool(updatedTool);
    toast.success(`Arquivo "${file.name}" enviado com sucesso!`);
  };
  
  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Arquivos</h3>
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleUploadFile}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
            />
            <label htmlFor="file-upload">
              <Button variant="default" size="sm" className="cursor-pointer">
                <FilePlus className="h-4 w-4 mr-1" /> Upload de Arquivo
              </Button>
            </label>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, ZIP, TXT (máx: 5MB)
        </div>
        
        {tool.files && tool.files.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tool.files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.type.split('/')[1].toUpperCase()}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Nenhum arquivo disponível.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesTab;
