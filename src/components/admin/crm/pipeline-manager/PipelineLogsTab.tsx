
import React from 'react';
import { WebhookLogsList } from '../webhook-logs/WebhookLogsList';
import { WebhookStatsCards } from '../webhook-logs/WebhookStatsCards';
import { CRMPipeline } from '@/types/crm.types';

interface PipelineLogsTabProps {
  pipeline: CRMPipeline;
}

export const PipelineLogsTab = ({ pipeline }: PipelineLogsTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Logs do Webhook - {pipeline.name}
        </h3>
        <p className="text-sm text-gray-600">
          Histórico de requisições recebidas neste pipeline
        </p>
      </div>
      
      <WebhookStatsCards pipelineId={pipeline.id} />
      
      <WebhookLogsList pipelineId={pipeline.id} />
    </div>
  );
};
