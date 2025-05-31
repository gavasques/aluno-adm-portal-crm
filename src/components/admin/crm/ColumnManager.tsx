
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Save, GripVertical, Trash2 } from "lucide-react";
import { CRMPipelineColumn } from "@/types/crm.types";

interface ColumnManagerProps {
  isOpen: boolean;
  columns: CRMPipelineColumn[];
  leads: any[];
  onOpenChange: (open: boolean) => void;
  onAddColumn: (name: string) => void;
  onRemoveColumn: (column: CRMPipelineColumn) => void;
  onReorderColumns: (event: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

interface SortableColumnItemProps {
  column: CRMPipelineColumn;
  leadCount: number;
  onRemove: (column: CRMPipelineColumn) => void;
}

const SortableColumnItem = ({ column, leadCount, onRemove }: SortableColumnItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
    >
      <div
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      
      <div 
        className="w-3 h-3 rounded-full flex-shrink-0" 
        style={{ backgroundColor: column.color }}
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{column.name}</h4>
        <p className="text-sm text-gray-500">{leadCount} leads</p>
      </div>
      
      <Badge variant={column.is_active ? 'default' : 'secondary'} className="text-xs">
        {column.is_active ? 'Ativa' : 'Inativa'}
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(column)}
        className="hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ColumnManager = ({ 
  isOpen, 
  columns, 
  leads, 
  onOpenChange, 
  onAddColumn, 
  onRemoveColumn, 
  onReorderColumns, 
  onSave, 
  onCancel 
}: ColumnManagerProps) => {
  const [newColumnName, setNewColumnName] = useState("");
  
  // Configure DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );
  
  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      onAddColumn(newColumnName);
      setNewColumnName("");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Gerenciar Colunas</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Adicionar Nova Coluna</h3>
            <div className="flex gap-2">
              <Input 
                placeholder="Nome da coluna" 
                value={newColumnName} 
                onChange={e => setNewColumnName(e.target.value)} 
              />
              <Button onClick={handleAddColumn}>Adicionar</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-medium">Ordenar e Excluir Colunas</h3>
            <p className="text-sm text-muted-foreground">
              Arraste para reordenar ou clique no ícone de lixeira para excluir.
            </p>
            
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={onReorderColumns}
            >
              <SortableContext 
                items={columns.map(col => col.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {columns.map(column => {
                    const leadCount = leads.filter(lead => lead.column === column.id).length;
                    return (
                      <SortableColumnItem 
                        key={column.id} 
                        column={column} 
                        leadCount={leadCount} 
                        onRemove={onRemoveColumn} 
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <SheetFooter className="flex flex-row justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onSave} className="flex gap-2">
            <Save size={16} />
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ColumnManager;
