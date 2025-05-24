
import * as z from "zod";
import { validatePassword } from "./security";

// Schema de senha com validação robusta
export const passwordSchema = z
  .string()
  .min(1, "Senha é obrigatória")
  .refine((password) => {
    const validation = validatePassword(password);
    return validation.isValid;
  }, {
    message: "Senha não atende aos critérios de segurança"
  });

// Schema para validação detalhada de senha (com mensagens específicas)
export const detailedPasswordSchema = z
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

// Schema para formulário de usuário
export const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.string({ required_error: "Selecione um papel" }),
  password: passwordSchema, // Agora obrigatória e com validação robusta
});

// Schema para redefinição de senha
export const passwordResetSchema = z.object({
  password: detailedPasswordSchema,
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Schema para configurações de perfil
export const profileSettingsSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
});

// Schema para alteração de senha
export const changePasswordSchema = z.object({
  password: detailedPasswordSchema,
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
