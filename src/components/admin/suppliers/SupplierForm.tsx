
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Import form sections
import BasicInfoSection from "./form/BasicInfoSection";
import ContactSection from "./form/ContactSection";
import AddressSection from "./form/AddressSection";
import LogoSection from "./form/LogoSection";
import FormActions from "./form/FormActions";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  categoryId: z.coerce.number().min(1, "A categoria é obrigatória"),
  cnpj: z.string().min(1, "O CNPJ é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  website: z.string().optional(),
  address: z.string().min(1, "O endereço é obrigatório"),
  logo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SupplierFormProps {
  supplier?: any;
  onSubmit: (data: any) => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSubmit }) => {
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: supplier ? {
      name: supplier.name || "",
      categoryId: supplier.categoryId || "",
      cnpj: supplier.cnpj || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      website: supplier.website || "",
      address: supplier.address || "",
      logo: supplier.logo || "",
    } : {
      name: "",
      categoryId: "",
      cnpj: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      logo: "",
    },
  });

  // Handle form submission
  const handleSubmit = (data: FormValues) => {
    // Find category name from ID
    const CATEGORIES = [
      { id: 1, name: "Produtos Diversos" },
      { id: 2, name: "Eletrônicos" },
      { id: 3, name: "Vestuário" },
      { id: 4, name: "Tecnologia" },
      { id: 5, name: "Sustentáveis" },
    ];
    
    const category = CATEGORIES.find(cat => cat.id === data.categoryId)?.name || "";
    
    // Maintain existing values and add new ones
    const updatedData = {
      ...supplier,
      ...data,
      category,
      rating: supplier?.rating || 0,
      comments: supplier?.comments || 0,
    };
    
    onSubmit(updatedData);
    toast.success(supplier ? "Fornecedor atualizado com sucesso!" : "Fornecedor adicionado com sucesso!");
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoSection />
        <ContactSection />
        <AddressSection />
        <LogoSection />
        <FormActions isEditing={!!supplier} />
      </form>
    </FormProvider>
  );
};

export default SupplierForm;
