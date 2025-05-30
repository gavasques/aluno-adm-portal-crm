
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, GripVertical, Eye } from 'lucide-react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CRMPipeline, CRMPipelineColumn } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ColumnFormDialog from './ColumnFormDialog';
import DeleteColumnDialog from './DeleteColumnDialog';
import PipelinePreview from './PipelinePreview';

interface ColumnsManagerProps {
  pipeline: CRMPipeline;
  onBack: () => void;
  onRefresh: () => void;
}

interface SortableColumnItemProps {
  column: CRMPipelineColumn;
  onEdit: (column: CRMPipelineColumn) => void;
  onDelete: (column: CRMPipelineColumn) => void;
}

const SortableColumnItem = ({ column, onEdit, onDelete }: SortableColumnItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="hover:shadow-md transition-shadow group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm" 
                style={{ backgroundColor: column.color }}
              />
              
              <div className="flex-1">
                <h4 className="font-medium">{column.name}</h4>
                <p className="text-sm text-gray-500">Posição: {column.sort_order}</p>
              </div>
              
              <Badge variant={column.is_active ? 'default' : 'secondary'}>
                {column.is_active ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(column)}
                title="Editar Coluna"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(column)}
                title="Excluir Coluna"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ColumnsManager = ({ pipeline, onBack, onRefresh }: ColumnsManagerProps) => {
  const [columns, setColumns] = useState<CRMPipelineColumn[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CRMPipelineColumn | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<CRMPipelineColumn | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const { 
    columns: allColumns, 
    createColumn, 
    updateColumn,
    fetchColumns 
  } = useCRMPipelines();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  React.useEffect(() => {
    const pipelineColumns = allColumns
      .filter(col => col.pipeline_id === pipeline.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    setColumns(pipelineColumns);
  }, [allColumns, pipeline.id]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex(col => col.id === active.id);
      const newIndex = columns.findIndex(col => col.id === over.id);
      
      const newColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(newColumns);

      // Atualizar sort_order no backend
      try {
        for (let i = 0; i < newColumns.length; i++) {
          await updateColumn(newColumns[i].id, { sort_order: i });
        }
        await fetchColumns(pipeline.id);
        toast.success('Ordem das colunas atualizada!');
      } catch (error) {
        toast.error('Erro ao reordenar colunas');
        // Reverter mudanças locais em caso de erro
        setColumns(columns);
      }
    }
  };

  const handleCreateColumn = async (data: Omit<CRMPipelineColumn, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createColumn({
        ...data,
        pipeline_id: pipeline.id,
        sort_order: columns.length
      });
      setShowCreateForm(false);
      await fetchColumns(pipeline.id);
      toast.success('Coluna criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar coluna');
    }
  };

  const handleUpdateColumn = async (data: Partial<CRMPipelineColumn>) => {
    if (!editingColumn) return;
    
    try {
      await updateColumn(editingColumn.id, data);
      setEditingColumn(null);
      await fetchColumns(pipeline.id);
      toast.success('Coluna atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar coluna');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h3 className="text-lg font-semibold">
              Colunas do Pipeline: {pipeline.name}
            </h3>
            <p className="text-sm text-gray-500">
              {columns.length} {columns.length === 1 ? 'coluna' : 'colunas'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Coluna
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Colunas do Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              {columns.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={columns.map(col => col.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      <AnimatePresence>
                        {columns.map((column) => (
                          <motion.div
                            key={column.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <SortableColumnItem
                              column={column}
                              onEdit={setEditingColumn}
                              onDelete={setDeletingColumn}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Plus className="h-12 w-12 mx-auto" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma coluna encontrada
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Adicione colunas para organizar os estágios do seu pipeline.
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Coluna
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview do Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <PipelinePreview pipeline={pipeline} columns={columns} />
            </CardContent>
          </Card>
        </div>
      </div>

      <ColumnFormDialog
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateColumn}
        title="Criar Nova Coluna"
      />

      <ColumnFormDialog
        open={!!editingColumn}
        onOpenChange={(open) => !open && setEditingColumn(null)}
        onSubmit={handleUpdateColumn}
        title="Editar Coluna"
        initialData={editingColumn}
      />

      <DeleteColumnDialog
        column={deletingColumn}
        open={!!deletingColumn}
        onOpenChange={(open) => !open && setDeletingColumn(null)}
        onConfirm={() => {
          setDeletingColumn(null);
          fetchColumns(pipeline.id);
        }}
      />

      <PipelinePreview
        pipeline={pipeline}
        columns={columns}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </div>
  );
};

export default ColumnsManager;
