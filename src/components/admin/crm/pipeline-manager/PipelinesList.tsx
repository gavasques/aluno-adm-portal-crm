
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings, Copy, Workflow, ChevronRight } from 'lucide-react';
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { createPipeline, updatePipeline } = useCRMPipelines();

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
      toast.success('Pipeline criado com sucesso!', {
        description: 'Seu novo pipeline está pronto para uso.'
      });
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
      await createPipeline({
        name: `${pipeline.name} (Cópia)`,
        description: pipeline.description,
        sort_order: pipelines.length,
        is_active: true
      });
      onRefresh();
      toast.success('Pipeline duplicado com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar pipeline');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full overflow-auto pb-4">
      {/* Header Compacto */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Pipelines ({pipelines.length})
          </h3>
          <p className="text-gray-600 text-sm">
            Gerencie seus fluxos de trabalho e processos de vendas
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Novo Pipeline
        </Button>
      </motion.div>

      {/* Pipelines Grid */}
      {pipelines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {pipelines
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((pipeline, index) => (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onHoverStart={() => setHoveredCard(pipeline.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="relative overflow-hidden cursor-pointer group bg-white/70 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                              <CardTitle className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {pipeline.name}
                              </CardTitle>
                            </div>
                            {pipeline.description && (
                              <CardDescription className="text-gray-600 line-clamp-2 text-sm">
                                {pipeline.description}
                              </CardDescription>
                            )}
                          </div>
                          <Badge 
                            variant={pipeline.is_active ? 'default' : 'secondary'}
                            className={`
                              font-medium transition-all duration-300 text-xs
                              ${pipeline.is_active 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
                                : 'bg-gray-200 text-gray-600'
                              }
                            `}
                          >
                            {pipeline.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Workflow className="h-3 w-3" />
                            <span>Ordem: {pipeline.sort_order}</span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPipelineSelect(pipeline)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 group/btn text-xs h-7"
                          >
                            <span className="mr-1">Configurar</span>
                            <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className={`
                          flex items-center gap-1 transition-all duration-300
                          ${hoveredCard === pipeline.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                        `}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicatePipeline(pipeline);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600 h-7 w-7 p-0"
                            title="Duplicar Pipeline"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPipeline(pipeline);
                            }}
                            className="hover:bg-yellow-50 hover:text-yellow-600 h-7 w-7 p-0"
                            title="Editar Pipeline"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingPipeline(pipeline);
                            }}
                            className="hover:bg-red-50 hover:text-red-600 h-7 w-7 p-0"
                            title="Excluir Pipeline"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Workflow className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Nenhum pipeline encontrado
          </h3>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            Crie seu primeiro pipeline para começar a organizar seus leads e processos de vendas.
          </p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Pipeline
          </Button>
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
