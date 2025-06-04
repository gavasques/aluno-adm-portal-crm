
import * as z from 'zod';

export const leadFormSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  phone: z.string()
    .max(20, 'Telefone muito longo')
    .optional(),
  has_company: z.boolean().default(false),
  what_sells: z.string()
    .max(500, 'Descrição muito longa')
    .optional(),
  keep_or_new_niches: z.string()
    .max(500, 'Descrição muito longa')
    .optional(),
  sells_on_amazon: z.boolean().default(false),
  amazon_store_link: z.string()
    .url('Link inválido')
    .max(500, 'Link muito longo')
    .optional()
    .or(z.literal('')),
  amazon_state: z.string()
    .max(50, 'Estado muito longo')
    .optional(),
  amazon_tax_regime: z.string()
    .max(50, 'Regime tributário muito longo')
    .optional(),
  works_with_fba: z.boolean().default(false),
  had_contact_with_lv: z.boolean().default(false),
  seeks_private_label: z.boolean().default(false),
  main_doubts: z.string()
    .max(1000, 'Dúvidas muito longas')
    .optional(),
  ready_to_invest_3k: z.boolean().default(false),
  calendly_scheduled: z.boolean().default(false),
  calendly_link: z.string()
    .url('Link do Calendly inválido')
    .max(500, 'Link muito longo')
    .optional()
    .or(z.literal('')),
  column_id: z.string()
    .min(1, 'Coluna é obrigatória'),
  responsible_id: z.string().optional(),
  scheduled_contact_date: z.string().optional(),
  notes: z.string()
    .max(2000, 'Observações muito longas')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
