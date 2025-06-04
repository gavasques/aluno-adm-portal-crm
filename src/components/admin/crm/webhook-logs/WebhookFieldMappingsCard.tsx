
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, Edit3, Trash2, Sync } from 'lucide-react';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMWebhookFieldMapping, CRMWebhookFieldMappingInput } from '@/types/crm-webhook.types';

interface WebhookFieldMappingsCardProps {
  pipelineId: string;
  pipelineName: string;
}

export const WebhookFieldMappingsCard: React.FC<WebhookFieldMappingsCardProps> = ({
  pipelineId,
  pipelineName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<CRMWebhookFieldMapping | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CRMWebhookFieldMappingInput>>({
    pipeline_id: pipelineId,
    crm_field_type: 'standard',
    field_type: 'text',
    is_required: false,
    is_active: true
  });

  const { mappings, createMapping, updateMapping, deleteMapping, syncStandardMappings } = useCRMWebhookFieldMappings(pipelineId);
  const { customFields } = useCRMCustomFields(pipelineId);

  const standardFields = [
    { key: 'name', label: 'Nome', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Telefone', type: 'phone' },
    { key: 'has_company', label: 'Tem Empresa', type: 'boolean' },
    { key: 'sells_on_amazon', label: 'Vende na Amazon', type: 'boolean' },
    { key: 'works_with_fba', label: 'Trabalha com FBA', type: 'boolean' },
    { key: 'ready_to_invest_3k', label: 'Pronto para Investir 3k', type: 'boolean' },
    { key: 'seeks_private_label', label: 'Busca Private Label', type: 'boolean' },
    { key: 'what_sells', label: 'O que Vende', type: 'text' },
    { key: 'main_doubts', label: 'Principais Dúvidas', type: 'text' },
    { key: 'notes', label: 'Observações', type: 'text' }
  ];

  const handleSubmit = async () => {
    if (!formData.webhook_field_name || !formData.crm_field_name || !formData.field_type) return;

    try {
      if (editingMapping) {
        await updateMapping.mutateAsync({ 
          id: editingMapping.id, 
          input: formData as CRMWebhookFieldMappingInput 
        });
      } else {
        await createMapping.mutateAsync(formData as CRMWebhookFieldMappingInput);
      }
      
      setIsFormOpen(false);
      setEditingMapping(null);
      setFormData({
        pipeline_id: pipelineId,
        crm_field_type: 'standard',
        field_type: 'text',
        is_required: false,
        is_active: true
      });
    } catch (error) {
      console.error('Erro ao salvar mapeamento:', error);
    }
  };

  const handleEdit = (mapping: CRMWebhookFieldMapping) => {
    setEditingMapping(mapping);
    setFormData({
      pipeline_id: mapping.pipeline_id,
      webhook_field_name: mapping.webhook_field_name,
      crm_field_name: mapping.crm_field_name,
      crm_field_type: mapping.crm_field_type,
      custom_field_id: mapping.custom_field_id,
      field_type: mapping.field_type,
      is_required: mapping.is_required,
      is_active: mapping.is_active,
      transformation_rules: mapping.transformation_rules
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este mapeamento?')) {
      await deleteMapping.mutateAsync(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          Mapeamentos
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mapeamentos de Campos - {pipelineName}</DialogTitle>
          <DialogDescription>
            Configure como os campos do webhook serão mapeados para os campos do CRM
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Header com ações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {mappings.length} mapeamento(s)
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => syncStandardMappings.mutateAsync(pipelineId)}
                disabled={syncStandardMappings.isPending}
              >
                <Sync className="h-4 w-4 mr-1" />
                Sincronizar Padrão
              </Button>
              
              <Button
                size="sm"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Mapeamento
              </Button>
            </div>
          </div>
          
          {/* Lista de mapeamentos */}
          <div className="space-y-2">
            {mappings.map((mapping) => (
              <div key={mapping.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {mapping.webhook_field_name}
                      </code>
                      <span className="text-gray-500">→</span>
                      <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                        {mapping.crm_field_name}
                      </code>
                    </div>
                    
                    <Badge variant={mapping.crm_field_type === 'custom' ? 'secondary' : 'default'}>
                      {mapping.crm_field_type === 'custom' ? 'Custom' : 'Padrão'}
                    </Badge>
                    
                    <Badge variant="outline">
                      {mapping.field_type}
                    </Badge>
                    
                    {mapping.is_required && (
                      <Badge variant="destructive" className="text-xs">
                        Obrigatório
                      </Badge>
                    )}
                    
                    {!mapping.is_active && (
                      <Badge variant="secondary" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  
                  {mapping.custom_field && (
                    <p className="text-xs text-gray-500 mt-1">
                      Campo customizado: {mapping.custom_field.field_name}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(mapping)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(mapping.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {mappings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhum mapeamento configurado</p>
                <p className="text-xs">Clique em "Sincronizar Padrão" para começar</p>
              </div>
            )}
          </div>
          
          {/* Dialog para criar/editar mapeamento */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMapping ? 'Editar' : 'Novo'} Mapeamento de Campo
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Campo no Webhook</Label>
                    <Input
                      value={formData.webhook_field_name || ''}
                      onChange={(e) => setFormData({ ...formData, webhook_field_name: e.target.value })}
                      placeholder="ex: customer_name"
                    />
                  </div>
                  
                  <div>
                    <Label>Tipo do Campo CRM</Label>
                    <Select
                      value={formData.crm_field_type}
                      onValueChange={(value: 'standard' | 'custom') => 
                        setFormData({ ...formData, crm_field_type: value, custom_field_id: undefined, crm_field_name: '' })
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
                </div>
                
                <div>
                  <Label>Campo do CRM</Label>
                  {formData.crm_field_type === 'standard' ? (
                    <Select
                      value={formData.crm_field_name}
                      onValueChange={(value) => {
                        const field = standardFields.find(f => f.key === value);
                        setFormData({ 
                          ...formData, 
                          crm_field_name: value,
                          field_type: field?.type as any || 'text'
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um campo padrão" />
                      </SelectTrigger>
                      <SelectContent>
                        {standardFields.map((field) => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label} ({field.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={formData.custom_field_id}
                      onValueChange={(value) => {
                        const field = customFields.find(f => f.id === value);
                        setFormData({ 
                          ...formData, 
                          custom_field_id: value,
                          crm_field_name: field?.field_key || '',
                          field_type: field?.field_type || 'text'
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um campo customizado" />
                      </SelectTrigger>
                      <SelectContent>
                        {customFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.field_name} ({field.field_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_required}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                    />
                    <Label>Campo obrigatório</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Ativo</Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingMapping(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.webhook_field_name || !formData.crm_field_name}
                  >
                    {editingMapping ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};
