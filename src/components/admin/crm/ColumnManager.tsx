
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
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Save } from "lucide-react";
import SortableColumnListItem from "./SortableColumnListItem";
import { Column, Lead } from "@/hooks/useCRMState";

interface ColumnManagerProps {
  isOpen: boolean;
  columns: Column[];
  leads: Lead[];
  onOpenChange: (open: boolean) => void;
  onAddColumn: (name: string) => void;
  onRemoveColumn: (column: Column) => void;
  onReorderColumns: (event: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

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
                      <SortableColumnListItem 
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
