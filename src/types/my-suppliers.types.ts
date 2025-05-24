
import { z } from "zod";

// Database interfaces matching Supabase tables
export interface MySupplierBrand {
  id: string;
  supplier_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface MySupplierBranch {
  id: string;
  supplier_id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  cnpj?: string;
  created_at: string;
}

export interface MySupplierContact {
  id: string;
  supplier_id: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface MySupplierCommunication {
  id: string;
  supplier_id: string;
  date: string;
  type: string;
  notes?: string;
  contact?: string;
  created_at: string;
}

export interface MySupplierRating {
  id: string;
  supplier_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment?: string;
  likes: number;
  user_liked: boolean;
  created_at: string;
}

export interface MySupplierComment {
  id: string;
  supplier_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  likes: number;
  user_liked: boolean;
  parent_id?: string;
  created_at: string;
  replies?: MySupplierComment[];
}

// Main supplier interface matching database
export interface MySupplier {
  id: string;
  user_id: string;
  name: string;
  category: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  type: string;
  logo: string;
  rating: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  // Related data
  brands: MySupplierBrand[];
  branches: MySupplierBranch[];
  contacts: MySupplierContact[];
  communications: MySupplierCommunication[];
  ratings: MySupplierRating[];
  commentItems: MySupplierComment[];
  files: any[];
  images: any[];
}

// Schema for supplier form validation
export const supplierSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  category: z.string().min(2, { message: "A categoria é obrigatória" }),
  cnpj: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  type: z.string()
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

// List of categories for dropdown
export const CATEGORIES = [
  "Produtos Regionais",
  "Tecnologia",
  "Vestuário",
  "Alimentos",
  "Bebidas",
  "Eletrônicos",
  "Sustentáveis",
  "Decoração",
  "Produtos Diversos"
];
