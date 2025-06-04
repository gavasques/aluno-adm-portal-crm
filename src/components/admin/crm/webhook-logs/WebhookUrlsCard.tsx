
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookTokens } from '@/hooks/crm/useCRMWebhookTokens';
import { Globe, Plus, Key, RotateCcw, Trash2, Copy, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Componente para exibir histórico de tokens
const TokenHistory = ({ pipelineId, pipelineName }: { pipelineId: string; pipelineName: string }) => {
  const { tokens } = useCRMWebhookTokens(pipelineId);
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Pipeline: <strong>{pipelineName}</strong>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Expira em</TableHead>
            <TableHead>Motivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TableRow key={token.id}>
              <TableCell className="font-mono text-sm">
                {token.token.substring(0, 8)}...{token.token.substring(token.token.length - 4)}
              </TableCell>
              <TableCell>
                {token.is_active ? (
                  <Badge variant="default">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Inativo</Badge>
                )}
              </TableCell>
              <TableCell>{new Date(token.created_at).toLocaleString()}</TableCell>
              <TableCell>
                {token.expires_at ? new Date(token.expires_at).toLocaleString() : 'Nunca'}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {token.reason || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {tokens.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Key className="h-12 w-12 mx-auto mb-4" />
          <p>Nenhum token encontrado para este pipeline</p>
        </div>
      )}
    </div>
  );
};

export const WebhookUrlsCard = () => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'deactivate' | 'renew'>('deactivate');
  const [reason, setReason] = useState('');
  const [activeTokenId, setActiveTokenId] = useState<string>('');

  const { pipelines } = useCRMPipelines();
  const { tokens, generateToken, deactivateToken, renewToken, getActiveToken } = useCRMWebhookTokens(selectedPipelineId);

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);
  const activeToken = selectedPipelineId ? getActiveToken(selectedPipelineId) : null;

  const webhookUrl = selectedPipelineId && activeToken 
    ? `${window.location.origin}/webhook/crm/${selectedPipelineId}?token=${activeToken.token}`
    : '';

  const handleGenerateToken = async () => {
    if (!selectedPipelineId) {
      toast.error('Selecione um pipeline primeiro');
      return;
    }
    
    try {
      await generateToken.mutateAsync({
        pipeline_id: selectedPipelineId,
        reason: reason || 'Token gerado pelo admin'
      });
      setShowTokenDialog(false);
      setReason('');
    } catch (error) {
      console.error('Erro ao gerar token:', error);
    }
  };

  const handleTokenAction = async () => {
    if (!selectedPipelineId || !reason.trim()) {
      toast.error('Preencha o motivo da ação');
      return;
    }

    try {
      if (actionType === 'deactivate' && activeToken) {
        await deactivateToken.mutateAsync({
          tokenId: activeToken.id,
          reason: reason
        });
      } else if (actionType === 'renew') {
        await renewToken.mutateAsync({
          pipelineId: selectedPipelineId,
          reason: reason
        });
      }
      
      setShowActionDialog(false);
      setReason('');
    } catch (error) {
      console.error('Erro na ação do token:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copiada para a área de transferência!');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            URLs e Tokens dos Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <Button 
                onClick={() => setShowTokenDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Gerar Token
              </Button>
            )}
          </div>

          {selectedPipelineId && (
            <Tabs defaultValue="current" className="w-full">
              <TabsList>
                <TabsTrigger value="current">Token Atual</TabsTrigger>
                <TabsTrigger value="history">Histórico de Tokens</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4">
                {activeToken ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-800">Token Ativo</h4>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActionType('deactivate');
                              setActiveTokenId(activeToken.id);
                              setShowActionDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Desativar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActionType('renew');
                              setShowActionDialog(true);
                            }}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Renovar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-green-700 space-y-2">
                        <p><strong>Token:</strong> <span className="font-mono">{activeToken.token.substring(0, 16)}...</span></p>
                        <p><strong>Criado em:</strong> {new Date(activeToken.created_at).toLocaleString()}</p>
                        {activeToken.expires_at && (
                          <p><strong>Expira em:</strong> {new Date(activeToken.expires_at).toLocaleString()}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL do Webhook:</label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={webhookUrl}
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(webhookUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use esta URL como endpoint para receber leads via webhook
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-4" />
                    <p>Nenhum token ativo para este pipeline</p>
                    <p className="text-sm">Gere um novo token para começar a receber webhooks</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <TokenHistory 
                  pipelineId={selectedPipelineId} 
                  pipelineName={selectedPipeline?.name || ''} 
                />
              </TabsContent>
            </Tabs>
          )}

          {!selectedPipelineId && (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-4" />
              <p>Selecione um pipeline para gerenciar tokens e URLs de webhook</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para gerar token */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Novo Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Pipeline:</label>
              <p className="text-sm text-gray-600">{selectedPipeline?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Motivo (opcional):</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo para gerar este token..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTokenDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateToken}
              disabled={generateToken.isPending}
            >
              {generateToken.isPending ? 'Gerando...' : 'Gerar Token'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para ações do token */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'deactivate' ? 'Desativar Token' : 'Renovar Token'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Pipeline:</label>
              <p className="text-sm text-gray-600">{selectedPipeline?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Motivo *:</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Descreva o motivo para ${actionType === 'deactivate' ? 'desativar' : 'renovar'} este token...`}
                className="mt-1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleTokenAction}
              disabled={deactivateToken.isPending || renewToken.isPending}
              variant={actionType === 'deactivate' ? 'destructive' : 'default'}
            >
              {(deactivateToken.isPending || renewToken.isPending) ? 'Processando...' : 
               (actionType === 'deactivate' ? 'Desativar' : 'Renovar')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
