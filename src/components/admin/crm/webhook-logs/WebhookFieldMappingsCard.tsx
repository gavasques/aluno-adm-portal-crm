
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Sync, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit,
  Trash2,
  AlertCircle 
} from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualFieldMappingDialog } from './ManualFieldMappingDialog';
import { EditFieldMappingDialog } from './EditFieldMappingDialog';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const WebhookFieldMappingsCard = () => {
  const { pipelines } = useCRMPipelines();
  const [selectedPipelineId, setSelectedPipelineId] = React.useState<string>('');
  
  const { 
    mappings, 
    isLoading, 
    syncStandardMappings, 
    updateMapping, 
    deleteMapping 
  } = useCRMWebhookFieldMappings(selectedPipelineId);

  const handleSync = async () => {
    if (!selectedPipelineId) {
      toast.error('Selecione um pipeline primeiro');
      return;
    }
    
    await syncStandardMappings.mutateAsync(selectedPipelineId);
  };

  const handleToggleActive = async (mappingId: string, currentActive: boolean) => {
    await updateMapping.mutateAsync({
      id: mappingId,
      input: { is_active: !currentActive }
    });
  };

  const handleDelete = async (mappingId: string, fieldName: string) => {
    if (fieldName === 'name') {
      toast.error('O campo nome é obrigatório e não pode ser removido');
      return;
    }
    
    if (confirm('Tem certeza que deseja remover este mapeamento?')) {
      await deleteMapping.mutateAsync(mappingId);
    }
  };

  const requiredMappings = mappings.filter(m => m.is_required);
  const optionalMappings = mappings.filter(m => !m.is_required);
  const activePipeline = pipelines.find(p => p.id === selectedPipelineId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Mapeamento de Campos do Webhook</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione um pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map(pipeline => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPipelineId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  disabled={syncStandardMappings.isPending}
                >
                  <Sync className="h-4 w-4 mr-2" />
                  Sincronizar Campo Obrigatório
                </Button>
                
                <ManualFieldMappingDialog 
                  pipelineId={selectedPipelineId}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Mapeamento
                    </Button>
                  }
                />
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!selectedPipelineId ? (
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione um pipeline para visualizar os mapeamentos</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* URL do Webhook */}
            {activePipeline && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">URL do Webhook</h4>
                <code className="text-sm bg-white p-2 rounded border block break-all">
                  {`${window.location.origin}/api/webhook/crm/${activePipeline.id}`}
                </code>
              </div>
            )}

            {/* Campos Obrigatórios */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h4 className="font-medium text-gray-900">Campos Obrigatórios</h4>
                <Badge variant="secondary" className="text-xs">
                  {requiredMappings.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {requiredMappings.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">
                    Nenhum campo obrigatório mapeado. Clique em "Sincronizar Campo Obrigatório" para adicionar o campo nome.
                  </div>
                ) : (
                  requiredMappings.map((mapping, index) => (
                    <motion.div
                      key={mapping.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive" className="text-xs">
                          Obrigatório
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">
                            {mapping.webhook_field_name} → {mapping.crm_field_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Tipo: {mapping.field_type} | 
                            Status: {mapping.is_active ? 'Ativo' : 'Inativo'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <EditFieldMappingDialog 
                          mapping={mapping}
                          pipelineId={selectedPipelineId}
                          trigger={
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          }
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleToggleActive(mapping.id, mapping.is_active)}
                        >
                          {mapping.is_active ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Campos Opcionais */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium text-gray-900">Campos Opcionais</h4>
                <Badge variant="secondary" className="text-xs">
                  {optionalMappings.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {optionalMappings.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">
                    Nenhum campo opcional mapeado. Use "Adicionar Mapeamento" para mapear campos como email, telefone, etc.
                  </div>
                ) : (
                  optionalMappings.map((mapping, index) => (
                    <motion.div
                      key={mapping.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          Opcional
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">
                            {mapping.webhook_field_name} → {mapping.crm_field_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Tipo: {mapping.field_type} | 
                            Status: {mapping.is_active ? 'Ativo' : 'Inativo'} |
                            Campo: {mapping.crm_field_type === 'custom' ? 'Customizado' : 'Padrão'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <EditFieldMappingDialog 
                          mapping={mapping}
                          pipelineId={selectedPipelineId}
                          trigger={
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          }
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleToggleActive(mapping.id, mapping.is_active)}
                        >
                          {mapping.is_active ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(mapping.id, mapping.crm_field_name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Resumo */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p><strong>Resumo:</strong> {mappings.length} campo(s) mapeado(s) para este pipeline.</p>
              <p><strong>Obrigatórios:</strong> {requiredMappings.length} | <strong>Opcionais:</strong> {optionalMappings.length}</p>
              <p><strong>Ativos:</strong> {mappings.filter(m => m.is_active).length} | <strong>Inativos:</strong> {mappings.filter(m => !m.is_active).length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
