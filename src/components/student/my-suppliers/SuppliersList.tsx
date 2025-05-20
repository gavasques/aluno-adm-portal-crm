
import { ArrowUpDown, Trash, Eye } from "lucide-react";
import { MySupplier } from "@/types/my-suppliers.types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const supplierTypes: Record<string, string> = {
    "Distribuidor": "bg-blue-500",
    "Fabricante": "bg-green-500",
    "Importador": "bg-amber-500",
    "Atacadista": "bg-purple-500",
    "Varejista": "bg-pink-500",
    "Representante": "bg-indigo-500"
  };

  return (
    <Card className="bg-white rounded-lg shadow-md border-purple-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <TableRow className="hover:bg-transparent border-purple-100">
              <TableHead className="w-[40%] font-semibold text-purple-900">
                <Button 
                  variant="ghost" 
                  onClick={() => onSort("name")}
                  className="flex items-center gap-1 font-medium text-purple-900 hover:text-purple-700 hover:bg-purple-100/50"
                >
                  Nome <ArrowUpDown className={`h-4 w-4 ${sortField === "name" ? "text-purple-600" : ""}`} />
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-purple-900">
                <Button 
                  variant="ghost" 
                  onClick={() => onSort("category")}
                  className="flex items-center gap-1 font-medium text-purple-900 hover:text-purple-700 hover:bg-purple-100/50"
                >
                  Categoria <ArrowUpDown className={`h-4 w-4 ${sortField === "category" ? "text-purple-600" : ""}`} />
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-purple-900">CNPJ</TableHead>
              <TableHead className="font-semibold text-purple-900">Marcas</TableHead>
              <TableHead className="text-right font-semibold text-purple-900">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-500">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum fornecedor encontrado</h3>
                    <p className="text-gray-500 mb-4">Adicione seu primeiro fornecedor para começar.</p>
                    <Button 
                      onClick={onAddSupplier}
                      className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg> Adicionar Fornecedor
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier, index) => (
                <motion.tr 
                  key={supplier.id} 
                  className="hover:bg-purple-50 cursor-pointer border-purple-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => onSelectSupplier(supplier)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center text-sm font-medium shadow-sm`}>
                        {supplier.logo}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-xs text-gray-500">
                          <Badge className={`${supplierTypes[supplier.type] || "bg-gray-500"} text-[10px] py-0 px-1.5`}>
                            {supplier.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {supplier.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{supplier.cnpj}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {supplier.brands.length > 0 ? (
                        supplier.brands.map((brand, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                            {brand.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Nenhuma marca</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSupplier(supplier);
                        }}
                        className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700"
                      >
                        <Eye size={14} className="mr-1" /> Ver
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-500"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border-purple-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-800">Excluir fornecedor</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Tem certeza que deseja excluir <span className="font-semibold text-purple-700">{supplier.name}</span>? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-100">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDeleteSupplier(supplier.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Supplier Card for Empty State (Não é mais necessário aqui, pois está no TableCell acima) */}
    </Card>
  );
}
