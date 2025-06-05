
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  EyeOff, 
  GripVertical, 
  RotateCcw,
  Save,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { CRMLeadCardField } from '@/types/crm.types';
import { useCRMCardPreferences } from '@/hooks/crm/useCRMCardPreferences';

interface CRMCardConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mapeamento de campos para labels legíveis
const FIELD_LABELS: Record<CRMLeadCardField, string> = {
  name: 'Nome',
  status: 'Status',
  responsible: 'Responsável',
  phone: 'Telefone',
  email: 'Email',
  pipeline: 'Pipeline',
  column: 'Coluna/Estágio',
  tags: 'Tags',
  created_at: 'Data de Criação',
  updated_at: 'Última Atualização',
  notes: 'Observações',
  source: 'Origem',
  value: 'Valor',
  company: 'Empresa',
  position: 'Cargo',
  website: 'Website',
  address: 'Endereço',
  city: 'Cidade',
  state: 'Estado',
  country: 'País',
  zipcode: 'CEP'
};

// Configurações padrão
const DEFAULT_FIELDS: CRMLeadCardField[] = [
  'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
];

export const CRMCardConfigDialog: React.FC<CRMCardConfigDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { preferences, isLoading, isSaving, updatePreferences } = useCRMCardPreferences();
  
  // Estados locais para edição
  const [localVisibleFields, setLocalVisibleFields] = useState<CRMLeadCardField[]>(
    preferences.visible_fields || DEFAULT_FIELDS
  );
  const [localFieldOrder, setLocalFieldOrder] = useState<CRMLeadCardField[]>(
    preferences.field_order || DEFAULT_FIELDS
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar com preferências quando mudarem
  React.useEffect(() => {
    if (preferences.visible_fields) {
      setLocalVisibleFields(preferences.visible_fields);
    }
    if (preferences.field_order) {
      setLocalFieldOrder(preferences.field_order);
    }
  }, [preferences]);

  // Todos os campos disponíveis
  const ALL_FIELDS: CRMLeadCardField[] = Object.keys(FIELD_LABELS) as CRMLeadCardField[];

  const handleFieldToggle = (field: CRMLeadCardField) => {
    const newVisibleFields = localVisibleFields.includes(field)
      ? localVisibleFields.filter(f => f !== field)
      : [...localVisibleFields, field];
    
    setLocalVisibleFields(newVisibleFields);
    setHasChanges(true);
    console.log('🔧 [CARD_CONFIG] Campo alternado:', field, 'Visível:', !localVisibleFields.includes(field));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localFieldOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalFieldOrder(items);
    setHasChanges(true);
    console.log('🔄 [CARD_CONFIG] Ordem alterada:', items);
  };

  const handleSave = async () => {
    console.log('💾 [CARD_CONFIG] Salvando configurações:', {
      visible_fields: localVisibleFields,
      field_order: localFieldOrder
    });

    await updatePreferences({
      visible_fields: localVisibleFields,
      field_order: localFieldOrder
    });

    setHasChanges(false);
  };

  const handleReset = () => {
    console.log('🔄 [CARD_CONFIG] Resetando para padrão');
    setLocalVisibleFields(DEFAULT_FIELDS);
    setLocalFieldOrder(DEFAULT_FIELDS);
    setHasChanges(true);
  };

  const handleCancel = () => {
    // Restaurar valores originais
    setLocalVisibleFields(preferences.visible_fields || DEFAULT_FIELDS);
    setLocalFieldOrder(preferences.field_order || DEFAULT_FIELDS);
    setHasChanges(false);
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Carregando configurações...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={hasChanges ? undefined : onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração dos Cards de Lead
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Painel de Campos Disponíveis */}
            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Campos Disponíveis
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Selecione os campos que devem aparecer nos cards
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    {ALL_FIELDS.map((field) => (
                      <div
                        key={field}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={field}
                          checked={localVisibleFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field)}
                        />
                        <label
                          htmlFor={field}
                          className="flex-1 text-sm font-medium cursor-pointer"
                        >
                          {FIELD_LABELS[field]}
                        </label>
                        {localVisibleFields.includes(field) ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Painel de Ordenação */}
            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GripVertical className="h-4 w-4" />
                  Ordem dos Campos
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Arraste para reordenar os campos nos cards
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="field-order">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-colors ${
                            snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                          }`}
                        >
                          <AnimatePresence>
                            {localFieldOrder.map((field, index) => (
                              <Draggable
                                key={field}
                                draggableId={field}
                                index={index}
                                isDragDisabled={!localVisibleFields.includes(field)}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -20 }}
                                      className={`p-3 rounded-lg border transition-all ${
                                        snapshot.isDragging
                                          ? 'bg-white shadow-lg border-blue-300 rotate-2 scale-105'
                                          : localVisibleFields.includes(field)
                                          ? 'bg-white border-gray-200 hover:border-blue-300'
                                          : 'bg-gray-100 border-gray-200 opacity-50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          {...provided.dragHandleProps}
                                          className={`cursor-grab active:cursor-grabbing ${
                                            !localVisibleFields.includes(field) ? 'cursor-not-allowed' : ''
                                          }`}
                                        >
                                          <GripVertical
                                            className={`h-4 w-4 ${
                                              localVisibleFields.includes(field) ? 'text-gray-400' : 'text-gray-300'
                                            }`}
                                          />
                                        </div>
                                        <span
                                          className={`flex-1 text-sm font-medium ${
                                            localVisibleFields.includes(field) ? 'text-gray-900' : 'text-gray-500'
                                          }`}
                                        >
                                          {FIELD_LABELS[field]}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                          {index + 1}
                                        </Badge>
                                        {localVisibleFields.includes(field) ? (
                                          <Eye className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <EyeOff className="h-4 w-4 text-gray-400" />
                                        )}
                                      </div>
                                    </motion.div>
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
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Rodapé com ações */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar Padrão
            </Button>
            <Badge variant="secondary" className="text-xs">
              {localVisibleFields.length} campos visíveis
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
