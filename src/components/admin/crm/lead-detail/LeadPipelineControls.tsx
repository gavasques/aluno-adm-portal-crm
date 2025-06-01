
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { CRMLead, LeadStatus } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeadMovement } from '@/hooks/crm/useCRMLeadMovement';
import { useLeadStatusChange } from '@/hooks/crm/useLeadStatusChange';
import StatusChangeDialog from '@/components/admin/crm/status/StatusChangeDialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface LeadPipelineControlsProps {
  lead: CRMLead;
  onLeadUpdate: () => void;
}

export const LeadPipelineControls: React.FC<LeadPipelineControlsProps> = ({
  lead,
  onLeadUpdate
}) => {
  const { pipelines } = useCRMPipelines();
  const { moveLeadToColumn } = useCRMLeadMovement({});
  const { changeStatus } = useLeadStatusChange();
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Encontrar pipeline atual e suas colunas
  const currentPipeline = pipelines.find(p => p.id === lead.pipeline_id);
  const columns = currentPipeline?.columns?.sort((a, b) => a.sort_order - b.sort_order) || [];
  const currentColumnIndex = columns.findIndex(col => col.id === lead.column_id);

  const canMoveBack = currentColumnIndex > 0;
  const canMoveForward = currentColumnIndex < columns.length - 1;

  const handleMoveBack = async () => {
    if (!canMoveBack) return;
    
    try {
      const previousColumn = columns[currentColumnIndex - 1];
      await moveLeadToColumn(lead.id, previousColumn.id);
      toast.success(`Lead movido para "${previousColumn.name}"`);
      onLeadUpdate();
    } catch (error) {
      toast.error('Erro ao mover lead');
    }
  };

  const handleMoveForward = async () => {
    if (!canMoveForward) return;
    
    try {
      const nextColumn = columns[currentColumnIndex + 1];
      await moveLeadToColumn(lead.id, nextColumn.id);
      toast.success(`Lead movido para "${nextColumn.name}"`);
      onLeadUpdate();
    } catch (error) {
      toast.error('Erro ao mover lead');
    }
  };

  const handleStatusChange = async (status: LeadStatus, reason?: string, lossReasonId?: string) => {
    try {
      await changeStatus({ leadId: lead.id, status, reason, lossReasonId });
      onLeadUpdate();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const getStatusIcon = (status: LeadStatus) => {
    switch (status) {
      case 'aberto':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      case 'ganho':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'perdido':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusLabel = (status: LeadStatus) => {
    switch (status) {
      case 'aberto':
        return 'Em Aberto';
      case 'ganho':
        return 'Ganho';
      case 'perdido':
        return 'Perdido';
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-gray-50/50 border-t border-gray-200/50">
        {/* Controles de Pipeline */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Pipeline:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMoveBack}
            disabled={!canMoveBack}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600 min-w-[120px] text-center">
            {lead.column?.name || 'Sem estágio'}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleMoveForward}
            disabled={!canMoveForward}
            className="h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Divisor */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Status do Lead */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <Select
            value={lead.status}
            onValueChange={(status: LeadStatus) => {
              if (status === 'ganho' || status === 'perdido') {
                setShowStatusDialog(true);
              } else {
                handleStatusChange(status);
              }
            }}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {getStatusIcon(lead.status)}
                  <span className="text-sm">{getStatusLabel(lead.status)}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aberto">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  Em Aberto
                </div>
              </SelectItem>
              <SelectItem value="ganho">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Ganho
                </div>
              </SelectItem>
              <SelectItem value="perdido">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Perdido
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <StatusChangeDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        leadName={lead.name}
        currentStatus={lead.status}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};
