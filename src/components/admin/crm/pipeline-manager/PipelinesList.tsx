
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings, Copy } from 'lucide-react';
import { CRMPipeline } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import PipelineFormDialog from './PipelineFormDialog';
import DeletePipelineDialog from './DeletePipelineDialog';

interface PipelinesListProps {
  pipelines: CRMPipeline[];
  loading: boolean;
  onPipelineSelect: (pipeline: CRMPipeline) => void;
  onRefresh: () => void;
}

const PipelinesList = ({ pipelines, loading, onPipelineSelect, onRefresh }: PipelinesListProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<CRMPipeline | null>(null);
  const [deletingPipeline, setDeletingPipeline] = useState<CRMPipeline | null>(null);
  const { createPipeline, updatePipeline } = useCRMPipelines();

  const handleCreatePipeline = async (data: Omit<CRMPipeline, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createPipeline(data);
      setShowCreateForm(false);
      onRefresh();
      toast.success('Pipeline criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar pipeline');
    }
  };

  const handleUpdatePipeline = async (data: Partial<CRMPipeline>) => {
    if (!editingPipeline) return;
    
    try {
      await updatePipeline(editingPipeline.id, data);
      setEditingPipeline(null);
      onRefresh();
      toast.success('Pipeline atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar pipeline');
    }
  };

  const handleDuplicatePipeline = async (pipeline: CRMPipeline) => {
    try {
      const duplicatedData = {
        name: `${pipeline.name} (Cópia)`,
        description: pipeline.description,
        sort_order: pipelines.length,
        is_active: true
      };
      await createPipeline(duplicatedData);
      onRefresh();
      toast.success('Pipeline duplicado com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar pipeline');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Pipelines ({pipelines.length})</h3>
          <p className="text-sm text-gray-500">Gerencie seus fluxos de trabalho</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pipeline
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {pipelines
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((pipeline) => (
              <motion.div
                key={pipeline.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                        {pipeline.description && (
                          <CardDescription className="mt-1">
                            {pipeline.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant={pipeline.is_active ? 'default' : 'secondary'}>
                        {pipeline.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Ordem: {pipeline.sort_order}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPipelineSelect(pipeline)}
                          title="Gerenciar Colunas"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicatePipeline(pipeline)}
                          title="Duplicar Pipeline"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPipeline(pipeline)}
                          title="Editar Pipeline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingPipeline(pipeline)}
                          title="Excluir Pipeline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {pipelines.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum pipeline encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Crie seu primeiro pipeline para começar a organizar seus leads.
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Pipeline
          </Button>
        </div>
      )}

      <PipelineFormDialog
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreatePipeline}
        title="Criar Novo Pipeline"
      />

      <PipelineFormDialog
        open={!!editingPipeline}
        onOpenChange={(open) => !open && setEditingPipeline(null)}
        onSubmit={handleUpdatePipeline}
        title="Editar Pipeline"
        initialData={editingPipeline}
      />

      <DeletePipelineDialog
        pipeline={deletingPipeline}
        open={!!deletingPipeline}
        onOpenChange={(open) => !open && setDeletingPipeline(null)}
        onConfirm={() => {
          setDeletingPipeline(null);
          onRefresh();
        }}
      />
    </div>
  );
};

export default PipelinesList;
