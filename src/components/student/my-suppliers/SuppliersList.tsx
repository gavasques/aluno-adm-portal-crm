
import { ArrowUpDown, Trash } from "lucide-react";
import { MySupplier } from "@/types/my-suppliers.types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface SuppliersListProps {
  suppliers: MySupplier[];
  onSelectSupplier: (supplier: MySupplier) => void;
  onDeleteSupplier: (id: number) => void;
  sortField: "name" | "category";
  sortDirection: "asc" | "desc";
  onSort: (field: "name" | "category") => void;
  onAddSupplier: () => void;
}

export function SuppliersList({
  suppliers,
  onSelectSupplier,
  onDeleteSupplier,
  sortField,
  sortDirection,
  onSort,
  onAddSupplier
}: SuppliersListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">
              <Button 
                variant="ghost" 
                onClick={() => onSort("name")}
                className="flex items-center gap-1 font-medium"
              >
                Nome <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort("category")}
                className="flex items-center gap-1 font-medium"
              >
                Categoria <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Marcas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nenhum fornecedor encontrado.
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-portal-primary text-white flex items-center justify-center text-sm font-medium mr-3">
                      {supplier.logo}
                    </div>
                    {supplier.name}
                  </div>
                </TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>{supplier.cnpj}</TableCell>
                <TableCell>
                  {supplier.brands.map((brand, index) => (
                    <span key={brand.id} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-800 mr-1">
                      {brand.name}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onSelectSupplier(supplier)}
                    >
                      Gerenciar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir fornecedor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir {supplier.name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteSupplier(supplier.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Add Supplier Card for Empty State */}
      {suppliers.length === 0 && (
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed mt-6" onClick={onAddSupplier}>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-14 h-14 rounded-full bg-portal-light flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-portal-primary">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </div>
            <h3 className="font-medium text-lg text-portal-primary mb-2">Adicionar Novo Fornecedor</h3>
            <p className="text-sm text-gray-500 text-center">
              Clique aqui para cadastrar um novo fornecedor em sua lista
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
