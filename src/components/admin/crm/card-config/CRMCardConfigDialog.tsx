
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Save, 
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { CRMLeadCardField, CRMLeadCardFieldConfig } from '@/types/crm.types';
import { useCRMCardPreferences } from '@/hooks/crm/useCRMCardPreferences';
import { motion, AnimatePresence } from 'framer-motion';

// Configuração de campos disponíveis
const FIELD_CONFIGS: CRMLeadCardFieldConfig[] = [
  // Essenciais
  { key: 'name', label: 'Nome', category: 'essencial', isRequired: true, description: 'Nome do lead' },
  { key: 'status', label: 'Status', category: 'essencial', description: 'Status atual do lead' },
  { key: 'responsible', label: 'Responsável', category: 'essencial', description: 'Pessoa responsável pelo lead' },
  
  // Contato
  { key: 'phone', label: 'Telefone', category: 'contato', description: 'Número de telefone' },
  { key: 'email', label: 'Email', category: 'contato', description: 'Endereço de email' },
  
  // Sistema
  { key: 'pipeline', label: 'Pipeline', category: 'sistema', description: 'Pipeline atual' },
  { key: 'column', label: 'Coluna/Estágio', category: 'sistema', description: 'Estágio no pipeline' },
  { key: 'tags', label: 'Tags', category: 'sistema', description: 'Tags associadas' },
  { key: 'created_at', label: 'Data de Criação', category: 'sistema', description: 'Quando o lead foi criado' },
  { key: 'updated_at', label: 'Última Atualização', category: 'sistema', description: 'Última modificação' },
  { key: 'scheduled_contact_date', label: 'Próximo Contato', category: 'sistema', description: 'Data do próximo contato agendado' },
  
  // Qualificação
  { key: 'has_company', label: 'Tem Empresa', category: 'qualificacao', description: 'Se possui empresa' },
  { key: 'sells_on_amazon', label: 'Vende na Amazon', category: 'qualificacao', description: 'Se vende na Amazon' },
  { key: 'works_with_fba', label: 'Trabalha com FBA', category: 'qualificacao', description: 'Se trabalha com FBA' },
  { key: 'seeks_private_label', label: 'Busca Marca Própria', category: 'qualificacao', description: 'Se busca marca própria' },
  { key: 'ready_to_invest_3k', label: 'Pronto para Investir 3k', category: 'qualificacao', description: 'Se está pronto para investir' },
  { key: 'calendly_scheduled', label: 'Calendly Agendado', category: 'qualificacao', description: 'Se tem reunião agendada' },
  { key: 'had_contact_with_lv', label: 'Teve Contato com LV', category: 'qualificacao', description: 'Se já teve contato anterior' },
  
  // Amazon
  { key: 'what_sells', label: 'O que Vende', category: 'amazon', description: 'Produtos que vende' },
  { key: 'amazon_state', label: 'Estado Amazon', category: 'amazon', description: 'Estado da conta Amazon' },
  { key: 'amazon_tax_regime', label: 'Regime Tributário', category: 'amazon', description: 'Regime tributário Amazon' },
  { key: 'amazon_store_link', label: 'Link da Loja', category: 'amazon', description: 'URL da loja Amazon' },
  { key: 'keep_or_new_niches', label: 'Nichos Atuais/Novos', category: 'amazon', description: 'Estratégia de nichos' },
  { key: 'main_doubts', label: 'Principais Dúvidas', category: 'amazon', description: 'Principais questionamentos' },
  { key: 'notes', label: 'Observações', category: 'amazon', description: 'Anotações gerais' },
  { key: 'calendly_link', label: 'Link Calendly', category: 'amazon', description: 'Link do Calendly' }
];

const CATEGORY_COLORS = {
  essencial: 'bg-red-50 border-red-200 text-red-800',
  contato: 'bg-blue-50 border-blue-200 text-blue-800',
  qualificacao: 'bg-green-50 border-green-200 text-green-800',
  amazon: 'bg-purple-50 border-purple-200 text-purple-800',
  sistema: 'bg-gray-50 border-gray-200 text-gray-800'
};

const CATEGORY_LABELS = {
  essencial: 'Essencial',
  contato: 'Contato',
  qualificacao: 'Qualificação',
  amazon: 'Amazon',
  sistema: 'Sistema'
};

interface CRMCardConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CRMCardConfigDialog: React.FC<CRMCardConfigDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { preferences, isLoading, isSaving, updatePreferences } = useCRMCardPreferences();
  
  const [localVisibleFields, setLocalVisibleFields] = useState<CRMLeadCardField[]>([]);
  const [localFieldOrder, setLocalFieldOrder] = useState<CRMLeadCardField[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar estado local com preferências
  useEffect(() => {
    if (preferences.visible_fields) {
      setLocalVisibleFields([...preferences.visible_fields]);
    }
    if (preferences.field_order) {
      setLocalFieldOrder([...preferences.field_order]);
    }
  }, [preferences]);

  // Detectar mudanças
  useEffect(() => {
    const visibleChanged = JSON.stringify(localVisibleFields) !== JSON.stringify(preferences.visible_fields);
    const orderChanged = JSON.stringify(localFieldOrder) !== JSON.stringify(preferences.field_order);
    setHasChanges(visibleChanged || orderChanged);
  }, [localVisibleFields, localFieldOrder, preferences]);

  const handleFieldToggle = (fieldKey: CRMLeadCardField, checked: boolean) => {
    const fieldConfig = FIELD_CONFIGS.find(f => f.key === fieldKey);
    
    // Não permitir desabilitar campos obrigatórios
    if (fieldConfig?.isRequired && !checked) {
      return;
    }

    if (checked) {
      // Adicionar campo se não existe
      if (!localVisibleFields.includes(fieldKey)) {
        setLocalVisibleFields(prev => [...prev, fieldKey]);
        setLocalFieldOrder(prev => [...prev, fieldKey]);
      }
    } else {
      // Remover campo
      setLocalVisibleFields(prev => prev.filter(f => f !== fieldKey));
      setLocalFieldOrder(prev => prev.filter(f => f !== fieldKey));
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localFieldOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalFieldOrder(items);
  };

  const handleSave = async () => {
    await updatePreferences({
      visible_fields: localVisibleFields,
      field_order: localFieldOrder
    });
  };

  const handleReset = () => {
    setLocalVisibleFields([...preferences.visible_fields]);
    setLocalFieldOrder([...preferences.field_order]);
  };

  const groupedFields = FIELD_CONFIGS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, CRMLeadCardFieldConfig[]>);

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração dos Cards de Lead
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[70vh]">
          {/* Painel de Campos Disponíveis */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Campos Disponíveis</h3>
              <Badge variant="secondary">
                {localVisibleFields.length} de {FIELD_CONFIGS.length} campos
              </Badge>
            </div>

            <ScrollArea className="h-full">
              <div className="space-y-4">
                {Object.entries(groupedFields).map(([category, fields]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        <Badge className={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}>
                          {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {fields.map((field) => {
                        const isVisible = localVisibleFields.includes(field.key);
                        const isRequired = field.isRequired;
                        
                        return (
                          <div key={field.key} className="flex items-start space-x-3 py-2">
                            <Checkbox
                              id={field.key}
                              checked={isVisible}
                              onCheckedChange={(checked) => handleFieldToggle(field.key, checked as boolean)}
                              disabled={isRequired}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <Label 
                                htmlFor={field.key} 
                                className={`text-sm font-medium cursor-pointer ${isRequired ? 'text-red-600' : ''}`}
                              >
                                {field.label}
                                {isRequired && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {field.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {field.description}
                                </p>
                              )}
                            </div>
                            {isVisible ? (
                              <Eye className="h-4 w-4 text-green-600 mt-1" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400 mt-1" />
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator orientation="vertical" />

          {/* Painel de Ordenação */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ordem dos Campos</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                Arraste para reordenar
              </div>
            </div>

            <ScrollArea className="h-full">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="field-order">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-2 min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <AnimatePresence>
                        {localFieldOrder.map((fieldKey, index) => {
                          const fieldConfig = FIELD_CONFIGS.find(f => f.key === fieldKey);
                          if (!fieldConfig || !localVisibleFields.includes(fieldKey)) return null;

                          return (
                            <Draggable 
                              key={fieldKey} 
                              draggableId={fieldKey} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-move transition-all ${
                                    snapshot.isDragging 
                                      ? 'shadow-lg rotate-2 scale-105' 
                                      : 'hover:shadow-md'
                                  }`}
                                >
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {fieldConfig.label}
                                      {fieldConfig.isRequired && <span className="text-red-500 ml-1">*</span>}
                                    </div>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${CATEGORY_COLORS[fieldConfig.category]}`}
                                    >
                                      {CATEGORY_LABELS[fieldConfig.category]}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">
                                    #{index + 1}
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          );
                        })}
                      </AnimatePresence>
                      {provided.placeholder}
                      
                      {localFieldOrder.filter(f => localVisibleFields.includes(f)).length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Eye className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum campo selecionado</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </ScrollArea>
          </div>
        </div>

        {/* Footer com ações */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {hasChanges && (
              <>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                Alterações não salvas
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reverter
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
