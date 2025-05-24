
import { Eye, Trash } from "lucide-react";
import { MySupplier } from "@/types/my-suppliers.types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { memo, useCallback } from "react";

interface SupplierTableRowProps {
  supplier: MySupplier;
  index: number;
  onSelectSupplier: (supplier: MySupplier) => void;
  onDeleteSupplier: (id: string) => void;
}

const supplierTypes: Record<string, string> = {
  "Distribuidor": "bg-blue-500",
  "Fabricante": "bg-green-500",
  "Importador": "bg-amber-500",
  "Atacadista": "bg-purple-500",
  "Varejista": "bg-pink-500",
  "Representante": "bg-indigo-500"
};

export const SupplierTableRow = memo(({ supplier, index, onSelectSupplier, onDeleteSupplier }: SupplierTableRowProps) => {
  const handleSelectSupplier = useCallback(() => {
    onSelectSupplier(supplier);
  }, [onSelectSupplier, supplier]);

  const handleDeleteSupplier = useCallback(() => {
    onDeleteSupplier(supplier.id);
  }, [onDeleteSupplier, supplier.id]);

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <TableRow 
      key={supplier.id} 
      className="border-purple-100 cursor-pointer hover:bg-purple-50/50 transition-colors"
      onClick={handleSelectSupplier}
    >
      <TableCell className="p-4 align-middle w-[40%]">
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
      <TableCell className="p-4 align-middle w-[15%]">
        <div className="flex justify-center">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium px-2.5 py-1 text-center">
            {supplier.category}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="p-4 align-middle w-[15%] font-mono text-sm text-gray-600 text-center">
        {supplier.cnpj || "-"}
      </TableCell>
      <TableCell className="p-4 align-middle w-[20%]">
        <div className="flex flex-wrap justify-center gap-1">
          {supplier.brands && supplier.brands.length > 0 ? (
            supplier.brands.slice(0, 2).map((brand, idx) => (
              <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                {brand.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">Nenhuma marca</span>
          )}
          {supplier.brands && supplier.brands.length > 2 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 border border-gray-200">
              +{supplier.brands.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="p-4 align-middle w-[10%] text-right">
        <div className="flex justify-end gap-2" onClick={handleStopPropagation}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectSupplier}
            className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 font-medium shadow-sm hover:shadow transition-all"
          >
            <Eye size={14} className="mr-1" /> Ver
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-500 shadow-sm hover:shadow transition-all"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-purple-100 shadow-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-800">Excluir fornecedor</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Tem certeza que deseja excluir <span className="font-semibold text-purple-700">{supplier.name}</span>? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-100">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteSupplier}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
});

SupplierTableRow.displayName = "SupplierTableRow";
