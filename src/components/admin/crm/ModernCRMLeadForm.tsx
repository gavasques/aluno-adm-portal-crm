import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { leadFormSchema, type LeadFormData } from '@/utils/crm-validation-schemas';
import { CRMLead, CRMLeadInput } from '@/types/crm.types';
import { X, Save, User, Building, Package, Target, MessageCircle, Tag } from 'lucide-react';
import ModernFloatingInput from './form-components/ModernFloatingInput';
import ModernFloatingTextarea from './form-components/ModernFloatingTextarea';
import ModernTagsSelector from './form-components/ModernTagsSelector';

interface ModernCRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const ModernCRMLeadForm = ({ pipelineId, initialColumnId, lead, onSuccess, onCancel, mode }: ModernCRMLeadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [responsibles, setResponsibles] = useState<Array<{id: string, name: string}>>([]);
  const { columns } = useCRMPipelines();
  const { updateLead, updateLeadTags } = useCRMLeadUpdate();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: lead?.name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      has_company: lead?.has_company || false,
      what_sells: lead?.what_sells || '',
      keep_or_new_niches: lead?.keep_or_new_niches || '',
      sells_on_amazon: lead?.sells_on_amazon || false,
      amazon_store_link: lead?.amazon_store_link || '',
      amazon_state: lead?.amazon_state || '',
      amazon_tax_regime: lead?.amazon_tax_regime || '',
      works_with_fba: lead?.works_with_fba || false,
      had_contact_with_lv: lead?.had_contact_with_lv || false,
      seeks_private_label: lead?.seeks_private_label || false,
      main_doubts: lead?.main_doubts || '',
      ready_to_invest_3k: lead?.ready_to_invest_3k || false,
      calendly_scheduled: lead?.calendly_scheduled || false,
      calendly_link: lead?.calendly_link || '',
      column_id: lead?.column_id || initialColumnId || '',
      responsible_id: lead?.responsible_id || '',
      notes: lead?.notes || '',
      tags: lead?.tags?.map(tag => tag.id) || [],
    }
  });

  const { watch, setValue } = form;

  useEffect(() => {
    const fetchResponsibles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', 'Admin')
          .order('name');

        if (error) throw error;
        setResponsibles(data || []);
      } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
      }
    };

    fetchResponsibles();
  }, []);

  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  useEffect(() => {
    if (pipelineColumns.length > 0 && !form.watch('column_id') && !initialColumnId && !lead) {
      const firstColumn = pipelineColumns.sort((a, b) => a.sort_order - b.sort_order)[0];
      setValue('column_id', firstColumn.id);
    }
  }, [pipelineColumns, setValue, form, initialColumnId, lead]);

  const createLead = async (leadData: CRMLeadInput) => {
    try {
      const insertData = {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        has_company: leadData.has_company,
        what_sells: leadData.what_sells,
        keep_or_new_niches: leadData.keep_or_new_niches,
        sells_on_amazon: leadData.sells_on_amazon,
        amazon_store_link: leadData.amazon_store_link,
        amazon_state: leadData.amazon_state,
        amazon_tax_regime: leadData.amazon_tax_regime,
        works_with_fba: leadData.works_with_fba,
        had_contact_with_lv: leadData.had_contact_with_lv,
        seeks_private_label: leadData.seeks_private_label,
        main_doubts: leadData.main_doubts,
        ready_to_invest_3k: leadData.ready_to_invest_3k,
        calendly_scheduled: leadData.calendly_scheduled,
        calendly_link: leadData.calendly_link,
        pipeline_id: leadData.pipeline_id,
        column_id: leadData.column_id,
        responsible_id: leadData.responsible_id,
        notes: leadData.notes
      };

      const { data, error } = await supabase
        .from('crm_leads')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      const columnId = data.column_id || initialColumnId || (pipelineColumns.length > 0 ? pipelineColumns[0].id : '');
      
      if (lead) {
        await updateLead(lead.id, {
          ...data,
          pipeline_id: pipelineId,
          column_id: columnId,
        });
        await updateLeadTags(lead.id, data.tags || []);
        toast.success('Lead atualizado com sucesso! ✨');
      } else {
        const newLead = await createLead({
          ...data,
          pipeline_id: pipelineId,
          column_id: columnId,
          name: data.name!,
          email: data.email!,
        });

        if (data.tags && data.tags.length > 0) {
          await updateLeadTags(newLead.id, data.tags);
        }
        
        toast.success('Lead criado com sucesso! 🎉');
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      toast.error('Erro ao salvar lead');
    } finally {
      setLoading(false);
    }
  };

  const formSections = [
    {
      id: 'basic',
      title: 'Informações Básicas',
      icon: User,
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'business',
      title: 'Negócio',
      icon: Building,
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'amazon',
      title: 'Amazon',
      icon: Package,
      color: 'from-orange-500/20 to-yellow-500/20'
    },
    {
      id: 'qualification',
      title: 'Qualificação',
      icon: Target,
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'tags',
      title: 'Tags',
      icon: Tag,
      color: 'from-indigo-500/20 to-purple-500/20'
    },
    {
      id: 'notes',
      title: 'Observações',
      icon: MessageCircle,
      color: 'from-slate-500/20 to-gray-500/20'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {mode === 'create' ? 'Novo Lead' : `Editar Lead`}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {mode === 'create' ? 'Adicione um novo lead ao pipeline' : 'Edite as informações do lead'}
            </p>
          </div>
        </motion.div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Content */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${formSections[0].color} backdrop-blur-sm border border-white/20`}
          >
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Informações Básicas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModernFloatingInput
                {...form.register('name')}
                label="Nome completo *"
                error={form.formState.errors.name?.message}
                required
              />
              <ModernFloatingInput
                {...form.register('email')}
                label="Email *"
                type="email"
                error={form.formState.errors.email?.message}
                required
              />
              <ModernFloatingInput
                {...form.register('phone')}
                label="Telefone"
                placeholder="(11) 99999-9999"
              />
            </div>
          </motion.div>

          {/* Negócio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${formSections[1].color} backdrop-blur-sm border border-white/20`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Negócio</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Switch
                  id="has_company"
                  checked={watch('has_company')}
                  onCheckedChange={(checked) => setValue('has_company', checked)}
                />
                <Label htmlFor="has_company" className="text-sm font-medium">Possui empresa</Label>
              </div>
              <ModernFloatingInput
                {...form.register('what_sells')}
                label="O que vende?"
                placeholder="Produtos/serviços"
              />
              <ModernFloatingInput
                {...form.register('keep_or_new_niches')}
                label="Manter ou novos nichos?"
                placeholder="Estratégia de nicho"
              />
            </div>
          </motion.div>

          {/* Amazon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${formSections[2].color} backdrop-blur-sm border border-white/20`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Amazon</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="sells_on_amazon"
                    checked={watch('sells_on_amazon')}
                    onCheckedChange={(checked) => setValue('sells_on_amazon', checked)}
                  />
                  <Label htmlFor="sells_on_amazon" className="text-sm font-medium">Vende na Amazon</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="works_with_fba"
                    checked={watch('works_with_fba')}
                    onCheckedChange={(checked) => setValue('works_with_fba', checked)}
                  />
                  <Label htmlFor="works_with_fba" className="text-sm font-medium">Trabalha com FBA</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="seeks_private_label"
                    checked={watch('seeks_private_label')}
                    onCheckedChange={(checked) => setValue('seeks_private_label', checked)}
                  />
                  <Label htmlFor="seeks_private_label" className="text-sm font-medium">Private Label</Label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernFloatingInput
                  {...form.register('amazon_store_link')}
                  label="Link da loja Amazon"
                  placeholder="https://amazon.com.br/..."
                />
                <ModernFloatingInput
                  {...form.register('amazon_state')}
                  label="Estado Amazon"
                  placeholder="Estado"
                />
              </div>
              <ModernFloatingInput
                {...form.register('amazon_tax_regime')}
                label="Regime tributário Amazon"
                placeholder="Regime tributário"
              />
            </div>
          </motion.div>

          {/* Qualificação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${formSections[3].color} backdrop-blur-sm border border-white/20`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Qualificação</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="had_contact_with_lv"
                    checked={watch('had_contact_with_lv')}
                    onCheckedChange={(checked) => setValue('had_contact_with_lv', checked)}
                  />
                  <Label htmlFor="had_contact_with_lv" className="text-sm font-medium">Contato com LV</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="ready_to_invest_3k"
                    checked={watch('ready_to_invest_3k')}
                    onCheckedChange={(checked) => setValue('ready_to_invest_3k', checked)}
                  />
                  <Label htmlFor="ready_to_invest_3k" className="text-sm font-medium">Investe R$ 3k</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="calendly_scheduled"
                    checked={watch('calendly_scheduled')}
                    onCheckedChange={(checked) => setValue('calendly_scheduled', checked)}
                  />
                  <Label htmlFor="calendly_scheduled" className="text-sm font-medium">Calendly agendado</Label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernFloatingTextarea
                  {...form.register('main_doubts')}
                  label="Principais dúvidas"
                  placeholder="Dúvidas e objeções do lead"
                  rows={3}
                />
                <ModernFloatingInput
                  {...form.register('calendly_link')}
                  label="Link do Calendly"
                  placeholder="https://calendly.com/..."
                />
              </div>
            </div>
          </motion.div>

          {/* Tags e Gestão */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${formSections[4].color} backdrop-blur-sm border border-white/20`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Tag className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Tags</h3>
              </div>
              <ModernTagsSelector
                selectedTags={watch('tags') || []}
                onTagsChange={(tags) => setValue('tags', tags)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20"
            >
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Gestão</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Coluna</Label>
                  <Select 
                    value={form.watch('column_id') || initialColumnId || ''}
                    onValueChange={(value) => setValue('column_id', value)}
                  >
                    <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/30">
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelineColumns
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((column) => (
                          <SelectItem key={column.id} value={column.id}>
                            {column.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Responsável</Label>
                  <Select onValueChange={(value) => setValue('responsible_id', value)} value={watch('responsible_id')}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/30">
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsibles.map((responsible) => (
                        <SelectItem key={responsible.id} value={responsible.id}>
                          {responsible.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Observações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${formSections[5].color} backdrop-blur-sm border border-white/20`}
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Observações</h3>
            </div>
            <ModernFloatingTextarea
              {...form.register('notes')}
              label="Observações gerais"
              placeholder="Observações adicionais sobre o lead"
              rows={4}
            />
          </motion.div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="bg-white/10 border-white/20 hover:bg-white/20 text-slate-700 dark:text-slate-300"
        >
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save className="h-4 w-4" />
              </motion.div>
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {lead ? 'Atualizar Lead' : 'Salvar Lead'}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ModernCRMLeadForm;
