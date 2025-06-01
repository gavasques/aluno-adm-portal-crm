
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { leadFormSchema, type LeadFormData } from '@/utils/crm-validation-schemas';
import { CRMLead, CRMLeadInput } from '@/types/crm.types';
import SimpleCRMTagsSelector from './SimpleCRMTagsSelector';

interface CompactCRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CompactCRMLeadForm = ({ pipelineId, initialColumnId, lead, onSuccess, onCancel }: CompactCRMLeadFormProps) => {
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

  // Buscar responsáveis
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

  // Filtrar colunas do pipeline atual
  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  // Selecionar primeira coluna por padrão
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
    <div className="h-full flex flex-col">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {/* Informações Básicas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs">Nome *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Nome completo"
                    className="h-8"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="email@exemplo.com"
                    className="h-8"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs">Telefone</Label>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="(11) 99999-9999"
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Negócio e Amazon */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Negócio e Amazon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_company"
                    checked={watch('has_company')}
                    onCheckedChange={(checked) => setValue('has_company', checked)}
                  />
                  <Label htmlFor="has_company" className="text-xs">Tem empresa</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sells_on_amazon"
                    checked={watch('sells_on_amazon')}
                    onCheckedChange={(checked) => setValue('sells_on_amazon', checked)}
                  />
                  <Label htmlFor="sells_on_amazon" className="text-xs">Vende na Amazon</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="works_with_fba"
                    checked={watch('works_with_fba')}
                    onCheckedChange={(checked) => setValue('works_with_fba', checked)}
                  />
                  <Label htmlFor="works_with_fba" className="text-xs">Trabalha com FBA</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="seeks_private_label"
                    checked={watch('seeks_private_label')}
                    onCheckedChange={(checked) => setValue('seeks_private_label', checked)}
                  />
                  <Label htmlFor="seeks_private_label" className="text-xs">Private Label</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="what_sells" className="text-xs">O que vende?</Label>
                  <Input
                    id="what_sells"
                    {...form.register('what_sells')}
                    placeholder="Produtos/serviços"
                    className="h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="amazon_store_link" className="text-xs">Link da loja Amazon</Label>
                  <Input
                    id="amazon_store_link"
                    {...form.register('amazon_store_link')}
                    placeholder="https://amazon.com.br/..."
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qualificação */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Qualificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="had_contact_with_lv"
                    checked={watch('had_contact_with_lv')}
                    onCheckedChange={(checked) => setValue('had_contact_with_lv', checked)}
                  />
                  <Label htmlFor="had_contact_with_lv" className="text-xs">Contato com LV</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ready_to_invest_3k"
                    checked={watch('ready_to_invest_3k')}
                    onCheckedChange={(checked) => setValue('ready_to_invest_3k', checked)}
                  />
                  <Label htmlFor="ready_to_invest_3k" className="text-xs">Investe R$ 3k</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="calendly_scheduled"
                    checked={watch('calendly_scheduled')}
                    onCheckedChange={(checked) => setValue('calendly_scheduled', checked)}
                  />
                  <Label htmlFor="calendly_scheduled" className="text-xs">Calendly</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="main_doubts" className="text-xs">Principais dúvidas</Label>
                  <Textarea
                    id="main_doubts"
                    {...form.register('main_doubts')}
                    placeholder="Dúvidas e objeções"
                    rows={2}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="calendly_link" className="text-xs">Link do Calendly</Label>
                  <Input
                    id="calendly_link"
                    {...form.register('calendly_link')}
                    placeholder="https://calendly.com/..."
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags e Gestão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleCRMTagsSelector
                  selectedTags={watch('tags') || []}
                  onTagsChange={(tags) => setValue('tags', tags)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gestão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="column_id" className="text-xs">Coluna</Label>
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
                  <Label htmlFor="responsible_id" className="text-xs">Responsável</Label>
                  <Select onValueChange={(value) => setValue('responsible_id', value)} value={watch('responsible_id')}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Selecione" />
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
              </CardContent>
            </Card>
          </div>

          {/* Observações */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs">Observações gerais</Label>
                <Textarea
                  id="notes"
                  {...form.register('notes')}
                  placeholder="Observações adicionais sobre o lead"
                  rows={3}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Ações fixas na parte inferior */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={loading}
        >
          {loading ? 'Salvando...' : lead ? 'Atualizar Lead' : 'Salvar Lead'}
        </Button>
      </div>
    </div>
  );
};

export default CompactCRMLeadForm;
