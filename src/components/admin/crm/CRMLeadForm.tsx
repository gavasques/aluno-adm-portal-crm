
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
import { Calendar, User, Building2, Globe, DollarSign, Tags } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { leadFormSchema, type LeadFormData } from '@/utils/crm-validation-schemas';
import { CRMLead, CRMLeadInput } from '@/types/crm.types';
import CRMTagsSelector from './CRMTagsSelector';

interface CRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  lead?: CRMLead | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CRMLeadForm = ({ pipelineId, initialColumnId, lead, onSuccess, onCancel }: CRMLeadFormProps) => {
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
  const sellsOnAmazon = watch('sells_on_amazon');
  const hasCompany = watch('has_company');

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

  // Selecionar primeira coluna por padrão se não tiver coluna inicial
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
      // Garantir que column_id está definido
      const columnId = data.column_id || initialColumnId || (pipelineColumns.length > 0 ? pipelineColumns[0].id : '');
      
      if (lead) {
        // Atualizar lead existente
        await updateLead(lead.id, {
          ...data,
          pipeline_id: pipelineId,
          column_id: columnId,
        });
        await updateLeadTags(lead.id, data.tags || []);
        toast.success('Lead atualizado com sucesso!');
      } else {
        // Criar novo lead
        const newLead = await createLead({
          ...data,
          pipeline_id: pipelineId,
          column_id: columnId,
          name: data.name!,
          email: data.email!,
        });

        // Adicionar tags se houver
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nome completo do lead"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="email@exemplo.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="(11) 99999-9999"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="has_company"
              checked={hasCompany}
              onCheckedChange={(checked) => setValue('has_company', checked)}
            />
            <Label htmlFor="has_company">Possui empresa</Label>
          </div>

          {hasCompany && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="what_sells">O que vende?</Label>
                <Input
                  id="what_sells"
                  {...form.register('what_sells')}
                  placeholder="Produtos/serviços que comercializa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keep_or_new_niches">Manter ou novos nichos?</Label>
                <Select onValueChange={(value) => setValue('keep_or_new_niches', value)} value={watch('keep_or_new_niches')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manter">Manter nichos atuais</SelectItem>
                    <SelectItem value="novos">Explorar novos nichos</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Amazon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-orange-500" />
            Amazon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="sells_on_amazon"
              checked={sellsOnAmazon}
              onCheckedChange={(checked) => setValue('sells_on_amazon', checked)}
            />
            <Label htmlFor="sells_on_amazon">Vende na Amazon</Label>
          </div>

          {sellsOnAmazon && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amazon_store_link">Link da loja na Amazon</Label>
                <Input
                  id="amazon_store_link"
                  {...form.register('amazon_store_link')}
                  placeholder="https://amazon.com.br/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amazon_state">Estado na Amazon</Label>
                <Input
                  id="amazon_state"
                  {...form.register('amazon_state')}
                  placeholder="SP, RJ, MG..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amazon_tax_regime">Regime tributário</Label>
                <Select onValueChange={(value) => setValue('amazon_tax_regime', value)} value={watch('amazon_tax_regime')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples Nacional</SelectItem>
                    <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="lucro_real">Lucro Real</SelectItem>
                    <SelectItem value="mei">MEI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="works_with_fba"
                  checked={watch('works_with_fba')}
                  onCheckedChange={(checked) => setValue('works_with_fba', checked)}
                />
                <Label htmlFor="works_with_fba">Trabalha com FBA</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Qualificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-500" />
            Qualificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="had_contact_with_lv"
                checked={watch('had_contact_with_lv')}
                onCheckedChange={(checked) => setValue('had_contact_with_lv', checked)}
              />
              <Label htmlFor="had_contact_with_lv">Já teve contato com LV</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="seeks_private_label"
                checked={watch('seeks_private_label')}
                onCheckedChange={(checked) => setValue('seeks_private_label', checked)}
              />
              <Label htmlFor="seeks_private_label">Busca private label</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ready_to_invest_3k"
                checked={watch('ready_to_invest_3k')}
                onCheckedChange={(checked) => setValue('ready_to_invest_3k', checked)}
              />
              <Label htmlFor="ready_to_invest_3k">Pronto para investir R$ 3k</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="calendly_scheduled"
                checked={watch('calendly_scheduled')}
                onCheckedChange={(checked) => setValue('calendly_scheduled', checked)}
              />
              <Label htmlFor="calendly_scheduled">Agendamento via Calendly</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendly_link">Link do Calendly</Label>
            <Input
              id="calendly_link"
              {...form.register('calendly_link')}
              placeholder="https://calendly.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="main_doubts">Principais dúvidas</Label>
            <Textarea
              id="main_doubts"
              {...form.register('main_doubts')}
              placeholder="Descreva as principais dúvidas e objeções do lead"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tags className="h-5 w-5 text-purple-500" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CRMTagsSelector
            selectedTags={watch('tags') || []}
            onTagsChange={(tags) => setValue('tags', tags)}
          />
        </CardContent>
      </Card>

      {/* Gestão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Gestão
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="column_id">Coluna inicial</Label>
            <Select 
              value={form.watch('column_id') || initialColumnId || ''}
              onValueChange={(value) => setValue('column_id', value)}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="responsible_id">Responsável</Label>
            <Select onValueChange={(value) => setValue('responsible_id', value)} value={watch('responsible_id')}>
              <SelectTrigger>
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

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Observações adicionais sobre o lead"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : lead ? 'Atualizar Lead' : 'Salvar Lead'}
        </Button>
      </div>
    </form>
  );
};

export default CRMLeadForm;
