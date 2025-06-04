
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Save, X } from 'lucide-react';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { toast } from 'sonner';

interface ManualFieldMappingDialogProps {
  pipelineId: string;
  trigger?: React.ReactNode;
}

const standardFields = [
  { key: 'has_company', name: 'Possui Empresa', type: 'boolean' },
  { key: 'sells_on_amazon', name: 'Vende na Amazon', type: 'boolean' },
  { key: 'what_sells', name: 'O que Vende', type: 'text' },
  { key: 'notes', name: 'Observações', type: 'text' },
  { key: 'amazon_store_link', name: 'Link da Loja Amazon', type: 'text' },
  { key: 'amazon_state', name: 'Estado Amazon', type: 'text' },
  { key: 'amazon_tax_regime', name: 'Regime Tributário Amazon', type: 'text' },
  { key: 'works_with_fba', name: 'Trabalha com FBA', type: 'boolean' },
  { key: 'ready_to_invest_3k', name: 'Pronto para Investir 3k', type: 'boolean' },
  { key: 'seeks_private_label', name: 'Busca Marca Própria', type: 'boolean' },
  { key: 'had_contact_with_lv', name: 'Teve Contato com LV', type: 'boolean' },
  { key: 'keep_or_new_niches', name: 'Manter ou Novos Nichos', type: 'text' },
  { key: 'main_doubts', name: 'Principais Dúvidas', type: 'text' },
  { key: 'calendly_scheduled', name: 'Calendly Agendado', type: 'boolean' },
  { key: 'calendly_link', name: 'Link do Calendly', type: 'text' },
];

export const ManualFieldMappingDialog = ({ pipelineId, trigger }: ManualFieldMappingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    webhookFieldName: '',
    crmFieldName: '',
    crmFieldType: 'standard' as 'standard' | 'custom',
    customFieldId: '',
    fieldType: 'text' as 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email',
    isRequired: false,
    isActive: true,
    transformationRules: '{}'
  });

  const { mappings, createMapping } = useCRMWebhookFieldMappings(pipelineId);
  const { customFields } = useCRMCustomFields(pipelineId);

  // Filtrar campos já mapeados
  const mappedStandardFields = mappings
    .filter(m => m.crm_field_type === 'standard')
    .map(m => m.crm_field_name);
  
  const mappedCustomFields = mappings
    .filter(m => m.crm_field_type === 'custom')
    .map(m => m.custom_field_id)
    .filter(Boolean);

  const availableStandardFields = standardFields.filter(
    field => !mappedStandardFields.includes(field.key)
  );

  const availableCustomFields = customFields.filter(
    field => !mappedCustomFields.includes(field.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.webhookFieldName || !formData.crmFieldName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se o campo do webhook já está mapeado
    if (mappings.some(m => m.webhook_field_name === formData.webhookFieldName)) {
      toast.error('Este campo do webhook já está mapeado');
      return;
    }

    try {
      await createMapping.mutateAsync({
        pipeline_id: pipelineId,
        webhook_field_name: formData.webhookFieldName,
        crm_field_name: formData.crmFieldName,
        crm_field_type: formData.crmFieldType,
        custom_field_id: formData.crmFieldType === 'custom' ? formData.customFieldId : undefined,
        field_type: formData.fieldType,
        is_required: formData.isRequired,
        is_active: formData.isActive,
        transformation_rules: JSON.parse(formData.transformationRules)
      });

      setOpen(false);
      setFormData({
        webhookFieldName: '',
        crmFieldName: '',
        crmFieldType: 'standard',
        customFieldId: '',
        fieldType: 'text',
        isRequired: false,
        isActive: true,
        transformationRules: '{}'
      });
    } catch (error) {
      console.error('Erro ao criar mapeamento:', error);
    }
  };

  const handleFieldSelection = (fieldKey: string) => {
    if (formData.crmFieldType === 'standard') {
      const field = standardFields.find(f => f.key === fieldKey);
      if (field) {
        setFormData(prev => ({
          ...prev,
          crmFieldName: field.key,
          fieldType: field.type as any
        }));
      }
    } else {
      const field = customFields.find(f => f.id === fieldKey);
      if (field) {
        setFormData(prev => ({
          ...prev,
          crmFieldName: field.field_key,
          customFieldId: field.id,
          fieldType: field.field_type
        }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Mapeamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Mapear Novo Campo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookField">Campo do Webhook *</Label>
            <Input
              id="webhookField"
              value={formData.webhookFieldName}
              onChange={(e) => setFormData(prev => ({ ...prev, webhookFieldName: e.target.value }))}
              placeholder="ex: customer_name, user_email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Campo do CRM</Label>
            <Select
              value={formData.crmFieldType}
              onValueChange={(value: 'standard' | 'custom') => 
                setFormData(prev => ({ 
                  ...prev, 
                  crmFieldType: value,
                  crmFieldName: '',
                  customFieldId: ''
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Campo Padrão</SelectItem>
                <SelectItem value="custom">Campo Customizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Campo do CRM *</Label>
            <Select
              value={formData.crmFieldType === 'standard' ? formData.crmFieldName : formData.customFieldId}
              onValueChange={handleFieldSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um campo" />
              </SelectTrigger>
              <SelectContent>
                {formData.crmFieldType === 'standard' ? (
                  <>
                    {availableStandardFields.length === 0 ? (
                      <SelectItem value="none" disabled>Todos os campos padrão já estão mapeados</SelectItem>
                    ) : (
                      availableStandardFields.map(field => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.name} ({field.type})
                        </SelectItem>
                      ))
                    )}
                  </>
                ) : (
                  <>
                    {availableCustomFields.length === 0 ? (
                      <SelectItem value="none" disabled>Todos os campos customizados já estão mapeados</SelectItem>
                    ) : (
                      availableCustomFields.map(field => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.field_name} ({field.field_type})
                        </SelectItem>
                      ))
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
            />
            <Label htmlFor="required">Campo obrigatório</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="active">Campo ativo</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transformationRules">Regras de Transformação (JSON)</Label>
            <Textarea
              id="transformationRules"
              value={formData.transformationRules}
              onChange={(e) => setFormData(prev => ({ ...prev, transformationRules: e.target.value }))}
              placeholder='{"default": "valor_padrao"}'
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={createMapping.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createMapping.isPending ? 'Salvando...' : 'Salvar Mapeamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
