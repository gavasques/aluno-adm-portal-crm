
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, GripVertical, Eye, Columns, Target } from 'lucide-react';
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
    <motion.div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      layout
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/40 hover:border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm" 
                style={{ backgroundColor: column.color }}
              />
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{column.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">Posição: {column.sort_order + 1}</span>
                  <Badge variant={column.is_active ? 'default' : 'secondary'} className="text-xs">
                    {column.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(column)}
                className="hover:bg-blue-50 hover:text-blue-600"
                title="Editar Coluna"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(column)}
                title="Excluir Coluna"
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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

      try {
        for (let i = 0; i < newColumns.length; i++) {
          await updateColumn(newColumns[i].id, { sort_order: i });
        }
        await fetchColumns(pipeline.id);
        toast.success('Ordem das colunas atualizada!');
      } catch (error) {
        toast.error('Erro ao reordenar colunas');
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
    <div className="space-y-6 h-full overflow-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Columns className="h-6 w-6 text-blue-600" />
              Colunas do Pipeline
            </h3>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold text-blue-600">{pipeline.name}</span> • 
              {columns.length} {columns.length === 1 ? ' coluna' : ' colunas'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Coluna
          </Button>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Columns List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-white/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Colunas do Pipeline
              </CardTitle>
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
                    <div className="space-y-3">
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
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma coluna encontrada
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Adicione colunas para organizar os estágios do seu pipeline.
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Coluna
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-white/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Preview do Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PipelinePreview pipeline={pipeline} columns={columns} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
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
