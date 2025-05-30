
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { useCRMLeads } from '@/hooks/crm/useCRMLeads';
import { leadFormSchema, type LeadFormData } from '@/utils/crm-validation-schemas';
import { toast } from 'sonner';

interface LeadDataTabProps {
  lead: CRMLead;
  onUpdate?: () => void;
}

const LeadDataTab = ({ lead, onUpdate }: LeadDataTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateLead } = useCRMLeads();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      has_company: lead.has_company,
      what_sells: lead.what_sells || '',
      keep_or_new_niches: lead.keep_or_new_niches || '',
      sells_on_amazon: lead.sells_on_amazon,
      amazon_store_link: lead.amazon_store_link || '',
      amazon_state: lead.amazon_state || '',
      amazon_tax_regime: lead.amazon_tax_regime || '',
      works_with_fba: lead.works_with_fba,
      had_contact_with_lv: lead.had_contact_with_lv,
      seeks_private_label: lead.seeks_private_label,
      main_doubts: lead.main_doubts || '',
      ready_to_invest_3k: lead.ready_to_invest_3k,
      calendly_scheduled: lead.calendly_scheduled,
      calendly_link: lead.calendly_link || '',
      scheduled_contact_date: lead.scheduled_contact_date || '',
      notes: lead.notes || '',
    }
  });

  const { watch, setValue } = form;
  const sellsOnAmazon = watch('sells_on_amazon');
  const hasCompany = watch('has_company');

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      await updateLead(lead.id, data);
      toast.success('Lead atualizado com sucesso!');
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast.error('Erro ao atualizar lead');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Informações do Lead</h3>
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Nome</Label>
                <p className="mt-1">{lead.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="mt-1">{lead.email}</p>
              </div>
              {lead.phone && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                  <p className="mt-1">{lead.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Possui empresa</Label>
                <p className="mt-1">{lead.has_company ? 'Sim' : 'Não'}</p>
              </div>
              {lead.has_company && lead.what_sells && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">O que vende</Label>
                  <p className="mt-1">{lead.what_sells}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {lead.sells_on_amazon && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Amazon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vende na Amazon</Label>
                  <p className="mt-1">Sim</p>
                </div>
                {lead.amazon_state && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Estado</Label>
                    <p className="mt-1">{lead.amazon_state}</p>
                  </div>
                )}
                {lead.amazon_tax_regime && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Regime Tributário</Label>
                    <p className="mt-1">{lead.amazon_tax_regime}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Qualificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Pronto para investir R$ 3k</Label>
                <p className="mt-1">{lead.ready_to_invest_3k ? 'Sim' : 'Não'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Busca private label</Label>
                <p className="mt-1">{lead.seeks_private_label ? 'Sim' : 'Não'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {lead.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{lead.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Editando Lead</h3>
          <div className="flex gap-2">
            <Button type="button" onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="has_company"
              checked={hasCompany}
              onCheckedChange={(checked) => setValue('has_company', checked)}
            />
            <Label htmlFor="has_company">Possui empresa</Label>
          </div>

          {hasCompany && (
            <div className="space-y-2">
              <Label htmlFor="what_sells">O que vende?</Label>
              <Input
                id="what_sells"
                {...form.register('what_sells')}
                placeholder="Produtos/serviços que comercializa"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
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
            </div>
          )}
        </div>

        <div className="space-y-4">
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
              id="seeks_private_label"
              checked={watch('seeks_private_label')}
              onCheckedChange={(checked) => setValue('seeks_private_label', checked)}
            />
            <Label htmlFor="seeks_private_label">Busca private label</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            placeholder="Observações adicionais sobre o lead"
            rows={4}
          />
        </div>
      </form>
    </div>
  );
};

export default LeadDataTab;
