
import { z } from 'zod';

// Schema para criação de catálogo de mentoria
export const createMentoringCatalogSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  type: z.enum(['Individual', 'Grupo'], {
    errorMap: () => ({ message: 'Tipo deve ser Individual ou Grupo' })
  }),
  instructor: z.string().min(1, 'Instrutor é obrigatório').max(50, 'Nome do instrutor muito longo'),
  durationWeeks: z.number().min(1, 'Duração deve ser pelo menos 1 semana').max(52, 'Duração não pode exceder 52 semanas'),
  numberOfSessions: z.number().min(1, 'Deve ter pelo menos 1 sessão').max(100, 'Muitas sessões'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  description: z.string().min(10, 'Descrição muito curta').max(500, 'Descrição muito longa'),
  active: z.boolean().optional().default(true)
});

// Schema para criação de sessão
export const createSessionSchema = z.object({
  enrollmentId: z.string().uuid('ID de matrícula inválido'),
  type: z.enum(['individual', 'grupo'], {
    errorMap: () => ({ message: 'Tipo deve ser individual ou grupo' })
  }),
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  scheduledDate: z.string().datetime('Data inválida'),
  durationMinutes: z.number().min(15, 'Duração mínima de 15 minutos').max(480, 'Duração máxima de 8 horas'),
  accessLink: z.string().url('Link inválido').optional()
});

// Schema para extensão
export const createExtensionSchema = z.object({
  enrollmentId: z.string().uuid('ID de matrícula inválido'),
  extensionMonths: z.number().min(1, 'Extensão mínima de 1 mês').max(12, 'Extensão máxima de 12 meses'),
  notes: z.string().max(200, 'Notas muito longas').optional()
});

// Schema para filtros
export const mentoringFiltersSchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  instructor: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }).optional()
}).partial();

// Tipos derivados dos schemas
export type CreateMentoringCatalogData = z.infer<typeof createMentoringCatalogSchema>;
export type CreateSessionData = z.infer<typeof createSessionSchema>;
export type CreateExtensionData = z.infer<typeof createExtensionSchema>;
export type MentoringFiltersData = z.infer<typeof mentoringFiltersSchema>;

// Função utilitária para validação corrigida
export const validateMentoringData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
};
