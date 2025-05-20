
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, SupplierFormValues, supplierSchema } from "@/types/my-suppliers.types";
import { motion } from "framer-motion";

interface SupplierFormProps {
  onSubmit: (data: SupplierFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SupplierForm({ onSubmit, onCancel, isSubmitting }: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      category: CATEGORIES[0],
      cnpj: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      type: "Distribuidor"
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900">Nome*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do fornecedor" 
                      {...field} 
                      className="border-purple-200 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900">Categoria*</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900">CNPJ</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00.000.000/0000-00" 
                      {...field} 
                      className="border-purple-200 focus-visible:ring-purple-500"
                      onChange={(e) => {
                        // Permitir apenas números
                        const value = e.target.value.replace(/\D/g, '');
                        
                        // Formatar o CNPJ
                        let formattedValue = value;
                        if (value.length > 2) formattedValue = value.substring(0, 2) + '.' + value.substring(2);
                        if (value.length > 5) formattedValue = formattedValue.substring(0, 6) + '.' + value.substring(5);
                        if (value.length > 8) formattedValue = formattedValue.substring(0, 10) + '/' + value.substring(8);
                        if (value.length > 12) formattedValue = formattedValue.substring(0, 15) + '-' + value.substring(12, 14);
                        
                        // Limitar ao tamanho máximo
                        if (value.length <= 14) {
                          field.onChange(formattedValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-900">E-mail</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@exemplo.com" 
                        {...field} 
                        className="border-purple-200 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-900">Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field} 
                        className="border-purple-200 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>
          
          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900">Website</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="www.example.com" 
                      {...field} 
                      className="border-purple-200 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900">Endereço</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Rua, número, bairro - cidade/estado" 
                      {...field} 
                      className="border-purple-200 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900">Tipo</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="Distribuidor">Distribuidor</option>
                      <option value="Fabricante">Fabricante</option>
                      <option value="Importador">Importador</option>
                      <option value="Atacadista">Atacadista</option>
                      <option value="Varejista">Varejista</option>
                      <option value="Representante">Representante</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </motion.div>
        </motion.div>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            type="button"
            onClick={onCancel}
            className="mr-2 border-gray-200 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Fornecedor"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
