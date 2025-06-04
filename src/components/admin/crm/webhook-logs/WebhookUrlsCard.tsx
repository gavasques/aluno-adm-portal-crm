import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Eye, EyeOff, ExternalLink, RotateCcw, XCircle, History, Settings } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookTokens } from '@/hooks/crm/useCRMWebhookTokens';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WebhookFieldMappingsCard } from './WebhookFieldMappingsCard';

export const WebhookUrlsCard = () => {
  const [showUrls, setShowUrls] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'deactivate' | 'renew' | null>(null);
  const [reason, setReason] = useState('');
  const [showHistory, setShowHistory] = useState<string | null>(null);
  
  const { pipelines } = useCRMPipelines();
  const { tokens, getActiveToken, generateToken, deactivateToken, renewToken } = useCRMWebhookTokens();
  const { syncStandardMappings } = useCRMWebhookFieldMappings();
  
  const baseUrl = 'https://qflmguzmticupqtnlirf.supabase.co/functions/v1/crm-webhook';

  const copyToClipboard = (url: string, pipelineName: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`URL do webhook "${pipelineName}" copiada!`);
  };

  const handleGenerateToken = async (pipelineId: string) => {
    try {
      await generateToken.mutateAsync({ pipeline_id: pipelineId });
      await syncStandardMappings.mutateAsync(pipelineId);
    } catch (error) {
      console.error('Erro ao gerar token:', error);
    }
  };

  const handleTokenAction = async () => {
    if (!selectedPipeline || !actionType || !reason.trim()) return;

    try {
      if (actionType === 'deactivate') {
        const activeToken = getActiveToken(selectedPipeline);
        if (activeToken) {
          await deactivateToken.mutateAsync({ tokenId: activeToken.id, reason });
        }
      } else if (actionType === 'renew') {
        await renewToken.mutateAsync({ pipelineId: selectedPipeline, reason });
      }
      
      setSelectedPipeline(null);
      setActionType(null);
      setReason('');
    } catch (error) {
      console.error('Erro na ação do token:', error);
    }
  };

  const getPipelineTokens = (pipelineId: string) => {
    return tokens.filter(token => token.pipeline_id === pipelineId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">URLs dos Webhooks</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowUrls(!showUrls)}
        >
          {showUrls ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showUrls ? 'Ocultar' : 'Mostrar'}
        </Button>
      </CardHeader>
      
      {showUrls && (
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Use estas URLs para configurar webhooks em sistemas externos. 
              Cada pipeline tem sua própria URL única com token de segurança.
            </p>
            
            {pipelines.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>Nenhum pipeline encontrado</p>
                <p className="text-xs">Crie um pipeline primeiro no CRM</p>
              </div>
            ) : (
              pipelines.map((pipeline) => {
                const activeToken = getActiveToken(pipeline.id);
                const pipelineTokens = getPipelineTokens(pipeline.id);
                const webhookUrl = activeToken ? `${baseUrl}?token=${activeToken.token}` : null;
                
                return (
                  <div 
                    key={pipeline.id}
                    className="p-4 border rounded-lg bg-gray-50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pipeline.name}</span>
                        <Badge variant={pipeline.is_active ? "default" : "secondary"}>
                          {pipeline.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {activeToken && (
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            Token Ativo
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {pipelineTokens.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHistory(showHistory === pipeline.id ? null : pipeline.id)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <WebhookFieldMappingsCard 
                          pipelineId={pipeline.id}
                          pipelineName={pipeline.name}
                        />
                      </div>
                    </div>
                    
                    {webhookUrl ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <code className="flex-1 bg-white px-2 py-1 rounded border font-mono text-xs break-all">
                            {webhookUrl}
                          </code>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(webhookUrl, pipeline.name)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPipeline(pipeline.id);
                                  setActionType('deactivate');
                                }}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Inativar
                              </Button>
                            </DialogTrigger>
                            
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Inativar Token de Webhook</DialogTitle>
                                <DialogDescription>
                                  Esta ação irá desativar o token atual. O webhook parará de funcionar até que um novo token seja gerado.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="reason">Motivo da inativação</Label>
                                  <Textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Descreva o motivo para inativar este token..."
                                  />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedPipeline(null);
                                      setActionType(null);
                                      setReason('');
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={handleTokenAction}
                                    disabled={!reason.trim()}
                                  >
                                    Inativar Token
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPipeline(pipeline.id);
                                  setActionType('renew');
                                }}
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Renovar
                              </Button>
                            </DialogTrigger>
                            
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Renovar Token de Webhook</DialogTitle>
                                <DialogDescription>
                                  Esta ação irá gerar um novo token e desativar o atual. Você precisará atualizar a URL em sistemas externos.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="renew-reason">Motivo da renovação</Label>
                                  <Textarea
                                    id="renew-reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Descreva o motivo para renovar este token..."
                                  />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedPipeline(null);
                                      setActionType(null);
                                      setReason('');
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    onClick={handleTokenAction}
                                    disabled={!reason.trim()}
                                  >
                                    Renovar Token
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-sm text-gray-500 mb-2">Nenhum token ativo</p>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateToken(pipeline.id)}
                          disabled={generateToken.isPending}
                        >
                          {generateToken.isPending ? 'Gerando...' : 'Gerar Token'}
                        </Button>
                      </div>
                    )}
                    
                    {/* Histórico de tokens */}
                    {showHistory === pipeline.id && pipelineTokens.length > 0 && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <h4 className="text-sm font-medium mb-2">Histórico de Tokens</h4>
                        <div className="space-y-2">
                          {pipelineTokens.map((token) => (
                            <div key={token.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Badge variant={token.is_active ? "default" : "secondary"} className="text-xs">
                                  {token.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                                <span className="font-mono">{token.token.substring(0, 8)}...</span>
                              </div>
                              <div className="text-gray-500">
                                {format(new Date(token.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <p>Método: <code>POST</code> • Content-Type: <code>application/json</code></p>
                      <p className="mt-1">
                        <strong>Sincronização automática:</strong> Campos customizados são automaticamente 
                        mapeados para este webhook quando criados/editados/removidos.
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Como usar:</p>
                  <p className="text-blue-700">
                    Configure seu sistema externo para enviar requisições POST para a URL do pipeline desejado usando o token de segurança. 
                    Os dados do lead serão automaticamente criados no CRM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
