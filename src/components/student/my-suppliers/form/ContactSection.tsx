
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Control } from "react-hook-form";

interface ContactSectionProps {
  control: Control<any>;
}

export const ContactSection = ({ control }: ContactSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <FormField
          control={control}
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
          control={control}
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
  );
};
