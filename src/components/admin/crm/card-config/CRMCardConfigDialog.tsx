
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CRMLeadCardField, CRMLeadCardFieldConfig } from '@/types/crm.types';
import { useCRMCardPreferences } from '@/hooks/crm/useCRMCardPreferences';
import { cn } from '@/lib/utils';

interface CRMCardConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FIELD_LABELS: Record<CRMLeadCardField, string> = {
  name: 'Nome do Lead',
  status: 'Status',
  responsible: 'Responsável',
  phone: 'Telefone',
  email: 'Email',
  pipeline: 'Pipeline',
  column: 'Estágio',
  tags: 'Tags',
  has_company: 'Tem Empresa',
  sells_on_amazon: 'Vende na Amazon',
  works_with_fba: 'Trabalha com FBA',
  seeks_private_label: 'Busca Marca Própria',
  ready_to_invest_3k: 'Pronto para Investir 3k',
  calendly_scheduled: 'Calendly Agendado',
  what_sells: 'O que Vende',
  amazon_state: 'Estado Amazon',
  amazon_tax_regime: 'Regime Tributário Amazon',
  amazon_store_link: 'Link da Loja Amazon',
  keep_or_new_niches: 'Manter ou Novos Nichos',
  main_doubts: 'Principais Dúvidas',
  notes: 'Observações',
  calendly_link: 'Link do Calendly',
  had_contact_with_lv: 'Teve Contato com LV',
  created_at: 'Data de Criação',
  updated_at: 'Data de Atualização',
  scheduled_contact_date: 'Data de Contato Agendado'
};

const FIELD_CATEGORIES: Record<string, CRMLeadCardFieldConfig[]> = {
  essencial: [
    { key: 'name', label: 'Nome do Lead', category: 'essencial', isRequired: true },
    { key: 'status', label: 'Status', category: 'essencial', isRequired: true },
    { key: 'responsible', label: 'Responsável', category: 'essencial' },
  ],
  contato: [
    { key: 'phone', label: 'Telefone', category: 'contato' },
    { key: 'email', label: 'Email', category: 'contato' },
    { key: 'scheduled_contact_date', label: 'Data de Contato Agendado', category: 'contato' },
  ],
  qualificacao: [
    { key: 'has_company', label: 'Tem Empresa', category: 'qualificacao' },
    { key: 'sells_on_amazon', label: 'Vende na Amazon', category: 'qualificacao' },
    { key: 'works_with_fba', label: 'Trabalha com FBA', category: 'qualificacao' },
    { key: 'seeks_private_label', label: 'Busca Marca Própria', category: 'qualificacao' },
    { key: 'ready_to_invest_3k', label: 'Pronto para Investir 3k', category: 'qualificacao' },
    { key: 'calendly_scheduled', label: 'Calendly Agendado', category: 'qualificacao' },
    { key: 'had_contact_with_lv', label: 'Teve Contato com LV', category: 'qualificacao' },
  ],
  amazon: [
    { key: 'what_sells', label: 'O que Vende', category: 'amazon' },
    { key: 'amazon_state', label: 'Estado Amazon', category: 'amazon' },
    { key: 'amazon_tax_regime', label: 'Regime Tributário Amazon', category: 'amazon' },
    { key: 'amazon_store_link', label: 'Link da Loja Amazon', category: 'amazon' },
    { key: 'keep_or_new_niches', label: 'Manter ou Novos Nichos', category: 'amazon' },
  ],
  sistema: [
    { key: 'pipeline', label: 'Pipeline', category: 'sistema' },
    { key: 'column', label: 'Estágio', category: 'sistema' },
    { key: 'tags', label: 'Tags', category: 'sistema' },
    { key: 'main_doubts', label: 'Principais Dúvidas', category: 'sistema' },
    { key: 'notes', label: 'Observações', category: 'sistema' },
    { key: 'calendly_link', label: 'Link do Calendly', category: 'sistema' },
    { key: 'created_at', label: 'Data de Criação', category: 'sistema' },
    { key: 'updated_at', label: 'Data de Atualização', category: 'sistema' },
  ],
};

export const CRMCardConfigDialog: React.FC<CRMCardConfigDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { preferences, isLoading, isSaving, updatePreferences } = useCRMCardPreferences();
  const [localVisibleFields, setLocalVisibleFields] = useState<CRMLeadCardField[]>(
    preferences.visible_fields
  );
  const [localFieldOrder, setLocalFieldOrder] = useState<CRMLeadCardField[]>(
    preferences.field_order
  );

  React.useEffect(() => {
    setLocalVisibleFields(preferences.visible_fields);
    setLocalFieldOrder(preferences.field_order);
  }, [preferences]);

  const handleFieldToggle = (field: CRMLeadCardField, isRequired?: boolean) => {
    if (isRequired) return; // Não permitir desabilitar campos obrigatórios

    setLocalVisibleFields(prev => {
      const isVisible = prev.includes(field);
      if (isVisible) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(localFieldOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalFieldOrder(items);
  };

  const handleSave = async () => {
    await updatePreferences({
      visible_fields: localVisibleFields,
      field_order: localFieldOrder,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultFields: CRMLeadCardField[] = [
      'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
    ];
    setLocalVisibleFields(defaultFields);
    setLocalFieldOrder(defaultFields);
  };

  const getVisibleFieldsCount = () => localVisibleFields.length;
  const getCategoryVisibleCount = (categoryFields: CRMLeadCardFieldConfig[]) => {
    return categoryFields.filter(field => localVisibleFields.includes(field.key)).length;
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-blue-600" />
              Configurar Campos dos Cards
              <Badge variant="secondary" className="ml-2">
                {getVisibleFieldsCount()} campos visíveis
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="configure" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configure">Configurar Campos</TabsTrigger>
              <TabsTrigger value="order">Ordenar Campos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="configure" className="flex-1 overflow-auto mt-4">
              <div className="grid gap-4">
                {Object.entries(FIELD_CATEGORIES).map(([categoryKey, fields]) => (
                  <Card key={categoryKey}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700 capitalize flex items-center justify-between">
                        {categoryKey === 'essencial' && 'Campos Essenciais'}
                        {categoryKey === 'contato' && 'Informações de Contato'}
                        {categoryKey === 'qualificacao' && 'Qualificação'}
                        {categoryKey === 'amazon' && 'Dados Amazon'}
                        {categoryKey === 'sistema' && 'Sistema & Outros'}
                        <Badge variant="outline" className="text-xs">
                          {getCategoryVisibleCount(fields)}/{fields.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {fields.map((field) => {
                          const isVisible = localVisibleFields.includes(field.key);
                          const isRequired = field.isRequired;
                          
                          return (
                            <div
                              key={field.key}
                              className={cn(
                                "flex items-center space-x-3 p-3 rounded-lg border transition-all",
                                isVisible 
                                  ? "bg-blue-50 border-blue-200" 
                                  : "bg-gray-50 border-gray-200",
                                isRequired && "border-orange-200 bg-orange-50"
                              )}
                            >
                              <Checkbox
                                id={field.key}
                                checked={isVisible}
                                disabled={isRequired}
                                onCheckedChange={() => handleFieldToggle(field.key, isRequired)}
                              />
                              <label
                                htmlFor={field.key}
                                className={cn(
                                  "flex-1 text-sm cursor-pointer",
                                  isRequired && "font-medium text-orange-700"
                                )}
                              >
                                {field.label}
                                {isRequired && (
                                  <span className="ml-1 text-orange-500">*</span>
                                )}
                              </label>
                              {isVisible ? (
                                <Eye className="h-4 w-4 text-blue-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="order" className="flex-1 overflow-auto mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Ordenar Campos Visíveis
                  </CardTitle>
                  <p className="text-xs text-gray-500">
                    Arraste e solte para reordenar os campos conforme aparecem nos cards
                  </p>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="field-order">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          <AnimatePresence>
                            {localFieldOrder
                              .filter(field => localVisibleFields.includes(field))
                              .map((field, index) => (
                                <Draggable 
                                  key={field} 
                                  draggableId={field} 
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={cn(
                                        "flex items-center space-x-3 p-3 bg-white border rounded-lg transition-all",
                                        snapshot.isDragging && "shadow-lg rotate-1 scale-105"
                                      )}
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="cursor-grab active:cursor-grabbing"
                                      >
                                        <GripVertical className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm font-medium">
                                          {FIELD_LABELS[field]}
                                        </span>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {index + 1}
                                      </Badge>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
