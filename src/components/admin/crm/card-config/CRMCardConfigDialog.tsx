
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, Droppable, Draggable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { CRMLeadCardField, CRMLeadCardFieldConfig } from '@/types/crm.types';
import { useCRMCardPreferences } from '@/hooks/crm/useCRMCardPreferences';

interface CRMCardConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FIELD_CONFIGS: CRMLeadCardFieldConfig[] = [
  // Essenciais (não podem ser removidos)
  { key: 'name', label: 'Nome do Lead', category: 'essencial', isRequired: true },
  { key: 'status', label: 'Status', category: 'essencial', isRequired: true },
  { key: 'responsible', label: 'Responsável', category: 'essencial', isRequired: true },
  
  // Contato
  { key: 'phone', label: 'Telefone', category: 'contato' },
  { key: 'email', label: 'Email', category: 'contato' },
  
  // Pipeline
  { key: 'pipeline', label: 'Pipeline', category: 'sistema' },
  { key: 'column', label: 'Estágio', category: 'sistema' },
  { key: 'tags', label: 'Tags', category: 'sistema' },
  
  // Qualificação
  { key: 'has_company', label: 'Tem Empresa', category: 'qualificacao' },
  { key: 'sells_on_amazon', label: 'Vende na Amazon', category: 'qualificacao' },
  { key: 'works_with_fba', label: 'Trabalha com FBA', category: 'qualificacao' },
  { key: 'seeks_private_label', label: 'Busca Marca Própria', category: 'qualificacao' },
  { key: 'ready_to_invest_3k', label: 'Pronto para Investir 3k', category: 'qualificacao' },
  { key: 'calendly_scheduled', label: 'Calendly Agendado', category: 'qualificacao' },
  
  // Amazon
  { key: 'what_sells', label: 'O que Vende', category: 'amazon' },
  { key: 'amazon_state', label: 'Estado Amazon', category: 'amazon' },
  
  // Sistema
  { key: 'created_at', label: 'Data de Criação', category: 'sistema' },
  { key: 'updated_at', label: 'Última Atualização', category: 'sistema' },
  { key: 'scheduled_contact_date', label: 'Próximo Contato', category: 'sistema' }
];

const CATEGORY_LABELS = {
  essencial: 'Campos Essenciais',
  contato: 'Informações de Contato',
  qualificacao: 'Qualificação',
  amazon: 'Informações Amazon',
  sistema: 'Sistema'
};

const CATEGORY_COLORS = {
  essencial: 'bg-red-100 text-red-800',
  contato: 'bg-blue-100 text-blue-800',
  qualificacao: 'bg-green-100 text-green-800',
  amazon: 'bg-orange-100 text-orange-800',
  sistema: 'bg-gray-100 text-gray-800'
};

interface SortableFieldItemProps {
  field: CRMLeadCardFieldConfig;
  isVisible: boolean;
  onToggle: (fieldKey: CRMLeadCardField) => void;
}

const SortableFieldItem: React.FC<SortableFieldItemProps> = ({ field, isVisible, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border rounded-lg bg-white ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <Checkbox
        id={field.key}
        checked={isVisible}
        onCheckedChange={() => !field.isRequired && onToggle(field.key)}
        disabled={field.isRequired}
        className="flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Label 
            htmlFor={field.key} 
            className={`text-sm font-medium cursor-pointer ${
              field.isRequired ? 'text-gray-600' : 'text-gray-900'
            }`}
          >
            {field.label}
          </Label>
          {field.isRequired && (
            <Badge variant="secondary" className="text-xs">
              Obrigatório
            </Badge>
          )}
        </div>
        {field.description && (
          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
        )}
      </div>
      
      <Badge className={`text-xs ${CATEGORY_COLORS[field.category]}`}>
        {CATEGORY_LABELS[field.category]}
      </Badge>
      
      <div className="flex-shrink-0 w-6 flex justify-center">
        {isVisible ? (
          <Eye className="h-4 w-4 text-green-600" />
        ) : (
          <EyeOff className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  );
};

export const CRMCardConfigDialog: React.FC<CRMCardConfigDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { preferences, updatePreferences, isSaving } = useCRMCardPreferences();
  const [localVisibleFields, setLocalVisibleFields] = useState<CRMLeadCardField[]>(
    preferences.visible_fields
  );
  const [localFieldOrder, setLocalFieldOrder] = useState<CRMLeadCardField[]>(
    preferences.field_order
  );

  React.useEffect(() => {
    if (preferences) {
      setLocalVisibleFields(preferences.visible_fields);
      setLocalFieldOrder(preferences.field_order);
    }
  }, [preferences]);

  const handleToggleField = (fieldKey: CRMLeadCardField) => {
    setLocalVisibleFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSave = () => {
    updatePreferences(localVisibleFields, localFieldOrder);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalVisibleFields(preferences.visible_fields);
    setLocalFieldOrder(preferences.field_order);
    onOpenChange(false);
  };

  const orderedFields = FIELD_CONFIGS.sort((a, b) => {
    const aIndex = localFieldOrder.indexOf(a.key);
    const bIndex = localFieldOrder.indexOf(b.key);
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });

  const visibleCount = localVisibleFields.length;
  const totalCount = FIELD_CONFIGS.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Configurar Campos do Card</DialogTitle>
          <DialogDescription>
            Personalize quais campos são exibidos nos cards dos leads. 
            Arraste para reordenar os campos conforme sua preferência.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Campos visíveis: <strong>{visibleCount}</strong> de {totalCount}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocalVisibleFields(FIELD_CONFIGS.map(f => f.key))}
                >
                  Mostrar Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocalVisibleFields(
                    FIELD_CONFIGS.filter(f => f.isRequired).map(f => f.key)
                  )}
                >
                  Apenas Essenciais
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {orderedFields.map((field) => (
              <SortableFieldItem
                key={field.key}
                field={field}
                isVisible={localVisibleFields.includes(field.key)}
                onToggle={handleToggleField}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
