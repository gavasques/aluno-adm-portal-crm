
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Globe, 
  User,
  RefreshCw,
  Filter
} from 'lucide-react';
import { useCRMWebhookLogs, type WebhookLogFilters } from '@/hooks/crm/useCRMWebhookLogs';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WebhookLogDetail } from './WebhookLogDetail';
import { WebhookLogFilters as WebhookLogFiltersComponent } from './WebhookLogFilters';
import { WebhookEmptyState } from './WebhookEmptyState';

interface WebhookLogsListProps {
  pipelineId?: string;
}

export const WebhookLogsList = ({ pipelineId }: WebhookLogsListProps) => {
  const [filters, setFilters] = useState<WebhookLogFilters>({
    pipeline_id: pipelineId
  });
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: logs = [], isLoading, refetch } = useCRMWebhookLogs(filters);

  const getStatusBadge = (success: boolean, responseStatus: number) => {
    if (success) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Sucesso
        </Badge>
      );
    }
    
    const getStatusColor = () => {
      if (responseStatus >= 400 && responseStatus < 500) return 'bg-yellow-100 text-yellow-800';
      if (responseStatus >= 500) return 'bg-red-100 text-red-800';
      return 'bg-gray-100 text-gray-800';
    };

    return (
      <Badge variant="secondary" className={getStatusColor()}>
        <XCircle className="h-3 w-3 mr-1" />
        {responseStatus}
      </Badge>
    );
  };

  const formatProcessingTime = (timeMs?: number) => {
    if (!timeMs) return '-';
    if (timeMs < 1000) return `${timeMs}ms`;
    return `${(timeMs / 1000).toFixed(2)}s`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Logs do Webhook
          </h3>
          <p className="text-sm text-gray-600">
            {logs.length} {logs.length === 1 ? 'registro' : 'registros'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <WebhookLogFiltersComponent 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </CardContent>
        </Card>
      )}

      {/* Lista de logs */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <WebhookEmptyState />
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(log.success, log.response_status)}
                        
                        {log.pipeline && (
                          <Badge variant="outline">
                            {log.pipeline.name}
                          </Badge>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">IP:</span>
                          <span className="ml-2 font-mono">{log.ip_address || 'N/A'}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-500">Tempo:</span>
                          <span className="ml-2">{formatProcessingTime(log.processing_time_ms)}</span>
                        </div>
                        
                        {log.lead && (
                          <div>
                            <span className="text-gray-500">Lead:</span>
                            <span className="ml-2">{log.lead.name}</span>
                          </div>
                        )}
                        
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2">{log.payload_received?.email || 'N/A'}</span>
                        </div>
                      </div>
                      
                      {log.error_message && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                          {log.error_message}
                        </div>
                      )}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Log do Webhook</DialogTitle>
                        </DialogHeader>
                        
                        <WebhookLogDetail log={log} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
