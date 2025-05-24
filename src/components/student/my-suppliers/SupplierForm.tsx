
import { Form } from "@/components/ui/form";
import { SupplierFormValues } from "@/types/my-suppliers.types";
import { motion } from "framer-motion";
import { useOptimizedSupplierForm } from "@/hooks/student/my-suppliers/useOptimizedSupplierForm";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { ContactSection } from "./form/ContactSection";
import { AdditionalInfoSection } from "./form/AdditionalInfoSection";
import { FormActions } from "./form/FormActions";
import { memo } from "react";

interface SupplierFormProps {
  onSubmit: (data: SupplierFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const SupplierForm = memo(({ onSubmit, onCancel, isSubmitting }: SupplierFormProps) => {
  const form = useOptimizedSupplierForm();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <BasicInfoSection control={form.control} />
          <ContactSection control={form.control} />
          <AdditionalInfoSection control={form.control} />
        </motion.div>
        
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
});

SupplierForm.displayName = "SupplierForm";
