
import { z } from "zod";

// Interfaces for the supplier
export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likes: number;
  userLiked: boolean;
  replies: {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    content: string;
    date: string;
  }[];
}

export interface MySupplier {
  id: number;
  name: string;
  category: string;
  rating: number;
  commentCount: number;
  logo: string;
  cnpj: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  type: string;
  brands: any[];
  branches: any[];
  contacts: any[];
  communications: any[];
  files: any[];
  commentItems: Comment[];
  ratings: any[];
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
