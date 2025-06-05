import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X } from 'lucide-react';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMWebhookFieldMapping } from '@/types/crm-webhook.types';
import { toast } from 'sonner';

interface EditFieldMappingDialogProps {
  mapping: CRMWebhookFieldMapping;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const standardFields = [
  { key: 'name', name: 'Nome', type: 'text' },
  { key: 'email', name: 'Email', type: 'email' },
  { key: 'phone', name: 'Telefone', type: 'phone' },
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

export const EditFieldMappingDialog = ({ mapping, open, onOpenChange, trigger }: EditFieldMappingDialogProps) => {
  const [formData, setFormData] = useState({
    webhookFieldName: mapping.webhook_field_name,
    crmFieldName: mapping.crm_field_name,
    crmFieldType: mapping.crm_field_type,
    customFieldId: mapping.custom_field_id || '',
    fieldType: mapping.field_type,
    isRequired: mapping.is_required,
    isActive: mapping.is_active,
    transformationRules: JSON.stringify(mapping.transformation_rules || {}, null, 2)
  });

  const { mappings, updateMapping } = useCRMWebhookFieldMappings(mapping.pipeline_id);
  const { customFields } = useCRMCustomFields(mapping.pipeline_id);

  // Reset form when mapping changes
  useEffect(() => {
    setFormData({
      webhookFieldName: mapping.webhook_field_name,
      crmFieldName: mapping.crm_field_name,
      crmFieldType: mapping.crm_field_type,
      customFieldId: mapping.custom_field_id || '',
      fieldType: mapping.field_type,
      isRequired: mapping.is_required,
      isActive: mapping.is_active,
      transformationRules: JSON.stringify(mapping.transformation_rules || {}, null, 2)
    });
  }, [mapping]);

  // Filtrar campos já mapeados (exceto o atual)
  const mappedStandardFields = mappings
    .filter(m => m.id !== mapping.id && m.crm_field_type === 'standard')
    .map(m => m.crm_field_name);
  
  const mappedCustomFields = mappings
    .filter(m => m.id !== mapping.id && m.crm_field_type === 'custom')
    .map(m => m.custom_field_id)
    .filter(Boolean);

  const availableStandardFields = standardFields.filter(
    field => !mappedStandardFields.includes(field.key) || field.key === mapping.crm_field_name
  );

  const availableCustomFields = customFields.filter(
    field => !mappedCustomFields.includes(field.id) || field.id === mapping.custom_field_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.webhookFieldName || !formData.crmFieldName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se o campo do webhook já está mapeado por outro mapeamento
    const duplicateWebhookField = mappings.find(m => 
      m.id !== mapping.id && m.webhook_field_name === formData.webhookFieldName
    );
    
    if (duplicateWebhookField) {
      toast.error('Este campo do webhook já está mapeado');
      return;
    }

    try {
      await updateMapping.mutateAsync({
        id: mapping.id,
        input: {
          webhook_field_name: formData.webhookFieldName,
          crm_field_name: formData.crmFieldName,
          crm_field_type: formData.crmFieldType,
          custom_field_id: formData.crmFieldType === 'custom' ? formData.customFieldId : undefined,
          field_type: formData.fieldType,
          is_required: formData.isRequired,
          is_active: formData.isActive,
          transformation_rules: JSON.parse(formData.transformationRules)
        }
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar mapeamento:', error);
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

  const isNameField = mapping.crm_field_name === 'name';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Mapeamento de Campo</DialogTitle>
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
                  availableStandardFields.map(field => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.name} ({field.type})
                    </SelectItem>
                  ))
                ) : (
                  availableCustomFields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.field_name} ({field.field_type})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
              disabled={isNameField} // Nome sempre obrigatório
            />
            <Label htmlFor="required">
              Campo obrigatório
              {isNameField && <span className="text-xs text-muted-foreground ml-1">(sempre obrigatório)</span>}
            </Label>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMapping.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMapping.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
