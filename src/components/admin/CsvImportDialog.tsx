
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileImport, AlertCircle, CheckCircle2 } from "lucide-react";
import { Supplier } from "@/components/admin/SuppliersTable";
import { toast } from "sonner";

interface CsvImportDialogProps {
  onImport: (suppliers: Partial<Supplier>[]) => void;
  existingSuppliers: Supplier[];
}

interface ImportResult {
  success: number;
  errors: number;
  errorDetails: string[];
}

const CsvImportDialog: React.FC<CsvImportDialogProps> = ({ onImport, existingSuppliers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Verificar se o arquivo é CSV
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Por favor, selecione um arquivo CSV válido.");
        resetForm();
        return;
      }
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const processCsvFile = (content: string): { suppliers: Partial<Supplier>[], errors: string[] } => {
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) {
      return { suppliers: [], errors: ["O arquivo CSV está vazio."] };
    }

    const suppliers: Partial<Supplier>[] = [];
    const errors: string[] = [];
    
    // Processar cada linha do CSV
    for (let i = 0; i < lines.length; i++) {
      // Verifica se a linha é vazia
      if (!lines[i].trim()) continue;
      
      // Detecta o delimitador (vírgula ou ponto e vírgula)
      const delimiter = lines[i].includes(';') ? ';' : ',';
      const values = lines[i].split(delimiter);
      
      // Valida se tem pelo menos o campo Nome
      if (!values[0] || !values[0].trim()) {
        errors.push(`Linha ${i+1}: Nome do fornecedor é obrigatório.`);
        continue;
      }
      
      const name = values[0].trim();
      
      // Verifica se já existe fornecedor com esse nome
      if (existingSuppliers.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        errors.push(`Linha ${i+1}: Já existe um fornecedor com o nome "${name}".`);
        continue;
      }
      
      // Extrai categoria e tipo se disponíveis
      const category = values[1] ? values[1].trim() : "Produtos Diversos";
      const type = values[2] ? values[2].trim() : "Distribuidor";
      
      suppliers.push({
        name,
        category,
        type
      });
    }
    
    return { suppliers, errors };
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Por favor, selecione um arquivo CSV.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const content = await file.text();
      const { suppliers, errors } = processCsvFile(content);
      
      if (suppliers.length > 0) {
        onImport(suppliers);
      }
      
      setImportResult({
        success: suppliers.length,
        errors: errors.length,
        errorDetails: errors
      });
      
      if (suppliers.length > 0) {
        toast.success(`${suppliers.length} fornecedores importados com sucesso.`);
      }
      
      if (errors.length > 0) {
        toast.error(`${errors.length} registros não puderam ser importados.`);
      }
    } catch (error) {
      console.error("Erro ao processar arquivo CSV:", error);
      toast.error("Erro ao processar o arquivo CSV. Verifique o formato do arquivo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileImport className="h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Fornecedores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!importResult ? (
            <>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="csv-file">Arquivo CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <p className="text-xs text-gray-500">
                  O arquivo CSV deve conter os campos: Nome, Categoria, Tipo (nessa ordem). 
                  Apenas o campo Nome é obrigatório. O delimitador pode ser vírgula (,) ou ponto e vírgula (;).
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Registros importados com sucesso: <strong>{importResult.success}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>Registros com erro: <strong>{importResult.errors}</strong></span>
                </div>
              </div>
              
              {importResult.errorDetails.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erros na importação</AlertTitle>
                  <AlertDescription>
                    <div className="max-h-40 overflow-y-auto mt-2">
                      <ul className="list-disc list-inside text-sm">
                        {importResult.errorDetails.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={() => resetForm()} 
                variant="outline" 
                className="w-full"
              >
                Importar outro arquivo
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          {!importResult && (
            <>
              <Button 
                onClick={handleImport} 
                disabled={!file || isProcessing}
                className="mr-2"
              >
                {isProcessing ? "Processando..." : "Importar"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
            </>
          )}
          {importResult && (
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CsvImportDialog;
