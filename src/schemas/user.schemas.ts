
import * as z from "zod";
import { validatePassword } from "@/utils/security";

// Schema base para validação de senha
export const passwordValidationSchema = z
  .string()
  .min(1, "Senha é obrigatória")
  .superRefine((password, ctx) => {
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error,
        });
      });
    }
  });

// Schema para criação de usuário
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .transform(val => val.toLowerCase().trim()),
  
  role: z
    .enum(["Admin", "Student", "Mentor"], {
      required_error: "Selecione um papel",
      invalid_type_error: "Papel inválido"
    }),
  
  password: passwordValidationSchema,
  
  is_mentor: z.boolean().default(false)
});

// Schema para convite de usuário (sem senha obrigatória)
export const inviteUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .transform(val => val.toLowerCase().trim()),
  
  role: z
    .enum(["Admin", "Student", "Mentor"], {
      required_error: "Selecione um papel",
      invalid_type_error: "Papel inválido"
    })
});

// Schema para atualização de usuário
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços")
    .optional(),
  
  role: z
    .enum(["Admin", "Student", "Mentor"])
    .optional(),
  
  status: z
    .enum(["Ativo", "Inativo", "Pendente"])
    .optional(),
  
  is_mentor: z.boolean().optional(),
  
  permission_group_id: z.string().uuid().nullable().optional()
});

// Schema para filtros de usuário
export const userFiltersSchema = z.object({
  search: z.string().max(255, "Busca deve ter no máximo 255 caracteres").default(""),
  status: z.enum(["all", "ativo", "inativo"]).default("all"),
  group: z.enum(["all", "pending", "assigned"]).default("all"),
  role: z.string().optional()
});

// Schema para redefinição de senha
export const resetPasswordSchema = z.object({
  password: passwordValidationSchema,
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Schema para upgrade de armazenamento
export const storageUpgradeSchema = z.object({
  targetUserId: z.string().uuid("ID de usuário inválido"),
  upgradeAmount: z
    .number()
    .min(100, "Upgrade mínimo é 100MB")
    .max(10000, "Upgrade máximo é 10GB")
    .multipleOf(100, "Upgrade deve ser múltiplo de 100MB"),
  notes: z.string().max(500, "Observações devem ter no máximo 500 caracteres").optional()
});

// Tipos derivados dos schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFiltersInput = z.infer<typeof userFiltersSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type StorageUpgradeInput = z.infer<typeof storageUpgradeSchema>;
