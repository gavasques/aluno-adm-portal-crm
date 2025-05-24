
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, SupplierFormValues, supplierSchema } from "@/types/my-suppliers.types";

export const useSupplierForm = () => {
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

  return form;
};
