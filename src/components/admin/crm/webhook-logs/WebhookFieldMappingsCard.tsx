
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Settings, 
  Edit, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { ManualFieldMappingDialog } from './ManualFieldMappingDialog';
import { EditFieldMappingDialog } from './EditFieldMappingDialog';
import { RequiredFieldsIndicator } from './RequiredFieldsIndicator';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { toast } from 'sonner';
import { CRMWebhookFieldMapping } from '@/types/crm-webhook.types';

interface WebhookFieldMappingsCardProps {
  pipelineId: string;
}

export const WebhookFieldMappingsCard = ({ pipelineId }: WebhookFieldMappingsCardProps) => {
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [editingMapping, setEditingMapping] = useState<CRMWebhookFieldMapping | null>(null);

  const { 
    mappings, 
    isLoading, 
    createMapping, 
    updateMapping, 
    deleteMapping, 
    syncStandardMappings 
  } = useCRMWebhookFieldMappings(pipelineId);

  const handleSyncRequired = async () => {
    try {
      await syncStandardMappings.mutateAsync(pipelineId);
    } catch (error) {
      console.error('Erro ao sincronizar campos obrigatórios:', error);
    }
  };

  const handleDeleteMapping = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este mapeamento?')) {
      try {
        await deleteMapping.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar mapeamento:', error);
      }
    }
  };

  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'phone': return 'bg-purple-100 text-purple-800';
      case 'boolean': return 'bg-orange-100 text-orange-800';
      case 'number': return 'bg-gray-100 text-gray-800';
      case 'select': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCrmFieldTypeColor = (type: 'standard' | 'custom') => {
    return type === 'standard' 
      ? 'bg-emerald-100 text-emerald-800' 
      : 'bg-violet-100 text-violet-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Mapeamento de Campos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Carregando mapeamentos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Mapeamento de Campos do Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Indicador de Campos Obrigatórios */}
          <RequiredFieldsIndicator mappings={mappings} />

          {/* Botões de Ação */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowManualDialog(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Mapeamento
            </Button>

            <Button
              onClick={handleSyncRequired}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={syncStandardMappings.isPending}
            >
              <RefreshCw className={`h-4 w-4 ${syncStandardMappings.isPending ? 'animate-spin' : ''}`} />
              Sincronizar Campo Obrigatório
            </Button>
          </div>

          {/* Lista de Mapeamentos */}
          {mappings.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Nenhum mapeamento configurado
              </h3>
              <p className="text-gray-500 mb-4">
                Configure como os campos do webhook serão mapeados para o CRM
              </p>
              <Button
                onClick={() => setShowManualDialog(true)}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Primeiro Mapeamento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                    mapping.is_required ? 'border-red-200 bg-red-50/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {mapping.is_required && (
                          <Shield className="h-4 w-4 text-red-600" />
                        )}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {mapping.webhook_field_name}
                        </code>
                        <span className="text-gray-400">→</span>
                        <code className="bg-blue-50 px-2 py-1 rounded text-sm font-mono">
                          {mapping.crm_field_name}
                        </code>
                        {mapping.custom_field && (
                          <span className="text-sm text-gray-500">
                            ({mapping.custom_field.field_name})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Badge className={getFieldTypeColor(mapping.field_type)}>
                          {mapping.field_type}
                        </Badge>
                        <Badge className={getCrmFieldTypeColor(mapping.crm_field_type)}>
                          {mapping.crm_field_type === 'standard' ? 'Padrão' : 'Customizado'}
                        </Badge>
                        {mapping.is_required && (
                          <Badge variant="destructive" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Obrigatório
                          </Badge>
                        )}
                        {mapping.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMapping(mapping)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMapping(mapping.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Informações Úteis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">ℹ️ Validação Configurável</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Marque campos como obrigatórios para validação automática</p>
              <p>• Cada pipeline pode ter validações diferentes</p>
              <p>• Campos obrigatórios são indicados com <Shield className="inline h-3 w-3 mx-1" /></p>
              <p>• Webhooks serão rejeitados se campos obrigatórios estiverem faltando</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogos */}
      <ManualFieldMappingDialog
        pipelineId={pipelineId}
        trigger={null}
        open={showManualDialog}
        onOpenChange={setShowManualDialog}
      />

      {editingMapping && (
        <EditFieldMappingDialog
          mapping={editingMapping}
          open={!!editingMapping}
          onOpenChange={(open) => !open && setEditingMapping(null)}
        />
      )}
    </>
  );
};
