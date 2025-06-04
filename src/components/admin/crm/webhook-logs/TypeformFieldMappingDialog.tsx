
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

interface TypeformFieldMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (importedMappings: any[]) => void;
}

interface TypeformField {
  id: string;
  title: string;
  type: string;
  ref?: string;
}

interface FieldMapping {
  id: string;
  typeformFieldId: string;
  typeformFieldTitle: string;
  typeformFieldType: string;
  crmFieldName: string;
  crmFieldType: 'standard' | 'custom';
  fieldType: 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email';
  isRequired: boolean;
  isActive: boolean;
}

const TypeformFieldMappingDialog: React.FC<TypeformFieldMappingDialogProps> = ({
  open,
  onOpenChange,
  onImport
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [detectedFields, setDetectedFields] = useState<TypeformField[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [currentStep, setCurrentStep] = useState<'import' | 'mapping'>('import');

  const parseTypeformJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      console.log('📥 [TYPEFORM_DIALOG] JSON parsed:', parsed);
      
      let fields: TypeformField[] = [];
      
      // Detectar campos do formulário
      if (parsed.fields && Array.isArray(parsed.fields)) {
        fields = parsed.fields.map((field: any) => ({
          id: field.id,
          title: field.title || field.ref || `Field ${field.id}`,
          type: field.type || 'text',
          ref: field.ref
        }));
      }
      // Ou detectar campos das respostas
      else if (parsed.answers && Array.isArray(parsed.answers)) {
        const fieldIds = [...new Set(parsed.answers.map((answer: any) => answer.field.id))];
        fields = fieldIds.map(id => {
          const answer = parsed.answers.find((a: any) => a.field.id === id);
          return {
            id,
            title: answer?.field?.title || answer?.field?.ref || `Field ${id}`,
            type: answer?.field?.type || answer?.type || 'text',
            ref: answer?.field?.ref
          };
        });
      }
      
      if (fields.length === 0) {
        toast.error('Nenhum campo encontrado no JSON');
        return;
      }
      
      console.log('🔍 [TYPEFORM_DIALOG] Campos detectados:', fields);
      setDetectedFields(fields);
      
      // Criar mapeamentos iniciais
      const initialMappings: FieldMapping[] = fields.map(field => ({
        id: `mapping-${field.id}`,
        typeformFieldId: field.id,
        typeformFieldTitle: field.title,
        typeformFieldType: field.type,
        crmFieldName: mapFieldTitleToCRMField(field.title),
        crmFieldType: 'standard',
        fieldType: mapTypeformTypeToCRMType(field.type),
        isRequired: false,
        isActive: true
      }));
      
      setMappings(initialMappings);
      setCurrentStep('mapping');
      toast.success(`${fields.length} campos detectados!`);
      
    } catch (error) {
      console.error('❌ [TYPEFORM_DIALOG] Erro ao analisar JSON:', error);
      toast.error('JSON inválido. Verifique a formatação.');
    }
  };

  const mapFieldTitleToCRMField = (title: string): string => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('nome') || titleLower.includes('name')) return 'name';
    if (titleLower.includes('email') || titleLower.includes('e-mail')) return 'email';
    if (titleLower.includes('telefone') || titleLower.includes('phone') || titleLower.includes('celular')) return 'phone';
    if (titleLower.includes('empresa') || titleLower.includes('company')) return 'company';
    if (titleLower.includes('observa') || titleLower.includes('notes') || titleLower.includes('comentar')) return 'notes';
    
    // Campo customizado baseado no título
    return title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  };

  const mapTypeformTypeToCRMType = (type: string): 'text' | 'number' | 'phone' | 'boolean' | 'select' | 'email' => {
    switch (type) {
      case 'email': return 'email';
      case 'phone_number': return 'phone';
      case 'number': return 'number';
      case 'yes_no': 
      case 'boolean': return 'boolean';
      case 'multiple_choice':
      case 'dropdown': return 'select';
      default: return 'text';
    }
  };

  const updateMapping = (mappingId: string, field: string, value: any) => {
    setMappings(prev => prev.map(mapping => 
      mapping.id === mappingId 
        ? { ...mapping, [field]: value }
        : mapping
    ));
  };

  const removeMapping = (mappingId: string) => {
    setMappings(prev => prev.filter(mapping => mapping.id !== mappingId));
  };

  const handleImport = () => {
    const activeMappings = mappings.filter(m => m.isActive);
    
    if (activeMappings.length === 0) {
      toast.error('Selecione pelo menos um campo para importar');
      return;
    }
    
    // Converter para formato do sistema
    const formattedMappings = activeMappings.map(mapping => ({
      webhook_field_name: mapping.typeformFieldId,
      crm_field_name: mapping.crmFieldName,
      crm_field_type: mapping.crmFieldType,
      field_type: mapping.fieldType,
      is_required: mapping.isRequired,
      transformation_rules: {}
    }));
    
    console.log('📤 [TYPEFORM_DIALOG] Importando mapeamentos:', formattedMappings);
    onImport(formattedMappings);
    
    toast.success(`${activeMappings.length} mapeamentos importados!`);
    onOpenChange(false);
    
    // Reset state
    setJsonInput('');
    setDetectedFields([]);
    setMappings([]);
    setCurrentStep('import');
  };

  const reset = () => {
    setJsonInput('');
    setDetectedFields([]);
    setMappings([]);
    setCurrentStep('import');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Campos do Typeform
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'import' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="json-input">JSON do Typeform</Label>
              <p className="text-sm text-gray-600 mb-2">
                Cole aqui o JSON do formulário Typeform ou de uma resposta de exemplo
              </p>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`Exemplo:
{
  "fields": [
    {
      "id": "field1",
      "title": "Nome completo",
      "type": "short_text"
    }
  ]
}`}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={parseTypeformJson} disabled={!jsonInput.trim()}>
                <Upload className="h-4 w-4 mr-2" />
                Analisar Campos
              </Button>
              <Button variant="outline" onClick={() => setJsonInput('')}>
                Limpar
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'mapping' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Configurar Mapeamentos</h3>
                <p className="text-sm text-gray-600">
                  Configure como os campos do Typeform serão mapeados no CRM
                </p>
              </div>
              <Button variant="outline" onClick={reset}>
                <X className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>

            <div className="grid gap-4">
              {mappings.map((mapping) => (
                <Card key={mapping.id} className={!mapping.isActive ? 'opacity-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={mapping.isActive}
                          onCheckedChange={(checked) => 
                            updateMapping(mapping.id, 'isActive', checked)
                          }
                        />
                        <div>
                          <CardTitle className="text-sm">{mapping.typeformFieldTitle}</CardTitle>
                          <p className="text-xs text-gray-500">
                            ID: {mapping.typeformFieldId} • Tipo: {mapping.typeformFieldType}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeMapping(mapping.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {mapping.isActive && (
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Campo no CRM</Label>
                          <Input
                            value={mapping.crmFieldName}
                            onChange={(e) => updateMapping(mapping.id, 'crmFieldName', e.target.value)}
                            placeholder="nome_do_campo"
                          />
                        </div>
                        <div>
                          <Label>Tipo de Campo</Label>
                          <Select
                            value={mapping.fieldType}
                            onValueChange={(value) => updateMapping(mapping.id, 'fieldType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Telefone</SelectItem>
                              <SelectItem value="number">Número</SelectItem>
                              <SelectItem value="boolean">Verdadeiro/Falso</SelectItem>
                              <SelectItem value="select">Seleção</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${mapping.id}`}
                            checked={mapping.isRequired}
                            onCheckedChange={(checked) => 
                              updateMapping(mapping.id, 'isRequired', checked)
                            }
                          />
                          <label htmlFor={`required-${mapping.id}`} className="text-sm">
                            Campo obrigatório
                          </label>
                        </div>
                        
                        <Badge variant={mapping.crmFieldType === 'standard' ? 'default' : 'secondary'}>
                          {mapping.crmFieldType === 'standard' ? 'Padrão' : 'Customizado'}
                        </Badge>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                {mappings.filter(m => m.isActive).length} de {mappings.length} campos selecionados
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleImport}>
                  <Download className="h-4 w-4 mr-2" />
                  Importar Mapeamentos
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TypeformFieldMappingDialog;
