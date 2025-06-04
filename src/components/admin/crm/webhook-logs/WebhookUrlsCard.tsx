
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Link as LinkIcon, 
  Check, 
  Info, 
  ExternalLink,
  Globe
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookTokens } from '@/hooks/crm/useCRMWebhookTokens';

export const WebhookUrlsCard = () => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { pipelines } = useCRMPipelines();
  const { tokens } = useCRMWebhookTokens();

  // URL correta da edge function do Supabase
  const getWebhookUrl = (pipelineId: string, token?: string) => {
    const baseUrl = 'https://qflmguzmticupqtnlirf.supabase.co/functions/v1/crm-webhook';
    const params = new URLSearchParams({ pipeline_id: pipelineId });
    if (token) {
      params.append('token', token);
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL do webhook copiada!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar URL');
    }
  };

  const examplePayload = {
    event_id: "01J8KXYZ123ABC",
    event_type: "form_response",
    form_response: {
      form_id: "ABC123xyz",
      token: "abc123xyz789def",
      landed_at: "2024-01-15T10:30:00Z",
      submitted_at: "2024-01-15T10:35:00Z",
      definition: {
        id: "ABC123xyz",
        title: "Formulário de Captação"
      },
      answers: [
        {
          type: "short_text",
          short_text: {
            value: "João Silva"
          },
          field: {
            id: "S9kAFZFWH5lE",
            type: "short_text",
            ref: "name"
          }
        },
        {
          type: "email",
          email: {
            value: "joao@email.com"
          },
          field: {
            id: "O7i0ewE1vtNz",
            type: "email",
            ref: "email_address"
          }
        },
        {
          type: "phone_number",
          phone_number: {
            value: "(11) 99999-9999"
          },
          field: {
            id: "jQngFhlOHRPd",
            type: "phone_number",
            ref: "phone"
          }
        }
      ]
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              URLs dos Webhooks
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              URLs para configurar nos seus formulários e sistemas externos
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pipelines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum pipeline encontrado</p>
            <p className="text-sm">
              Crie um pipeline primeiro para gerar URLs de webhook
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pipelines.map(pipeline => {
              const activeToken = tokens.find(token => 
                token.pipeline_id === pipeline.id && token.is_active
              );
              const webhookUrl = getWebhookUrl(pipeline.id, activeToken?.token);

              return (
                <div
                  key={pipeline.id}
                  className="p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{pipeline.name}</h3>
                      {activeToken ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Sem Token
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(webhookUrl)}
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Copiar URL do Webhook"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            title="Detalhes do Webhook"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <LinkIcon className="h-5 w-5 text-blue-600" />
                              Webhook: {pipeline.name}
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* URL Section */}
                            <div>
                              <h3 className="font-semibold mb-2">URL do Webhook</h3>
                              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm break-all">
                                {webhookUrl}
                              </div>
                              <Button 
                                onClick={() => handleCopyUrl(webhookUrl)} 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                              >
                                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? 'Copiado!' : 'Copiar URL'}
                              </Button>
                            </div>

                            {/* Method and Headers */}
                            <div>
                              <h3 className="font-semibold mb-2">Configuração</h3>
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <Badge variant="default">POST</Badge>
                                  <span className="text-sm text-gray-600">Content-Type: application/json</span>
                                </div>
                              </div>
                            </div>

                            {/* Typeform Format */}
                            <div>
                              <h3 className="font-semibold mb-2">Formato Typeform (Suportado)</h3>
                              <p className="text-sm text-gray-600 mb-3">
                                O webhook aceita automaticamente o formato padrão do Typeform com estrutura `answers` array.
                              </p>
                              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify(examplePayload, null, 2)}
                              </pre>
                            </div>

                            {/* Field Mapping */}
                            <div>
                              <h3 className="font-semibold mb-2">Mapeamento de Campos</h3>
                              <p className="text-sm text-gray-600 mb-3">
                                Configure o mapeamento de campos na aba "Mapeamento de Campos" para definir como os campos do Typeform são mapeados para o CRM.
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Campos Obrigatórios:</h4>
                                  <div className="space-y-1">
                                    <Badge variant="destructive">name</Badge>
                                    <Badge variant="destructive">email</Badge>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Campos Opcionais:</h4>
                                  <div className="space-y-1">
                                    <Badge variant="secondary">phone</Badge>
                                    <Badge variant="secondary">has_company</Badge>
                                    <Badge variant="secondary">sells_on_amazon</Badge>
                                    <Badge variant="secondary">works_with_fba</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Response Example */}
                            <div>
                              <h3 className="font-semibold mb-2">Resposta de Sucesso</h3>
                              <pre className="bg-green-50 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify({
  success: true,
  message: "Lead created successfully",
  lead_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  pipeline: {
    id: pipeline.id,
    name: pipeline.name
  },
  column: {
    id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    name: "Nova Entrada"
  }
}, null, 2)}
                              </pre>
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">ℹ️ Informações Importantes</h4>
                              <ul className="text-sm text-blue-800 space-y-1">
                                <li>• O lead será criado automaticamente na primeira coluna do pipeline</li>
                                <li>• Se já existir um lead com o mesmo email, será retornado o lead existente</li>
                                <li>• Todos os requests são logados para auditoria</li>
                                <li>• Configure o mapeamento de campos para processar dados do Typeform</li>
                                {activeToken ? (
                                  <li>• Token de segurança está ativo e funcionando</li>
                                ) : (
                                  <li>• ⚠️ Gere um token de segurança para proteger o webhook</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded font-mono text-xs break-all text-gray-700">
                    {webhookUrl}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
