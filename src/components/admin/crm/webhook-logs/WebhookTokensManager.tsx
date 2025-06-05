
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Shield, 
  ShieldOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { useCRMWebhookTokens } from '@/hooks/crm/useCRMWebhookTokens';
import { WebhookTokenDialog } from './WebhookTokenDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface WebhookTokensManagerProps {
  pipelineId: string;
}

export const WebhookTokensManager = ({ pipelineId }: WebhookTokensManagerProps) => {
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { 
    tokens, 
    isLoading, 
    getActiveToken, 
    generateToken, 
    deactivateToken, 
    renewToken 
  } = useCRMWebhookTokens(pipelineId);

  const activeToken = getActiveToken(pipelineId);
  const pipelineTokens = tokens.filter(token => token.pipeline_id === pipelineId);

  const toggleTokenVisibility = (tokenId: string) => {
    const newVisible = new Set(visibleTokens);
    if (newVisible.has(tokenId)) {
      newVisible.delete(tokenId);
    } else {
      newVisible.add(tokenId);
    }
    setVisibleTokens(newVisible);
  };

  const copyToken = async (token: string, tokenId: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(tokenId);
      toast.success('Token copiado para a área de transferência!');
      
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar token');
    }
  };

  const handleDeactivateToken = async (tokenId: string) => {
    if (confirm('Tem certeza que deseja desativar este token? Isso pode quebrar integrações existentes.')) {
      try {
        await deactivateToken.mutateAsync({ 
          tokenId, 
          reason: 'Desativado manualmente pelo administrador' 
        });
      } catch (error) {
        console.error('Erro ao desativar token:', error);
      }
    }
  };

  const handleRenewToken = async () => {
    if (confirm('Tem certeza que deseja renovar o token? O token anterior será desativado.')) {
      try {
        await renewToken.mutateAsync({ 
          pipelineId, 
          reason: 'Renovação manual pelo administrador' 
        });
      } catch (error) {
        console.error('Erro ao renovar token:', error);
      }
    }
  };

  const getTokenStatus = (token: any) => {
    if (!token.is_active) return 'inactive';
    if (token.expires_at && new Date(token.expires_at) < new Date()) return 'expired';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary">
            <ShieldOff className="h-3 w-3 mr-1" />
            Inativo
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatToken = (token: string, isVisible: boolean) => {
    if (isVisible) return token;
    return '•'.repeat(20) + token.slice(-4);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Tokens de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500">Carregando tokens...</p>
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
            <Key className="h-5 w-5" />
            Tokens de Segurança do Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Geral */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Status de Segurança</h3>
              <p className="text-sm text-gray-600">
                {activeToken ? 'Pipeline protegido por token ativo' : 'Pipeline sem proteção por token'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeToken ? (
                <Shield className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowTokenDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Gerar Novo Token
            </Button>

            {activeToken && (
              <Button
                onClick={handleRenewToken}
                variant="outline"
                className="gap-2"
                disabled={renewToken.isPending}
              >
                <RotateCcw className={`h-4 w-4 ${renewToken.isPending ? 'animate-spin' : ''}`} />
                Renovar Token Ativo
              </Button>
            )}
          </div>

          {/* Lista de Tokens */}
          {pipelineTokens.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Key className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Nenhum token configurado
              </h3>
              <p className="text-gray-500 mb-4">
                Crie um token de segurança para proteger seu webhook
              </p>
              <Button
                onClick={() => setShowTokenDialog(true)}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Token
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {pipelineTokens.map((token, index) => {
                const status = getTokenStatus(token);
                const isVisible = visibleTokens.has(token.id);
                const isCopied = copiedToken === token.id;
                
                return (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(status)}
                          
                          <span className="text-sm text-gray-500">
                            Criado em {format(new Date(token.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                          
                          {token.expires_at && (
                            <span className="text-sm text-gray-500">
                              • Expira em {format(new Date(token.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm flex-1">
                            {formatToken(token.token, isVisible)}
                          </code>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTokenVisibility(token.id)}
                            title={isVisible ? 'Ocultar token' : 'Mostrar token'}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToken(token.token, token.id)}
                            title="Copiar token"
                          >
                            {isCopied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          
                          {token.is_active && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivateToken(token.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Desativar token"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {token.reason && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Motivo:</span> {token.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Informações Úteis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">ℹ️ Sobre os Tokens</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Tokens protegem seu webhook contra acesso não autorizado</p>
              <p>• Apenas um token pode estar ativo por vez para cada pipeline</p>
              <p>• Você pode definir data de expiração opcional para maior segurança</p>
              <p>• Sempre mantenha seus tokens seguros e renove-os periodicamente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para criar novo token */}
      <WebhookTokenDialog
        pipelineId={pipelineId}
        open={showTokenDialog}
        onOpenChange={setShowTokenDialog}
      />
    </>
  );
};
