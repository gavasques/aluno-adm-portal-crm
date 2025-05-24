
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, SupplierFormValues, supplierSchema } from "@/types/my-suppliers.types";
import { useMemo } from "react";

export const useOptimizedSupplierForm = () => {
  const defaultValues = useMemo(() => ({
    name: "",
    category: CATEGORIES[0],
    cnpj: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    type: "Distribuidor" as const
  }), []);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues
  });

  return form;
};
