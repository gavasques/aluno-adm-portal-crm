import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, Settings } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { ManualFieldMappingDialog } from './ManualFieldMappingDialog';
import { EditFieldMappingDialog } from './EditFieldMappingDialog';
import { ImportFieldsDialog } from './ImportFieldsDialog';
import { toast } from 'sonner';

export const WebhookFieldMappingsCard = () => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const { pipelines } = useCRMPipelines();
  const { 
    mappings, 
    isLoading, 
    syncStandardMappings, 
    deleteMapping,
    updateMapping 
  } = useCRMWebhookFieldMappings(selectedPipelineId);

  const handleSyncStandardMappings = async () => {
    if (!selectedPipelineId) {
      toast.error('Selecione um pipeline primeiro');
      return;
    }

    try {
      await syncStandardMappings.mutateAsync(selectedPipelineId);
    } catch (error) {
      console.error('Erro ao sincronizar mapeamentos:', error);
    }
  };

  const handleDeleteMapping = async (mappingId: string) => {
    if (confirm('Tem certeza que deseja remover este mapeamento?')) {
      try {
        await deleteMapping.mutateAsync(mappingId);
      } catch (error) {
        console.error('Erro ao remover mapeamento:', error);
      }
    }
  };

  const handleToggleActive = async (mappingId: string, currentStatus: boolean) => {
    try {
      await updateMapping.mutateAsync({
        id: mappingId,
        input: { is_active: !currentStatus }
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const getFieldTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      phone: 'bg-purple-100 text-purple-800',
      boolean: 'bg-yellow-100 text-yellow-800',
      number: 'bg-orange-100 text-orange-800',
      select: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Mapeamento de Campos
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure como os campos do webhook são mapeados para os campos do CRM
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Pipeline */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
              <SelectTrigger>
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
          </div>
          
          <Button
            variant="outline"
            onClick={handleSyncStandardMappings}
            disabled={!selectedPipelineId || syncStandardMappings.isPending}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncStandardMappings.isPending ? 'animate-spin' : ''}`} />
            Sincronizar Campo Obrigatório
          </Button>

          <ImportFieldsDialog 
            pipelineId={selectedPipelineId}
            trigger={
              <Button
                variant="secondary"
                disabled={!selectedPipelineId}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Importar do JSON
              </Button>
            }
          />

          <ManualFieldMappingDialog 
            pipelineId={selectedPipelineId}
            trigger={
              <Button
                variant="default"
                disabled={!selectedPipelineId}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Mapeamento
              </Button>
            }
          />
        </div>

        {/* Lista de Mapeamentos */}
        {selectedPipelineId && (
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : mappings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhum mapeamento encontrado</p>
                <p className="text-sm">
                  Clique em "Sincronizar Campo Obrigatório" para criar o mapeamento básico do campo Nome
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mappings.map(mapping => (
                  <div
                    key={mapping.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      mapping.is_active 
                        ? 'bg-white border-gray-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {mapping.webhook_field_name}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium">
                              {mapping.crm_field_type === 'custom' && mapping.custom_field
                                ? mapping.custom_field.field_name
                                : mapping.crm_field_name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={getFieldTypeColor(mapping.field_type)}
                            >
                              {mapping.field_type}
                            </Badge>
                            
                            {mapping.crm_field_type === 'custom' && (
                              <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                                Customizado
                              </Badge>
                            )}
                            
                            {mapping.is_required && (
                              <Badge variant="destructive" className="text-xs">
                                Obrigatório
                              </Badge>
                            )}
                          </div>
                        </div>

                        {Object.keys(mapping.transformation_rules || {}).length > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Regras:</span> {JSON.stringify(mapping.transformation_rules)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        <EditFieldMappingDialog
                          mapping={mapping}
                          pipelineId={selectedPipelineId}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(mapping.id, mapping.is_active)}
                          disabled={updateMapping.isPending}
                        >
                          {mapping.is_active ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>

                        {mapping.crm_field_name !== 'name' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMapping(mapping.id)}
                            disabled={deleteMapping.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
