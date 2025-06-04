
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { toast } from 'sonner';

export const WebhookUrlsCard = () => {
  const [showUrls, setShowUrls] = useState(false);
  const { pipelines } = useCRMPipelines();
  
  const baseUrl = 'https://qflmguzmticupqtnlirf.supabase.co/functions/v1/crm-webhook';

  const copyToClipboard = (url: string, pipelineName: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`URL do webhook "${pipelineName}" copiada!`);
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
              Cada pipeline tem sua própria URL única.
            </p>
            
            {pipelines.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>Nenhum pipeline encontrado</p>
                <p className="text-xs">Crie um pipeline primeiro no CRM</p>
              </div>
            ) : (
              pipelines.map((pipeline) => {
                const webhookUrl = `${baseUrl}?pipeline_id=${pipeline.id}`;
                
                return (
                  <div 
                    key={pipeline.id}
                    className="p-3 border rounded-lg bg-gray-50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pipeline.name}</span>
                        <Badge variant={pipeline.is_active ? "default" : "secondary"}>
                          {pipeline.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                    
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
                    
                    <div className="text-xs text-gray-500">
                      <p>Método: <code>POST</code> • Content-Type: <code>application/json</code></p>
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
                    Configure seu sistema externo para enviar requisições POST para a URL do pipeline desejado. 
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
