import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Plus, FileText, Trash } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface FilesTabProps {
  partner: Partner;
}

const FilesTab = ({ partner }: FilesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Arquivos</span>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Arquivo
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {partner.files && partner.files.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Adicionado por</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partner.files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.uploadedBy}</TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o arquivo "{file.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-center mb-4 text-gray-500">
              Nenhum arquivo disponível.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Arquivo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesTab;
