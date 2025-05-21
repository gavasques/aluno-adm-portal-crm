
import { MySupplier } from "@/types/my-suppliers.types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SupplierTableRowProps {
  supplier: MySupplier;
  index: number;
  onSelectSupplier: (supplier: MySupplier) => void;
  onDeleteSupplier: (id: number) => void;
}

export function SupplierTableRow({ supplier, index, onSelectSupplier, onDeleteSupplier }: SupplierTableRowProps) {
  // Animation variants for list items
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut"
      }
    }),
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(139, 92, 246, 0.08)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.tr
      className="border-purple-100 cursor-pointer"
      variants={tableRowVariants}
      custom={index}
      whileHover="hover"
      onClick={() => onSelectSupplier(supplier)}
    >
      {/* COLUNA NOME */}
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {supplier.logo}
          </div>
          <div className="font-medium text-gray-900">{supplier.name}</div>
        </div>
      </TableCell>

      {/* COLUNA CATEGORIA */}
      <TableCell>
        <span className="text-gray-700">{supplier.category}</span>
      </TableCell>

      {/* COLUNA TIPO */}
      <TableCell>
        {supplier.type ? (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 font-medium">
            {supplier.type}
          </Badge>
        ) : (
          <span className="text-xs text-gray-400 italic">Não definido</span>
        )}
      </TableCell>

      {/* COLUNA CNPJ */}
      <TableCell className="font-mono text-sm text-gray-600">{supplier.cnpj}</TableCell>

      {/* COLUNA MARCAS */}
      <TableCell>
        <div className="flex flex-wrap gap-1">
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

      {/* COLUNA AÇÕES */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSupplier(supplier);
            }}
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
                  onClick={() => onDeleteSupplier(supplier.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </motion.tr>
  );
}
