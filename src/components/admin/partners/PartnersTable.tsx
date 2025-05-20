import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Pencil, Trash } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface PartnersTableProps {
  partners: Partner[];
  calculateAverageRating: (ratings: any[]) => string;
  handleOpenPartner: (partner: Partner) => void;
  handleEditPartner: (partner: Partner) => void;
  toggleRecommendedStatus: (partnerId: number) => void;
  handleDeletePartner: (partnerId: number) => void;
}

const PartnersTable = ({
  partners,
  calculateAverageRating,
  handleOpenPartner,
  handleEditPartner,
  toggleRecommendedStatus,
  handleDeletePartner
}: PartnersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Contato Principal</TableHead>
            <TableHead>Avaliação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nenhum parceiro encontrado com os filtros aplicados.
              </TableCell>
            </TableRow>
          ) : (
            partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {partner.name}
                    {partner.recommended && (
                      <Badge className="bg-green-500">Recomendado</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{partner.category}</TableCell>
                <TableCell>{partner.type}</TableCell>
                <TableCell>{partner.contact}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{calculateAverageRating(partner.ratings)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleOpenPartner(partner)}
                    >
                      Ver Detalhes
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleEditPartner(partner)}
                        >
                          <Pencil className="h-4 w-4 mr-2" /> Editar parceiro
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => toggleRecommendedStatus(partner.id)}
                        >
                          {partner.recommended ? "Remover recomendação" : "Marcar como recomendado"}
                        </DropdownMenuItem>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <span className="text-red-500 flex items-center">
                                <Trash className="h-4 w-4 mr-2" /> Excluir parceiro
                              </span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o parceiro "{partner.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePartner(partner.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnersTable;
