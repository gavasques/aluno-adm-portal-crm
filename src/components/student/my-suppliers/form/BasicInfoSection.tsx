
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/types/my-suppliers.types";
import { motion } from "framer-motion";
import { Control } from "react-hook-form";
import { formatCNPJ } from "./formatters";

interface BasicInfoSectionProps {
  control: Control<any>;
}

export const BasicInfoSection = ({ control }: BasicInfoSectionProps) => {
  return (
    <>
      <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
                    const value = e.target.value.replace(/\D/g, '');
                    const formattedValue = formatCNPJ(e.target.value);
                    
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
      
      <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <FormField
          control={control}
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
    </>
  );
};
