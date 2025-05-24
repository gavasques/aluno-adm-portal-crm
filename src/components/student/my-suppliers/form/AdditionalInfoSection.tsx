
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Control } from "react-hook-form";

interface AdditionalInfoSectionProps {
  control: Control<any>;
}

export const AdditionalInfoSection = ({ control }: AdditionalInfoSectionProps) => {
  return (
    <>
      <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <FormField
          control={control}
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
          control={control}
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
    </>
  );
};
