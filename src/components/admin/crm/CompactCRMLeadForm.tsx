
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { useOptimizedCRMTags } from '@/hooks/crm/useOptimizedCRMTags';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { leadFormSchema, type LeadFormData } from '@/utils/crm-validation-schemas';
import { CRMLead, CRMLeadInput } from '@/types/crm.types';
import { X, Save, User, Building, Package } from 'lucide-react';
import ModernTagsSelector from './form-components/ModernTagsSelector';
import OptimizedTagsSelector from './form-components/OptimizedTagsSelector';

interface CompactCRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const CompactCRMLeadForm = ({ pipelineId, initialColumnId, lead, onSuccess, onCancel, mode }: CompactCRMLeadFormProps) => {
  console.log('🎯 CompactCRMLeadForm: Renderizando formulário compacto!', { mode, pipelineId });
  
  const [loading, setLoading] = useState(false);
  const [responsibles, setResponsibles] = useState<Array<{id: string, name: string}>>([]);
  const { columns } = useCRMPipelines();
  const { updateLead } = useCRMLeadUpdate();
  const { updateLeadTags } = useOptimizedCRMTags();

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
        toast.success('Lead atualizado com sucesso!');
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
        
        toast.success('Lead criado com sucesso!');
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      toast.error('Erro ao salvar lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header compacto */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'create' ? 'Novo Lead' : 'Editar Lead'}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === 'create' ? 'Adicione um novo lead ao pipeline' : 'Edite as informações do lead'}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Content compacto */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Informações Básicas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-medium">Nome *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    className="h-8 text-sm"
                    placeholder="Nome completo"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    className="h-8 text-sm"
                    placeholder="email@exemplo.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs font-medium">Telefone</Label>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    className="h-8 text-sm"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Negócio e Amazon em uma linha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Negócio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="has_company" className="text-xs font-medium">Possui empresa</Label>
                  <Switch
                    id="has_company"
                    checked={watch('has_company')}
                    onCheckedChange={(checked) => setValue('has_company', checked)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="what_sells" className="text-xs font-medium">O que vende?</Label>
                  <Input
                    id="what_sells"
                    {...form.register('what_sells')}
                    className="h-8 text-sm"
                    placeholder="Produtos/serviços"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Amazon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sells_on_amazon" className="text-xs font-medium">Vende na Amazon</Label>
                    <Switch
                      id="sells_on_amazon"
                      checked={watch('sells_on_amazon')}
                      onCheckedChange={(checked) => setValue('sells_on_amazon', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="works_with_fba" className="text-xs font-medium">Trabalha com FBA</Label>
                    <Switch
                      id="works_with_fba"
                      checked={watch('works_with_fba')}
                      onCheckedChange={(checked) => setValue('works_with_fba', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="amazon_store_link" className="text-xs font-medium">Link da loja</Label>
                  <Input
                    id="amazon_store_link"
                    {...form.register('amazon_store_link')}
                    className="h-8 text-sm"
                    placeholder="https://amazon.com.br/..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Qualificação e Gestão */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Qualificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ready_to_invest_3k" className="text-xs font-medium">Investe R$ 3k</Label>
                    <Switch
                      id="ready_to_invest_3k"
                      checked={watch('ready_to_invest_3k')}
                      onCheckedChange={(checked) => setValue('ready_to_invest_3k', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="calendly_scheduled" className="text-xs font-medium">Calendly agendado</Label>
                    <Switch
                      id="calendly_scheduled"
                      checked={watch('calendly_scheduled')}
                      onCheckedChange={(checked) => setValue('calendly_scheduled', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="main_doubts" className="text-xs font-medium">Principais dúvidas</Label>
                  <Textarea
                    id="main_doubts"
                    {...form.register('main_doubts')}
                    className="h-16 text-sm resize-none"
                    placeholder="Dúvidas e objeções do lead"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Gestão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Coluna</Label>
                  <Select 
                    value={form.watch('column_id') || initialColumnId || ''}
                    onValueChange={(value) => setValue('column_id', value)}
                  >
                    <SelectTrigger className="h-8">
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

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Responsável</Label>
                  <Select onValueChange={(value) => setValue('responsible_id', value)} value={watch('responsible_id')}>
                    <SelectTrigger className="h-8">
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

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Tags</Label>
                  <OptimizedTagsSelector
                    selectedTags={watch('tags') || []}
                    onTagsChange={(tags) => setValue('tags', tags)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Observações */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs font-medium">Observações gerais</Label>
                <Textarea
                  id="notes"
                  {...form.register('notes')}
                  className="h-16 text-sm resize-none"
                  placeholder="Observações adicionais sobre o lead"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Footer compacto */}
      <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="h-8 px-4 text-sm"
        >
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={loading}
          className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save className="h-3 w-3" />
              </motion.div>
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-3 w-3" />
              {lead ? 'Atualizar' : 'Salvar'}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CompactCRMLeadForm;
