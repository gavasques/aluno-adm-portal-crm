
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { useCRMLossReasons } from '@/hooks/crm/useCRMLossReasons';
import { CRMLossReason } from '@/types/crm.types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LossReasonFormData {
  name: string;
  description: string;
}

const SortableReasonItem = ({ reason, onEdit, onDelete }: {
  reason: CRMLossReason;
  onEdit: (reason: CRMLossReason) => void;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: reason.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{reason.name}</span>
          <Badge variant="outline" className="text-xs">
            #{reason.sort_order}
          </Badge>
        </div>
        {reason.description && (
          <p className="text-sm text-gray-600">{reason.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(reason)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(reason.id)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const LossReasonsManager = () => {
  const { lossReasons, createLossReason, updateLossReason, deleteLossReason, updateSortOrder, isLoading } = useCRMLossReasons();
  const [showDialog, setShowDialog] = useState(false);
  const [editingReason, setEditingReason] = useState<CRMLossReason | null>(null);
  const [formData, setFormData] = useState<LossReasonFormData>({
    name: '',
    description: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOpenDialog = (reason?: CRMLossReason) => {
    if (reason) {
      setEditingReason(reason);
      setFormData({
        name: reason.name,
        description: reason.description || ''
      });
    } else {
      setEditingReason(null);
      setFormData({ name: '', description: '' });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingReason(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingReason) {
      updateLossReason({
        id: editingReason.id,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || null
        }
      });
    } else {
      const maxSortOrder = Math.max(...lossReasons.map(r => r.sort_order), 0);
      createLossReason({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        is_active: true,
        sort_order: maxSortOrder + 1
      });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este motivo de perda?')) {
      deleteLossReason(id);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = lossReasons.findIndex(reason => reason.id === active.id);
      const newIndex = lossReasons.findIndex(reason => reason.id === over.id);

      const newOrder = arrayMove(lossReasons, oldIndex, newIndex);
      const updatedReasons = newOrder.map((reason, index) => ({
        id: reason.id,
        sort_order: index + 1
      }));

      updateSortOrder(updatedReasons);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Motivos de Perda</CardTitle>
          <CardDescription>Carregando motivos...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Motivos de Perda</CardTitle>
              <CardDescription>
                Gerencie os motivos disponíveis quando um lead é marcado como "Perdido"
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Motivo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lossReasons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum motivo de perda cadastrado</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={lossReasons.map(r => r.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {lossReasons.map((reason) => (
                    <SortableReasonItem
                      key={reason.id}
                      reason={reason}
                      onEdit={handleOpenDialog}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingReason ? 'Editar' : 'Adicionar'} Motivo de Perda
            </DialogTitle>
            <DialogDescription>
              {editingReason 
                ? 'Edite as informações do motivo de perda'
                : 'Adicione um novo motivo para quando leads são marcados como perdidos'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Motivo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Sem interesse"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição opcional do motivo"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              {editingReason ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
