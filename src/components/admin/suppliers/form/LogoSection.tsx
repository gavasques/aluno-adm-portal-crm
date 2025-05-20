
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormSection from "./FormSection";

const LogoSection = () => {
  const { control } = useFormContext();

  return (
    <FormSection>
      <FormField
        control={control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Iniciais do Logo (2 letras)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: DN" 
                maxLength={2}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.substring(0, 2).toUpperCase();
                  e.target.value = value;
                  field.onChange(e);
                }} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
};

export default LogoSection;
