import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { CRMLead, LeadStatus } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useUltraSimplifiedLeadMovement } from '@/hooks/crm/useUltraSimplifiedLeadMovement';
import { useLeadStatusChange } from '@/hooks/crm/useLeadStatusChange';
import StatusChangeDialog from '@/components/admin/crm/status/StatusChangeDialog';
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
  const { moveLeadToColumn } = useUltraSimplifiedLeadMovement({ 
    filters: {
      pipeline_id: lead.pipeline_id || '',
      responsible_id: '',
      tag_ids: [],
      search: '',
      contact_filter: ''
    }
  });
  const { changeStatus } = useLeadStatusChange();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Encontrar pipeline atual e suas colunas
  const currentPipeline = pipelines.find(p => p.id === lead.pipeline_id);
  const columns = currentPipeline?.columns?.sort((a, b) => a.sort_order - b.sort_order) || [];
  const currentColumnIndex = columns.findIndex(col => col.id === lead.column_id);

  const canMoveBack = currentColumnIndex > 0;
  const canMoveForward = currentColumnIndex < columns.length - 1;

  const handleMoveBack = async () => {
    if (!canMoveBack || isMoving) return;
    
    setIsMoving(true);
    try {
      const previousColumn = columns[currentColumnIndex - 1];
      await moveLeadToColumn(lead.id, previousColumn.id);
      onLeadUpdate();
    } catch (error) {
      console.error('Erro ao mover lead para trás:', error);
      toast.error('Erro ao mover lead');
    } finally {
      setIsMoving(false);
    }
  };

  const handleMoveForward = async () => {
    if (!canMoveForward || isMoving) return;
    
    setIsMoving(true);
    try {
      const nextColumn = columns[currentColumnIndex + 1];
      await moveLeadToColumn(lead.id, nextColumn.id);
      onLeadUpdate();
    } catch (error) {
      console.error('Erro ao mover lead para frente:', error);
      toast.error('Erro ao mover lead');
    } finally {
      setIsMoving(false);
    }
  };

  const handleStatusChange = async (status: LeadStatus, reason?: string, lossReasonId?: string) => {
    setIsChangingStatus(true);
    try {
      await changeStatus({ leadId: lead.id, status, reason, lossReasonId });
      onLeadUpdate();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    } finally {
      setIsChangingStatus(false);
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
      <div className="flex items-center gap-4 p-4 bg-gray-50 border-t border-gray-200">
        {/* Controles de Pipeline - Ultra Simplificados */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Pipeline:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMoveBack}
            disabled={!canMoveBack || isMoving}
            className="h-8 px-2"
          >
            {isMoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          
          <span className="text-sm text-gray-600 min-w-[120px] text-center">
            {lead.column?.name || 'Sem estágio'}
            {currentColumnIndex >= 0 && ` (${currentColumnIndex + 1}/${columns.length})`}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleMoveForward}
            disabled={!canMoveForward || isMoving}
            className="h-8 px-2"
          >
            {isMoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
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
            disabled={isChangingStatus}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {isChangingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    getStatusIcon(lead.status)
                  )}
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
