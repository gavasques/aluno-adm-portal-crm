
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { ManualFieldMappingDialog } from './ManualFieldMappingDialog';
import { RefreshCw, Settings, Eye, EyeOff, Plus, Edit, Trash2 } from 'lucide-react';

export const WebhookFieldMappingsCard = () => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const { pipelines } = useCRMPipelines();
  const { mappings, isLoading: mappingsLoading, syncStandardMappings, deleteMapping, updateMapping } = useCRMWebhookFieldMappings(selectedPipelineId);
  const { customFields } = useCRMCustomFields();

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  const handleSyncMappings = () => {
    if (selectedPipelineId) {
      syncStandardMappings.mutate(selectedPipelineId);
    }
  };

  const handleToggleMapping = (mappingId: string, currentStatus: boolean) => {
    updateMapping.mutate({
      id: mappingId,
      input: { is_active: !currentStatus }
    });
  };

  const handleDeleteMapping = (mappingId: string) => {
    deleteMapping.mutate(mappingId);
  };

  // Separar campos obrigatórios (automáticos) dos opcionais (manuais)
  const requiredMappings = mappings.filter(m => 
    ['name', 'email', 'phone'].includes(m.crm_field_name) && m.crm_field_type === 'standard'
  );
  
  const optionalMappings = mappings.filter(m => 
    !['name', 'email', 'phone'].includes(m.crm_field_name) || m.crm_field_type === 'custom'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Mapeamentos de Campos do Webhook
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Pipeline */}
        <div className="flex items-center gap-4">
          <select
            value={selectedPipelineId}
            onChange={(e) => setSelectedPipelineId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Selecione um pipeline</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
          
          {selectedPipelineId && (
            <div className="flex gap-2">
              <Button 
                onClick={handleSyncMappings}
                disabled={syncStandardMappings.isPending}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${syncStandardMappings.isPending ? 'animate-spin' : ''}`} />
                Sincronizar Obrigatórios
              </Button>
              
              <ManualFieldMappingDialog pipelineId={selectedPipelineId} />
            </div>
          )}
        </div>

        {selectedPipelineId && (
          <Tabs defaultValue="required" className="w-full">
            <TabsList>
              <TabsTrigger value="required">Campos Obrigatórios ({requiredMappings.length})</TabsTrigger>
              <TabsTrigger value="optional">Campos Opcionais ({optionalMappings.filter(m => m.is_active).length})</TabsTrigger>
              <TabsTrigger value="inactive">Campos Inativos ({mappings.filter(m => !m.is_active).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="required" className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Pipeline: <strong>{selectedPipeline?.name}</strong>
                <div className="text-xs text-gray-500 mt-1">
                  Campos obrigatórios são mapeados automaticamente e não podem ser removidos.
                </div>
              </div>
              
              {mappingsLoading ? (
                <div className="text-center py-4">Carregando mapeamentos...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo do Webhook</TableHead>
                      <TableHead>Campo do CRM</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requiredMappings.map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell className="font-mono text-sm">
                          {mapping.webhook_field_name}
                        </TableCell>
                        <TableCell>
                          {mapping.crm_field_name}
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Obrigatório
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mapping.field_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {mapping.is_active ? (
                              <>
                                <Eye className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">Ativo</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-400">Inativo</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleMapping(mapping.id, mapping.is_active)}
                          >
                            {mapping.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {requiredMappings.length === 0 && !mappingsLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum campo obrigatório encontrado</p>
                  <p className="text-sm">Use o botão "Sincronizar Obrigatórios" para criar os mapeamentos básicos</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="optional" className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Campos opcionais mapeados manualmente para facilitar a integração.
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo do Webhook</TableHead>
                    <TableHead>Campo do CRM</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optionalMappings
                    .filter(mapping => mapping.is_active)
                    .map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell className="font-mono text-sm">
                          {mapping.webhook_field_name}
                        </TableCell>
                        <TableCell>
                          {mapping.crm_field_name}
                          {mapping.custom_field && (
                            <div className="text-xs text-gray-500">
                              ({mapping.custom_field.field_name})
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mapping.field_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={mapping.crm_field_type === 'custom' ? 'secondary' : 'default'}>
                            {mapping.crm_field_type === 'custom' ? 'Customizado' : 'Padrão'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleMapping(mapping.id, mapping.is_active)}
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover Mapeamento</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover o mapeamento do campo "{mapping.webhook_field_name}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteMapping(mapping.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              {optionalMappings.filter(m => m.is_active).length === 0 && !mappingsLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum campo opcional mapeado</p>
                  <p className="text-sm">Use o botão "Adicionar Mapeamento" para mapear campos manualmente</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inactive" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo do Webhook</TableHead>
                    <TableHead>Campo do CRM</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings
                    .filter(mapping => !mapping.is_active)
                    .map((mapping) => (
                      <TableRow key={mapping.id} className="opacity-60">
                        <TableCell className="font-mono text-sm">
                          {mapping.webhook_field_name}
                        </TableCell>
                        <TableCell>
                          {mapping.crm_field_name}
                          {mapping.custom_field && (
                            <div className="text-xs text-gray-500">
                              ({mapping.custom_field.field_name})
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mapping.field_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={mapping.crm_field_type === 'custom' ? 'secondary' : 'default'}>
                            {mapping.crm_field_type === 'custom' ? 'Customizado' : 'Padrão'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleMapping(mapping.id, mapping.is_active)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              {mappings.filter(m => !m.is_active).length === 0 && !mappingsLoading && (
                <div className="text-center py-8 text-gray-500">
                  <EyeOff className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum mapeamento inativo encontrado</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!selectedPipelineId && (
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-4" />
            <p>Selecione um pipeline para visualizar os mapeamentos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
