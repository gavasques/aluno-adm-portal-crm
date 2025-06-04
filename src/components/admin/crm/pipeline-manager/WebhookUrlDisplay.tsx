
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Link as LinkIcon, 
  Check, 
  Info, 
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
import { CRMPipeline } from '@/types/crm.types';

interface WebhookUrlDisplayProps {
  pipeline: CRMPipeline;
}

export const WebhookUrlDisplay = ({ pipeline }: WebhookUrlDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const webhookUrl = `https://qflmguzmticupqtnlirf.supabase.co/functions/v1/crm-webhook?pipeline_id=${pipeline.id}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
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
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyUrl}
        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
        title="Copiar URL do Webhook"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
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
        
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-blue-600" />
              Webhook do Pipeline: {pipeline.name}
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
                onClick={handleCopyUrl} 
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

            {/* Required Fields */}
            <div>
              <h3 className="font-semibold mb-2">Campos Obrigatórios</h3>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="destructive">name</Badge>
                <Badge variant="destructive">email</Badge>
              </div>
            </div>

            {/* Optional Fields */}
            <div>
              <h3 className="font-semibold mb-2">Campos Opcionais</h3>
              <div className="grid grid-cols-3 gap-2">
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

            {/* Example */}
            <div>
              <h3 className="font-semibold mb-2">Exemplo de Payload</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify(examplePayload, null, 2)}
              </pre>
            </div>

            {/* cURL Example */}
            <div>
              <h3 className="font-semibold mb-2">Exemplo cURL</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(examplePayload)}'`}
              </pre>
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
                <li>• O webhook não requer autenticação</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
