
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
import { useCRMLeads } from '@/hooks/crm/useCRMLeads';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { leadFormSchema, type LeadFormData } from '@/utils/crm-validation-schemas';
import CRMTagsSelector from './CRMTagsSelector';

interface CRMLeadFormProps {
  pipelineId: string;
  initialColumnId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CRMLeadForm = ({ pipelineId, initialColumnId, onSuccess, onCancel }: CRMLeadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [responsibles, setResponsibles] = useState<Array<{id: string, name: string}>>([]);
  const { createLead } = useCRMLeads();
  const { columns } = useCRMPipelines();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      has_company: false,
      sells_on_amazon: false,
      works_with_fba: false,
      had_contact_with_lv: false,
      seeks_private_label: false,
      ready_to_invest_3k: false,
      calendly_scheduled: false,
      column_id: initialColumnId || '',
      tags: [],
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
    if (pipelineColumns.length > 0 && !form.watch('column_id') && !initialColumnId) {
      const firstColumn = pipelineColumns.sort((a, b) => a.sort_order - b.sort_order)[0];
      setValue('column_id', firstColumn.id);
    }
  }, [pipelineColumns, setValue, form, initialColumnId]);

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      // Garantir que column_id está definido
      const columnId = data.column_id || initialColumnId || (pipelineColumns.length > 0 ? pipelineColumns[0].id : '');
      
      await createLead({
        ...data,
        pipeline_id: pipelineId,
        column_id: columnId,
        name: data.name!,
        email: data.email!,
      });
      toast.success('Lead criado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast.error('Erro ao criar lead');
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

          <div className="space-y-2">
            <Label htmlFor="scheduled_contact_date">Data de Contato</Label>
            <Input
              id="scheduled_contact_date"
              type="datetime-local"
              {...form.register('scheduled_contact_date')}
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
                <Select onValueChange={(value) => setValue('keep_or_new_niches', value)}>
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
                <Select onValueChange={(value) => setValue('amazon_tax_regime', value)}>
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
            <Select onValueChange={(value) => setValue('responsible_id', value)}>
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
          {loading ? 'Salvando...' : 'Salvar Lead'}
        </Button>
      </div>
    </form>
  );
};

export default CRMLeadForm;
