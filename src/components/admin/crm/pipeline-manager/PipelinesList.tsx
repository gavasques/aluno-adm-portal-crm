
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings, Eye, Target } from 'lucide-react';
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
  
  const { createPipeline, updatePipeline, deletePipeline } = useCRMPipelines();

  const handleCreatePipeline = async (data: { name: string; description?: string }) => {
    try {
      await createPipeline({
        name: data.name,
        description: data.description,
        sort_order: pipelines.length,
        is_active: true
      });
      setShowCreateForm(false);
      onRefresh();
      toast.success('Pipeline criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar pipeline');
    }
  };

  const handleUpdatePipeline = async (data: { name: string; description?: string }) => {
    if (!editingPipeline) return;
    
    try {
      await updatePipeline(editingPipeline.id, {
        name: data.name,
        description: data.description
      });
      setEditingPipeline(null);
      onRefresh();
      toast.success('Pipeline atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar pipeline');
    }
  };

  const handleCreateDefaultPipeline = async () => {
    try {
      await createPipeline({
        name: 'Pipeline Padrão',
        description: 'Pipeline inicial do sistema',
        sort_order: 0,
        is_active: true
      });
      onRefresh();
      toast.success('Pipeline padrão criado!');
    } catch (error) {
      toast.error('Erro ao criar pipeline padrão');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Pipelines de Vendas
          </h3>
          <p className="text-gray-600 text-sm">
            {pipelines.length} {pipelines.length === 1 ? 'pipeline' : 'pipelines'}
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pipeline
        </Button>
      </div>

      {/* Pipelines List */}
      {pipelines.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {pipelines.map((pipeline, index) => (
              <motion.div
                key={pipeline.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/40 hover:border-blue-200 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1" onClick={() => onPipelineSelect(pipeline)}>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{pipeline.name}</h4>
                          <Badge variant={pipeline.is_active ? 'default' : 'secondary'}>
                            {pipeline.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        
                        {pipeline.description && (
                          <p className="text-gray-600 text-sm mb-2">{pipeline.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Posição: {pipeline.sort_order + 1}</span>
                          <span>Criado: {new Date(pipeline.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPipelineSelect(pipeline);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                          title="Gerenciar Colunas"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPipeline(pipeline);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                          title="Editar Pipeline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingPipeline(pipeline);
                          }}
                          title="Excluir Pipeline"
                          className="hover:bg-red-50 hover:text-red-600"
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
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum pipeline encontrado
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Crie seu primeiro pipeline para começar a organizar seus leads em estágios de vendas.
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleCreateDefaultPipeline}
              variant="outline"
              className="bg-white/80"
            >
              <Target className="h-4 w-4 mr-2" />
              Criar Pipeline Padrão
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Pipeline
            </Button>
          </div>
        </motion.div>
      )}

      {/* Dialogs */}
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
