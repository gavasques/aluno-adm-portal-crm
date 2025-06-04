
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Plus, Trash2, Globe, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookTokens } from '@/hooks/crm/useCRMWebhookTokens';
import { toast } from 'sonner';

export const WebhookUrlsCard = () => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [newTokenExpiry, setNewTokenExpiry] = useState<string>('');
  const [newTokenReason, setNewTokenReason] = useState<string>('');

  const { pipelines } = useCRMPipelines();
  const { 
    tokens, 
    isLoading, 
    generateToken, 
    deactivateToken 
  } = useCRMWebhookTokens(selectedPipelineId);

  const handleCreateToken = async () => {
    if (!selectedPipelineId) {
      toast.error('Selecione um pipeline primeiro');
      return;
    }

    try {
      await generateToken.mutateAsync({
        pipeline_id: selectedPipelineId,
        expires_at: newTokenExpiry || undefined,
        reason: newTokenReason || 'Token criado via interface'
      });
      
      setNewTokenExpiry('');
      setNewTokenReason('');
    } catch (error) {
      console.error('Erro ao criar token:', error);
    }
  };

  const handleDeactivateToken = async (tokenId: string) => {
    if (confirm('Tem certeza que deseja desativar este token? Esta ação não pode ser desfeita.')) {
      try {
        await deactivateToken.mutateAsync({
          tokenId,
          reason: 'Desativado via interface'
        });
      } catch (error) {
        console.error('Erro ao desativar token:', error);
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência!`);
  };

  const getWebhookUrl = (token: string) => {
    const baseUrl = 'https://qflmguzmticupqtnlirf.supabase.co/functions/v1/crm-webhook';
    return `${baseUrl}?pipeline_id=${selectedPipelineId}&token=${token}`;
  };

  const activeTokens = tokens.filter(token => token.is_active);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              URLs e Tokens do Webhook
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie URLs e tokens de segurança para recebimento de webhooks
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletor de Pipeline */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Pipeline:</label>
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

        {/* Informações sobre suporte a webhooks */}
        {selectedPipelineId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Formatos de Webhook Suportados</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span><strong>Typeform:</strong> Detecção automática e transformação de dados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span><strong>Generic:</strong> Formato JSON simples com mapeamento manual</span>
              </div>
            </div>
          </div>
        )}

        {/* Criação de Novo Token */}
        {selectedPipelineId && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Criar Novo Token</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm text-gray-600">Data de Expiração (opcional):</label>
                <Input
                  type="datetime-local"
                  value={newTokenExpiry}
                  onChange={(e) => setNewTokenExpiry(e.target.value)}
                  placeholder="Deixe vazio para não expirar"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Motivo/Descrição:</label>
                <Input
                  value={newTokenReason}
                  onChange={(e) => setNewTokenReason(e.target.value)}
                  placeholder="Ex: Token para Typeform X"
                />
              </div>
            </div>
            <Button 
              onClick={handleCreateToken}
              disabled={generateToken.isPending}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {generateToken.isPending ? 'Criando...' : 'Criar Token'}
            </Button>
          </div>
        )}

        {/* Lista de Tokens Ativos */}
        {selectedPipelineId && (
          <div className="space-y-3">
            <h4 className="font-medium">Tokens Ativos ({activeTokens.length})</h4>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTokens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhum token ativo</p>
                <p className="text-sm">Crie um token para começar a receber webhooks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTokens.map(token => (
                  <div key={token.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="h-4 w-4 text-gray-500" />
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {token.token}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.token, 'Token')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {token.reason && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Motivo:</strong> {token.reason}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Criado: {new Date(token.created_at).toLocaleString('pt-BR')}</span>
                          {token.expires_at && (
                            <span className="flex items-center gap-1">
                              Expira: {new Date(token.expires_at).toLocaleString('pt-BR')}
                              {new Date(token.expires_at) < new Date() && (
                                <Badge variant="destructive" className="text-xs">Expirado</Badge>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivateToken(token.id)}
                        disabled={deactivateToken.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-gray-600">URL do Webhook:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded border">
                            {getWebhookUrl(token.token)}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(getWebhookUrl(token.token), 'URL')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2">
                        <p><strong>Para Typeform:</strong> Use esta URL como webhook endpoint. O sistema detectará automaticamente o formato.</p>
                        <p><strong>Para outros sistemas:</strong> Envie dados no formato JSON com os campos mapeados.</p>
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
