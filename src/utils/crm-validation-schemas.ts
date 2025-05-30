
import * as z from 'zod';

export const leadFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  has_company: z.boolean().default(false),
  what_sells: z.string().optional(),
  keep_or_new_niches: z.string().optional(),
  sells_on_amazon: z.boolean().default(false),
  amazon_store_link: z.string().url('Link inválido').optional().or(z.literal('')),
  amazon_state: z.string().optional(),
  amazon_tax_regime: z.enum(['simples', 'lucro_presumido', 'lucro_real', 'mei']).optional(),
  works_with_fba: z.boolean().default(false),
  had_contact_with_lv: z.boolean().default(false),
  seeks_private_label: z.boolean().default(false),
  main_doubts: z.string().optional(),
  ready_to_invest_3k: z.boolean().default(false),
  calendly_scheduled: z.boolean().default(false),
  calendly_link: z.string().url('Link do Calendly inválido').optional().or(z.literal('')),
  column_id: z.string().optional(),
  responsible_id: z.string().optional(),
  scheduled_contact_date: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Se vende na Amazon, alguns campos se tornam obrigatórios
  if (data.sells_on_amazon) {
    return data.amazon_state && data.amazon_tax_regime;
  }
  return true;
}, {
  message: 'Quando vende na Amazon, estado e regime tributário são obrigatórios',
  path: ['amazon_state']
}).refine((data) => {
  // Se tem empresa, o campo "o que vende" se torna obrigatório
  if (data.has_company) {
    return data.what_sells && data.what_sells.trim().length > 0;
  }
  return true;
}, {
  message: 'Quando possui empresa, o campo "O que vende" é obrigatório',
  path: ['what_sells']
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
