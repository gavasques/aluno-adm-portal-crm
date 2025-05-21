
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

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg border-purple-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <TableRow className="hover:bg-transparent border-purple-200">
              <TableHead className="font-semibold text-purple-900 w-[30%]">
                <Button 
                  variant="ghost" 
                  onClick={() => onSort("name")}
                  className="flex items-center gap-1 font-medium text-purple-900 hover:text-purple-700 hover:bg-purple-100/50"
                >
                  Nome {" "}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: sortField === "name" ? (sortDirection === "asc" ? 0 : 180) : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpDown className={`h-4 w-4 ${sortField === "name" ? "text-purple-600" : ""}`} />
                  </motion.div>
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-purple-900 w-[15%]">
                <Button 
                  variant="ghost" 
                  onClick={() => onSort("category")}
                  className="flex items-center gap-1 font-medium text-purple-900 hover:text-purple-700 hover:bg-purple-100/50"
                >
                  Categoria {" "}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: sortField === "category" ? (sortDirection === "asc" ? 0 : 180) : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpDown className={`h-4 w-4 ${sortField === "category" ? "text-purple-600" : ""}`} />
                  </motion.div>
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-purple-900 w-[20%]">CNPJ</TableHead>
              <TableHead className="font-semibold text-purple-900 w-[25%]">Marcas</TableHead>
              <TableHead className="text-right font-semibold text-purple-900 w-[10%]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16">
                  <motion.div 
                    className="flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-3 shadow-inner"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                      </svg>
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-medium text-gray-700 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Nenhum fornecedor encontrado
                    </motion.h3>
                    <motion.p 
                      className="text-gray-500 mb-6 text-center max-w-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Adicione seu primeiro fornecedor para começar a organizar sua rede de suprimentos.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button 
                        onClick={onAddSupplier}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg> Adicionar Fornecedor
                      </Button>
                    </motion.div>
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : (
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {suppliers.map((supplier, index) => (
  <motion.tr 
    key={supplier.id} 
    className="border-purple-100 cursor-pointer"
    variants={tableRowVariants}
    custom={index}
    whileHover="hover"
    onClick={() => onSelectSupplier(supplier)}
  >
    {/* Nome + logo + tipo pequeno */}
    <TableCell>
      <div className="flex items-center gap-3">
        {supplier.logo && (
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {supplier.logo}
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">{supplier.name}</div>
          {supplier.type && (
            <div className="text-xs text-gray-400">{supplier.type}</div>
          )}
        </div>
      </div>
    </TableCell>
    {/* Categoria */}
    <TableCell>
      <span className="text-gray-700">{supplier.category}</span>
    </TableCell>
    {/* CNPJ */}
    <TableCell className="font-mono text-sm text-gray-600">{supplier.cnpj}</TableCell>
    {/* Marcas */}
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
    {/* Ações */}
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
))}

              </motion.tbody>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
