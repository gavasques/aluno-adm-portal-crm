
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, FileText, Upload, Check } from 'lucide-react';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { toast } from 'sonner';

interface TypeformFieldMappingDialogProps {
  pipelineId?: string;
  trigger?: React.ReactNode;
}

export const TypeformFieldMappingDialog = ({ pipelineId, trigger }: TypeformFieldMappingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [detectedFields, setDetectedFields] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const { createMapping } = useCRMWebhookFieldMappings(pipelineId);

  const exampleTypeformJson = `{
  "event_id": "01J8KXYZ123ABC",
  "event_type": "form_response",
  "form_response": {
    "form_id": "ABC123xyz",
    "token": "abc123xyz789def",
    "definition": {
      "id": "ABC123xyz",
      "title": "Formulário de Captação"
    },
    "answers": [
      {
        "type": "short_text",
        "short_text": {
          "value": "João Silva"
        },
        "field": {
          "id": "S9kAFZFWH5lE",
          "type": "short_text",
          "ref": "name"
        }
      },
      {
        "type": "email",
        "email": {
          "value": "joao@email.com"
        },
        "field": {
          "id": "O7i0ewE1vtNz",
          "type": "email",
          "ref": "email_address"
        }
      },
      {
        "type": "phone_number",
        "phone_number": {
          "value": "(11) 99999-9999"
        },
        "field": {
          "id": "jQngFhlOHRPd",
          "type": "phone_number",
          "ref": "phone"
        }
      }
    ]
  }
}`;

  const standardCrmFields = [
    { key: 'name', label: 'Nome', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Telefone', type: 'phone', required: false },
    { key: 'has_company', label: 'Tem Empresa', type: 'boolean', required: false },
    { key: 'sells_on_amazon', label: 'Vende na Amazon', type: 'boolean', required: false },
    { key: 'works_with_fba', label: 'Trabalha com FBA', type: 'boolean', required: false },
    { key: 'seeks_private_label', label: 'Busca Marca Própria', type: 'boolean', required: false },
    { key: 'ready_to_invest_3k', label: 'Pronto para Investir 3k', type: 'boolean', required: false },
    { key: 'what_sells', label: 'O que Vende', type: 'text', required: false },
    { key: 'amazon_store_link', label: 'Link da Loja Amazon', type: 'text', required: false },
    { key: 'main_doubts', label: 'Principais Dúvidas', type: 'text', required: false },
    { key: 'notes', label: 'Observações', type: 'text', required: false },
  ];

  const parseTypeformJson = () => {
    try {
      const data = JSON.parse(jsonInput);
      
      if (data.form_response?.answers) {
        const fields = data.form_response.answers.map((answer: any) => ({
          id: answer.field.id,
          type: answer.field.type,
          ref: answer.field.ref,
          value: getAnswerValue(answer),
          suggested_mapping: suggestMapping(answer.field.ref, answer.field.type)
        }));
        
        setDetectedFields(fields);
        
        // Create initial mappings
        const initialMappings = fields.map((field: any) => ({
          webhook_field_name: field.id,
          crm_field_name: field.suggested_mapping,
          field_type: mapTypeformTypeToCRM(field.type),
          is_required: field.suggested_mapping === 'name' || field.suggested_mapping === 'email',
        }));
        
        setMappings(initialMappings);
        toast.success(`${fields.length} campos detectados do Typeform!`);
      } else {
        toast.error('JSON não parece ser do formato Typeform');
      }
    } catch (error) {
      toast.error('JSON inválido. Verifique o formato.');
    }
  };

  const getAnswerValue = (answer: any) => {
    if (answer.short_text?.value) return answer.short_text.value;
    if (answer.email?.value) return answer.email.value;
    if (answer.phone_number?.value) return answer.phone_number.value;
    if (answer.long_text?.value) return answer.long_text.value;
    if (answer.choice?.label) return answer.choice.label;
    if (answer.boolean !== undefined) return answer.boolean;
    if (answer.number) return answer.number;
    return null;
  };

  const suggestMapping = (ref: string, type: string) => {
    const refLower = ref?.toLowerCase() || '';
    
    if (refLower.includes('name') || refLower.includes('nome')) return 'name';
    if (refLower.includes('email')) return 'email';
    if (refLower.includes('phone') || refLower.includes('telefone')) return 'phone';
    if (refLower.includes('company') || refLower.includes('empresa')) return 'has_company';
    if (refLower.includes('amazon')) return 'sells_on_amazon';
    if (refLower.includes('fba')) return 'works_with_fba';
    if (refLower.includes('private') || refLower.includes('marca')) return 'seeks_private_label';
    if (refLower.includes('invest') || refLower.includes('3k')) return 'ready_to_invest_3k';
    if (refLower.includes('sells') || refLower.includes('vende')) return 'what_sells';
    if (refLower.includes('store') || refLower.includes('loja')) return 'amazon_store_link';
    if (refLower.includes('doubt') || refLower.includes('duvida')) return 'main_doubts';
    if (refLower.includes('note') || refLower.includes('observ')) return 'notes';
    
    return 'notes'; // default
  };

  const mapTypeformTypeToCRM = (typeformType: string) => {
    switch (typeformType) {
      case 'email': return 'email';
      case 'phone_number': return 'phone';
      case 'number': return 'number';
      case 'boolean': return 'boolean';
      case 'multiple_choice': return 'select';
      default: return 'text';
    }
  };

  const updateMapping = (index: number, field: string, value: string) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], [field]: value };
    setMappings(updated);
  };

  const handleSaveMappings = async () => {
    if (!pipelineId) {
      toast.error('Pipeline não selecionado');
      return;
    }

    try {
      for (const mapping of mappings) {
        if (mapping.crm_field_name && mapping.crm_field_name !== 'none') {
          await createMapping.mutateAsync({
            pipeline_id: pipelineId,
            webhook_field_name: mapping.webhook_field_name,
            crm_field_name: mapping.crm_field_name,
            crm_field_type: 'standard',
            field_type: mapping.field_type,
            is_required: mapping.is_required,
            transformation_rules: {}
          });
        }
      }
      
      toast.success('Mapeamentos criados com sucesso!');
      setOpen(false);
      setJsonInput('');
      setDetectedFields([]);
      setMappings([]);
    } catch (error) {
      console.error('Erro ao criar mapeamentos:', error);
      toast.error('Erro ao criar mapeamentos');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Importar Campos Typeform
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar Campos do Typeform
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* JSON Input */}
          <div>
            <Label htmlFor="json-input">JSON do Webhook Typeform</Label>
            <p className="text-sm text-gray-600 mb-2">
              Cole aqui o JSON completo recebido do webhook do Typeform para detectar automaticamente os campos.
            </p>
            <Textarea
              id="json-input"
              placeholder="Cole o JSON do webhook do Typeform aqui..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            
            <div className="flex gap-2 mt-2">
              <Button onClick={parseTypeformJson} disabled={!jsonInput.trim()}>
                <Upload className="h-4 w-4 mr-2" />
                Analisar JSON
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setJsonInput(exampleTypeformJson)}
              >
                Usar Exemplo
              </Button>
            </div>
          </div>

          {/* Detected Fields */}
          {detectedFields.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Campos Detectados do Typeform</h3>
              <div className="space-y-4">
                {detectedFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Field Info */}
                      <div>
                        <Label className="text-xs text-gray-500">ID do Campo</Label>
                        <div className="font-mono text-sm bg-white p-2 rounded border">
                          {field.id}
                        </div>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {field.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Sample Value */}
                      <div>
                        <Label className="text-xs text-gray-500">Valor Exemplo</Label>
                        <div className="text-sm bg-white p-2 rounded border">
                          {field.value || '-'}
                        </div>
                      </div>

                      {/* CRM Field Mapping */}
                      <div>
                        <Label className="text-xs text-gray-500">Campo do CRM</Label>
                        <Select
                          value={mappings[index]?.crm_field_name || ''}
                          onValueChange={(value) => updateMapping(index, 'crm_field_name', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Não mapear</SelectItem>
                            {standardCrmFields.map(field => (
                              <SelectItem key={field.key} value={field.key}>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Required */}
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-gray-500">Obrigatório</Label>
                        <input
                          type="checkbox"
                          checked={mappings[index]?.is_required || false}
                          onChange={(e) => updateMapping(index, 'is_required', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleSaveMappings}
                  disabled={!pipelineId || createMapping.isPending}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  {createMapping.isPending ? 'Salvando...' : 'Salvar Mapeamentos'}
                </Button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">ℹ️ Como funciona</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Cole o JSON completo do webhook recebido do Typeform</li>
              <li>• O sistema detectará automaticamente todos os campos do formulário</li>
              <li>• Configure o mapeamento de cada campo para os campos do CRM</li>
              <li>• Campos obrigatórios: Nome e Email são sempre necessários</li>
              <li>• Após salvar, os webhooks do Typeform serão processados automaticamente</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
