
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Copy, 
  Check, 
  Info, 
  Shield, 
  AlertTriangle, 
  Key,
  ExternalLink
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
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';

export const WebhookUrlsCard = () => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { pipelines } = useCRMPipelines();
  
  const webhookBaseUrl = 'https://qflmguzmticupqtnlirf.supabase.co/functions/v1/crm-webhook';

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
    name: "João Silva",
    email: "joao@email.com", 
    phone: "(11) 99999-9999",
    has_company: true,
    sells_on_amazon: false,
    notes: "Lead vindo do formulário do site"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          URLs dos Webhooks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pipelines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Globe className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum pipeline encontrado</p>
            <p className="text-sm">Crie um pipeline primeiro para gerar URLs de webhook</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pipelines.map((pipeline) => (
              <PipelineWebhookCard
                key={pipeline.id}
                pipeline={pipeline}
                webhookBaseUrl={webhookBaseUrl}
                onCopyUrl={handleCopyUrl}
                copied={copied}
              />
            ))}
          </div>
        )}

        {/* Informações Gerais */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">ℹ️ Como usar os Webhooks</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Configure sua aplicação para enviar POST requests para a URL do pipeline</p>
            <p>• Use Content-Type: application/json no header</p>
            <p>• Campos obrigatórios variam por pipeline (veja configurações de mapeamento)</p>
            <p>• Configure tokens de segurança na aba "Tokens de Segurança"</p>
          </div>
        </div>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Info className="h-4 w-4 mr-2" />
              Ver Documentação Completa
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Documentação dos Webhooks
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Método e Headers */}
              <div>
                <h3 className="font-semibold mb-2">Configuração</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="default">POST</Badge>
                    <span className="text-sm text-gray-600">Content-Type: application/json</span>
                  </div>
                </div>
              </div>

              {/* Validação Configurável */}
              <div>
                <h3 className="font-semibold mb-2">Validação Configurável</h3>
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Campos Obrigatórios por Pipeline</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Cada pipeline pode ter seus próprios campos obrigatórios configurados. 
                    Verifique a aba "Configuração" → "Mapeamento de Campos" para ver quais campos são obrigatórios para cada pipeline.
                  </p>
                </div>
              </div>

              {/* Campos Opcionais */}
              <div>
                <h3 className="font-semibold mb-2">Campos Disponíveis (configuráveis)</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Badge variant="secondary">name</Badge>
                  <Badge variant="secondary">email</Badge>
                  <Badge variant="secondary">phone</Badge>
                  <Badge variant="secondary">has_company</Badge>
                  <Badge variant="secondary">sells_on_amazon</Badge>
                  <Badge variant="secondary">works_with_fba</Badge>
                  <Badge variant="secondary">seeks_private_label</Badge>
                  <Badge variant="secondary">ready_to_invest_3k</Badge>
                  <Badge variant="secondary">what_sells</Badge>
                  <Badge variant="secondary">amazon_store_link</Badge>
                  <Badge variant="secondary">main_doubts</Badge>
                  <Badge variant="secondary">notes</Badge>
                </div>
              </div>

              {/* Exemplo de Payload */}
              <div>
                <h3 className="font-semibold mb-2">Exemplo de Payload</h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify(examplePayload, null, 2)}
                </pre>
              </div>

              {/* Exemplo cURL */}
              <div>
                <h3 className="font-semibold mb-2">Exemplo cURL</h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST "${webhookBaseUrl}?pipeline_id=SEU_PIPELINE_ID" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(examplePayload)}'`}
                </pre>
              </div>

              {/* Resposta de Sucesso */}
              <div>
                <h3 className="font-semibold mb-2">Resposta de Sucesso</h3>
                <pre className="bg-green-50 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify({
  success: true,
  message: "Lead created successfully",
  lead_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  pipeline: {
    id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    name: "Nome do Pipeline"
  },
  column: {
    id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    name: "Nova Entrada"
  }
}, null, 2)}
                </pre>
              </div>

              {/* Resposta de Erro */}
              <div>
                <h3 className="font-semibold mb-2">Resposta de Erro (Campos Obrigatórios)</h3>
                <pre className="bg-red-50 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify({
  success: false,
  error: "Campos obrigatórios faltando: name, email",
  missing_fields: ["name", "email"]
}, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface PipelineWebhookCardProps {
  pipeline: any;
  webhookBaseUrl: string;
  onCopyUrl: (url: string) => void;
  copied: boolean;
}

const PipelineWebhookCard = ({ pipeline, webhookBaseUrl, onCopyUrl, copied }: PipelineWebhookCardProps) => {
  const { getActiveToken } = useCRMWebhookTokens(pipeline.id);
  const { mappings } = useCRMWebhookFieldMappings(pipeline.id);
  const activeToken = getActiveToken(pipeline.id);
  const webhookUrl = `${webhookBaseUrl}?pipeline_id=${pipeline.id}`;
  
  const requiredFields = mappings?.filter(m => m.is_required && m.is_active) || [];

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{pipeline.name}</h3>
          <p className="text-sm text-gray-500">Pipeline ID: {pipeline.id}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {activeToken ? (
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Com Token
            </Badge>
          ) : (
            <Badge className="bg-orange-100 text-orange-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Sem Token
            </Badge>
          )}
          
          {requiredFields.length > 0 ? (
            <Badge className="bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              {requiredFields.length} Obrigatório{requiredFields.length > 1 ? 's' : ''}
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-800">
              Sem Campos Obrigatórios
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1 break-all">
          {webhookUrl}
        </code>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopyUrl(webhookUrl)}
          title="Copiar URL"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Mostrar campos obrigatórios */}
      {requiredFields.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm text-blue-800 mb-2">
            <Shield className="h-4 w-4 inline mr-1" />
            Campos obrigatórios para este pipeline:
          </p>
          <div className="flex flex-wrap gap-1">
            {requiredFields.map((field) => (
              <Badge key={field.id} variant="destructive" className="text-xs">
                {field.webhook_field_name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {!activeToken && (
        <div className="bg-orange-50 border border-orange-200 rounded p-3">
          <p className="text-sm text-orange-800">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Este pipeline não possui token de segurança ativo. Configure um token na aba "Tokens de Segurança" para maior proteção.
          </p>
        </div>
      )}
    </div>
  );
};
