
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Save, GripVertical, Trash2 } from "lucide-react";
import { CRMPipelineColumn } from "@/types/crm.types";
import { useCRMPipelines } from "@/hooks/crm/useCRMPipelines";

interface ColumnManagerProps {
  pipelineId: string;
  onRefresh?: () => void;
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

const ColumnManager = ({ pipelineId, onRefresh }: ColumnManagerProps) => {
  const [newColumnName, setNewColumnName] = useState("");
  const { 
    columns, 
    createColumn, 
    deleteColumn, 
    updateColumn,
    refetch 
  } = useCRMPipelines();
  
  // Configure DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );
  
  const handleAddColumn = async () => {
    if (newColumnName.trim()) {
      try {
        // Get the next sort order
        const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);
        const nextSortOrder = pipelineColumns.length > 0 
          ? Math.max(...pipelineColumns.map(col => col.sort_order)) + 1 
          : 0;

        await createColumn({
          name: newColumnName,
          pipeline_id: pipelineId,
          sort_order: nextSortOrder,
          is_active: true,
          color: '#6b7280'
        });
        
        setNewColumnName("");
        onRefresh?.();
      } catch (error) {
        console.error('Error creating column:', error);
      }
    }
  };

  const handleReorderColumns = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);
    const oldIndex = pipelineColumns.findIndex(col => col.id === active.id);
    const newIndex = pipelineColumns.findIndex(col => col.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedColumns = [...pipelineColumns];
    const [movedColumn] = reorderedColumns.splice(oldIndex, 1);
    reorderedColumns.splice(newIndex, 0, movedColumn);

    // Update sort orders
    try {
      for (let i = 0; i < reorderedColumns.length; i++) {
        if (reorderedColumns[i].sort_order !== i) {
          await updateColumn(reorderedColumns[i].id, { sort_order: i });
        }
      }
      onRefresh?.();
    } catch (error) {
      console.error('Error reordering columns:', error);
    }
  };

  const handleRemoveColumn = async (column: CRMPipelineColumn) => {
    try {
      await deleteColumn(column.id);
      onRefresh?.();
    } catch (error) {
      console.error('Error removing column:', error);
    }
  };

  const handleSave = () => {
    refetch();
    onRefresh?.();
  };

  const handleCancel = () => {
    onRefresh?.();
  };

  // Filter columns for the current pipeline
  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  return (
    <div className="space-y-6">
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
          onDragEnd={handleReorderColumns}
        >
          <SortableContext 
            items={pipelineColumns.map(col => col.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {pipelineColumns.map(column => (
                <SortableColumnItem 
                  key={column.id} 
                  column={column} 
                  leadCount={0} // We don't have leads data here, so showing 0
                  onRemove={handleRemoveColumn} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex flex-row justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleSave} className="flex gap-2">
          <Save size={16} />
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default ColumnManager;
