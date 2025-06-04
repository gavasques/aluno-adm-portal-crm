
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Globe, 
  User,
  Code,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CRMWebhookLog } from '@/hooks/crm/useCRMWebhookLogs';

interface WebhookLogDetailProps {
  log: CRMWebhookLog;
}

export const WebhookLogDetail = ({ log }: WebhookLogDetailProps) => {
  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* Status e Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {log.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Status da Requisição
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Status HTTP</label>
              <div className="mt-1">
                <Badge 
                  variant={log.success ? "default" : "destructive"}
                  className={log.success ? "bg-green-100 text-green-800" : ""}
                >
                  {log.response_status}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Tempo de Processamento</label>
              <div className="mt-1 text-sm">
                {log.processing_time_ms ? `${log.processing_time_ms}ms` : 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data/Hora</label>
              <div className="mt-1 text-sm">
                {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Endereço IP</label>
              <div className="mt-1 text-sm font-mono">
                {log.ip_address || 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">User Agent</label>
              <div className="mt-1 text-sm text-gray-600 break-all">
                {log.user_agent || 'N/A'}
              </div>
            </div>
          </div>
          
          {log.webhook_url && (
            <div>
              <label className="text-sm font-medium text-gray-500">URL do Webhook</label>
              <div className="mt-1 text-sm font-mono break-all bg-gray-50 p-2 rounded">
                {log.webhook_url}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pipeline e Lead */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {log.pipeline && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <div className="mt-1">{log.pipeline.name}</div>
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-500">ID</label>
                <div className="mt-1 text-sm font-mono text-gray-600">{log.pipeline.id}</div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {log.lead && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Lead Criado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <div className="mt-1">{log.lead.name}</div>
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="mt-1">{log.lead.email}</div>
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-500">ID</label>
                <div className="mt-1 text-sm font-mono text-gray-600">{log.lead.id}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Erro (se houver) */}
      {log.error_message && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Mensagem de Erro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 p-4 rounded text-red-700">
              {log.error_message}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payload Recebido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-600" />
            Payload Recebido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
            {formatJson(log.payload_received)}
          </pre>
        </CardContent>
      </Card>

      {/* Resposta */}
      {log.response_body && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-600" />
              Resposta Enviada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
              {formatJson(log.response_body)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
