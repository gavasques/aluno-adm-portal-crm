
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useCRMWebhookFieldMappings, WebhookField } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { toast } from 'sonner';

interface ImportFieldsDialogProps {
  pipelineId: string;
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

export const ImportFieldsDialog = ({ pipelineId, trigger }: ImportFieldsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [extractedFields, setExtractedFields] = useState<WebhookField[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, { crmField: string; fieldType: string; isRequired: boolean }>>({});
  const [step, setStep] = useState<'input' | 'configure'>('input');

  const { extractFieldsFromJson, createBatchMappings } = useCRMWebhookFieldMappings(pipelineId);

  const handleExtractFields = () => {
    try {
      const fields = extractFieldsFromJson(jsonInput);
      setExtractedFields(fields);
      
      // Inicializar mapeamentos com sugestões
      const initialMappings: Record<string, { crmField: string; fieldType: string; isRequired: boolean }> = {};
      fields.forEach(field => {
        initialMappings[field.id] = {
          crmField: field.suggestedCrmField || 'notes',
          fieldType: field.suggestedType || 'text',
          isRequired: field.suggestedCrmField === 'name'
        };
      });
      setFieldMappings(initialMappings);
      setStep('configure');
      toast.success(`${fields.length} campos extraídos com sucesso!`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleCreateMappings = async () => {
    const fieldsToCreate = extractedFields.map(field => ({
      ...field,
      ...fieldMappings[field.id]
    }));

    try {
      await createBatchMappings.mutateAsync({
        fields: fieldsToCreate,
        pipelineId
      });
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar mapeamentos:', error);
    }
  };

  const resetForm = () => {
    setJsonInput('');
    setExtractedFields([]);
    setFieldMappings({});
    setStep('input');
  };

  const updateFieldMapping = (fieldId: string, key: 'crmField' | 'fieldType' | 'isRequired', value: any) => {
    setFieldMappings(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [key]: value
      }
    }));
  };

  const getFieldTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      phone: 'bg-purple-100 text-purple-800',
      boolean: 'bg-yellow-100 text-yellow-800',
      number: 'bg-orange-100 text-orange-800',
      select: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Importar do JSON
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar Campos do JSON
          </DialogTitle>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Como funciona:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Cole um JSON de exemplo do seu webhook (formato com array "answers")</li>
                    <li>Os campos serão extraídos automaticamente</li>
                    <li>Sugestões de mapeamento serão geradas baseadas no tipo e título</li>
                    <li>Você poderá revisar e ajustar antes de criar os mapeamentos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jsonInput">JSON de Exemplo do Webhook</Label>
              <Textarea
                id="jsonInput"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Cole aqui o JSON completo do seu webhook. Exemplo:
{
  "answers": [
    {
      "id": "S9kAFZFWH5lE",
      "kind": "short_text", 
      "title": "Qual o seu nome?",
      "value": "João Silva"
    }
  ]
}'
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExtractFields} disabled={!jsonInput.trim()}>
                <Upload className="h-4 w-4 mr-2" />
                Extrair Campos
              </Button>
            </div>
          </div>
        )}

        {step === 'configure' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {extractedFields.length} campos encontrados! Configure os mapeamentos abaixo:
                </span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {extractedFields.map(field => (
                <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600">Campo do Webhook</Label>
                      <div className="space-y-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {field.id}
                        </Badge>
                        <p className="text-sm font-medium">{field.title}</p>
                        <Badge className={getFieldTypeColor(field.kind)}>
                          {field.kind}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label>Campo do CRM</Label>
                      <Select
                        value={fieldMappings[field.id]?.crmField}
                        onValueChange={(value) => updateFieldMapping(field.id, 'crmField', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {standardFields.map(stdField => (
                            <SelectItem key={stdField.key} value={stdField.key}>
                              {stdField.name} ({stdField.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tipo</Label>
                      <Select
                        value={fieldMappings[field.id]?.fieldType}
                        onValueChange={(value) => updateFieldMapping(field.id, 'fieldType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="boolean">Sim/Não</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                          <SelectItem value="select">Seleção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldMappings[field.id]?.isRequired || false}
                        onCheckedChange={(checked) => updateFieldMapping(field.id, 'isRequired', checked)}
                        disabled={fieldMappings[field.id]?.crmField === 'name'}
                      />
                      <Label className="text-sm">Obrigatório</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('input')}>
                Voltar
              </Button>
              <Button 
                onClick={handleCreateMappings} 
                disabled={createBatchMappings.isPending}
              >
                {createBatchMappings.isPending ? 'Criando...' : 'Criar Mapeamentos'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
