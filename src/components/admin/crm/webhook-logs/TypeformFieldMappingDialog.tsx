
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';

interface TypeformField {
  id: string;
  title: string;
  type: string;
  ref?: string;
}

interface TypeformFieldMappingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pipelineId: string;
}

const TypeformFieldMappingDialog: React.FC<TypeformFieldMappingDialogProps> = ({
  isOpen,
  onClose,
  pipelineId
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [extractedFields, setExtractedFields] = useState<TypeformField[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, { crm_field: string; field_type: string; is_required: boolean }>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { createMapping } = useCRMWebhookFieldMappings();

  const standardCRMFields = [
    { value: 'name', label: 'Nome', type: 'text', required: true },
    { value: 'email', label: 'E-mail', type: 'email', required: false },
    { value: 'phone', label: 'Telefone', type: 'phone', required: false },
    { value: 'amazon_store_link', label: 'Link da Loja Amazon', type: 'text', required: false },
    { value: 'what_sells', label: 'O que vende', type: 'text', required: false },
    { value: 'amazon_state', label: 'Estado Amazon', type: 'select', required: false },
    { value: 'amazon_tax_regime', label: 'Regime Tributário Amazon', type: 'select', required: false },
    { value: 'notes', label: 'Observações', type: 'text', required: false }
  ];

  const typeformToFieldTypeMap: Record<string, string> = {
    'short_text': 'text',
    'long_text': 'text',
    'email': 'email',
    'phone_number': 'phone',
    'number': 'number',
    'yes_no': 'boolean',
    'multiple_choice': 'select',
    'dropdown': 'select',
    'url': 'text'
  };

  const extractFieldsFromJson = () => {
    try {
      setIsProcessing(true);
      const parsed = JSON.parse(jsonInput);
      
      let fields: TypeformField[] = [];
      
      // Tentar extrair campos de diferentes formatos possíveis
      if (parsed.fields && Array.isArray(parsed.fields)) {
        // Formato padrão do Typeform
        fields = parsed.fields.map((field: any) => ({
          id: field.id,
          title: field.title,
          type: field.type,
          ref: field.ref
        }));
      } else if (parsed.form && parsed.form.fields) {
        // Formato alternativo
        fields = parsed.form.fields.map((field: any) => ({
          id: field.id,
          title: field.title,
          type: field.type,
          ref: field.ref
        }));
      } else if (Array.isArray(parsed)) {
        // Array direto de campos
        fields = parsed.map((field: any) => ({
          id: field.id,
          title: field.title,
          type: field.type,
          ref: field.ref
        }));
      } else {
        throw new Error('Formato JSON não reconhecido. Verifique se contém um array "fields" com os campos do formulário.');
      }

      if (fields.length === 0) {
        throw new Error('Nenhum campo encontrado no JSON fornecido.');
      }

      setExtractedFields(fields);
      
      // Inicializar mapeamentos vazios
      const initialMappings: Record<string, { crm_field: string; field_type: string; is_required: boolean }> = {};
      fields.forEach(field => {
        initialMappings[field.id] = {
          crm_field: '',
          field_type: typeformToFieldTypeMap[field.type] || 'text',
          is_required: false
        };
      });
      setFieldMappings(initialMappings);
      
      toast.success(`${fields.length} campos extraídos com sucesso!`);
    } catch (error) {
      console.error('Erro ao processar JSON:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar JSON. Verifique o formato.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateFieldMapping = (fieldId: string, property: keyof typeof fieldMappings[string], value: string | boolean) => {
    setFieldMappings(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [property]: value
      }
    }));
  };

  const saveMappings = async () => {
    try {
      setIsProcessing(true);
      
      // Filtrar apenas campos que foram mapeados
      const mappedFields = Object.entries(fieldMappings).filter(([_, mapping]) => 
        mapping.crm_field && mapping.crm_field.trim() !== ''
      );

      if (mappedFields.length === 0) {
        toast.error('Configure pelo menos um mapeamento de campo antes de salvar.');
        return;
      }

      // Verificar se o campo obrigatório 'name' está mapeado
      const hasNameMapping = mappedFields.some(([_, mapping]) => mapping.crm_field === 'name');
      if (!hasNameMapping) {
        toast.error('É obrigatório mapear pelo menos um campo para "Nome".');
        return;
      }

      // Criar os mapeamentos no banco
      const mappingPromises = mappedFields.map(([fieldId, mapping]) => {
        const field = extractedFields.find(f => f.id === fieldId);
        if (!field) return null;

        return createMapping.mutateAsync({
          pipeline_id: pipelineId,
          webhook_field_name: fieldId,
          crm_field_name: mapping.crm_field,
          crm_field_type: 'standard',
          field_type: mapping.field_type as 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email',
          is_required: mapping.is_required,
          transformation_rules: {
            typeform_field_title: field.title,
            typeform_field_type: field.type,
            typeform_field_ref: field.ref
          }
        });
      });

      const validPromises = mappingPromises.filter(Boolean);
      await Promise.all(validPromises);

      toast.success(`${validPromises.length} mapeamentos salvos com sucesso!`);
      onClose();
      
      // Limpar estado
      setJsonInput('');
      setExtractedFields([]);
      setFieldMappings({});
      
    } catch (error) {
      console.error('Erro ao salvar mapeamentos:', error);
      toast.error('Erro ao salvar mapeamentos. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setJsonInput('');
    setExtractedFields([]);
    setFieldMappings({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Campos do Typeform
          </DialogTitle>
          <DialogDescription>
            Cole o JSON dos campos do seu formulário Typeform para configurar os mapeamentos automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Seção de importação JSON */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="json-input">JSON dos Campos do Typeform</Label>
              <Textarea
                id="json-input"
                placeholder='Cole aqui o JSON dos campos do formulário, ex: {"fields": [{"id": "xyz", "title": "Nome", "type": "short_text"}, ...]}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={extractFieldsFromJson}
                disabled={!jsonInput.trim() || isProcessing}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isProcessing ? 'Processando...' : 'Extrair Campos'}
              </Button>
              
              {extractedFields.length > 0 && (
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>
          </div>

          {/* Campos extraídos e mapeamentos */}
          {extractedFields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Campos Extraídos ({extractedFields.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractedFields.map((field) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{field.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{field.id}</Badge>
                          <Badge variant="secondary">{field.type}</Badge>
                          {field.ref && <Badge variant="outline">ref: {field.ref}</Badge>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Campo CRM */}
                      <div>
                        <Label className="text-xs">Mapear para campo CRM</Label>
                        <Select 
                          value={fieldMappings[field.id]?.crm_field || ''} 
                          onValueChange={(value) => updateFieldMapping(field.id, 'crm_field', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um campo" />
                          </SelectTrigger>
                          <SelectContent>
                            {standardCRMFields.map((crmField) => (
                              <SelectItem key={crmField.value} value={crmField.value}>
                                {crmField.label}
                                {crmField.required && <span className="text-red-500 ml-1">*</span>}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tipo do campo */}
                      <div>
                        <Label className="text-xs">Tipo do campo</Label>
                        <Select 
                          value={fieldMappings[field.id]?.field_type || 'text'} 
                          onValueChange={(value) => updateFieldMapping(field.id, 'field_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="phone">Telefone</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="boolean">Sim/Não</SelectItem>
                            <SelectItem value="select">Seleção</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Campo obrigatório */}
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={fieldMappings[field.id]?.is_required || false}
                          onChange={(e) => updateFieldMapping(field.id, 'is_required', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-xs">
                          Obrigatório
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Como obter o JSON dos campos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>1. Acesse o Typeform e vá para o seu formulário</p>
              <p>2. Use a API do Typeform ou exporte os dados do formulário</p>
              <p>3. Cole o JSON que contém a estrutura dos campos aqui</p>
              <p className="text-muted-foreground">
                O JSON deve conter um array "fields" com objetos que tenham pelo menos as propriedades: id, title e type.
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={saveMappings}
            disabled={extractedFields.length === 0 || isProcessing}
          >
            {isProcessing ? 'Salvando...' : `Salvar ${Object.values(fieldMappings).filter(m => m.crm_field).length} Mapeamentos`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TypeformFieldMappingDialog;
