
import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CRMLead } from '@/types/crm.types';
import { toast } from 'sonner';

interface UseSimplifiedDragAndDropProps {
  onMoveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useSimplifiedDragAndDrop = ({ onMoveLeadToColumn }: UseSimplifiedDragAndDropProps) => {
  const [draggedLead, setDraggedLead] = useState<CRMLead | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const dragStartId = `drag_start_${Date.now()}`;
    
    console.group(`🎯 [DRAG_START_${dragStartId}] INÍCIO DO DRAG`);
    console.log('📋 Event completo:', {
      activeId: event.active.id,
      activeData: event.active.data?.current,
      hasData: !!event.active.data?.current,
      timestamp: new Date().toISOString()
    });
    
    if (isMoving) {
      console.log('❌ [DRAG_START] Drag bloqueado - movimento em andamento');
      console.groupEnd();
      return;
    }
    
    const dragData = event.active.data?.current;
    console.log('📦 [DRAG_START] Dados extraídos:', {
      dragData,
      type: dragData?.type,
      hasLead: !!dragData?.lead
    });
    
    if (!dragData || dragData.type !== 'lead' || !dragData.lead) {
      console.error('❌ [DRAG_START] Dados do drag inválidos:', {
        dragData,
        expectedType: 'lead',
        hasLead: !!dragData?.lead
      });
      toast.error('Erro: Dados do lead inválidos para movimentação');
      console.groupEnd();
      return;
    }
    
    const leadData = dragData.lead as CRMLead;
    
    console.log('📊 [DRAG_START] Dados do lead:', {
      id: leadData.id,
      name: leadData.name,
      column_id: leadData.column_id,
      hasRequiredFields: !!(leadData.id && leadData.name && leadData.column_id)
    });
    
    if (!leadData.id || !leadData.name || !leadData.column_id) {
      console.error('❌ [DRAG_START] Lead com dados incompletos:', {
        id: leadData.id,
        name: leadData.name,
        column_id: leadData.column_id
      });
      toast.error('Erro: Lead com dados incompletos');
      console.groupEnd();
      return;
    }
    
    setDraggedLead(leadData);
    
    console.log('✅ [DRAG_START] Drag iniciado com sucesso:', {
      leadId: leadData.id,
      leadName: leadData.name,
      currentColumn: leadData.column_id
    });
    console.groupEnd();
  }, [isMoving]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const dragEndId = `drag_end_${Date.now()}`;
    
    console.group(`🎯 [DRAG_END_${dragEndId}] FINAL DO DRAG`);
    console.log('📋 Event completo:', {
      activeId: event.active.id,
      overId: event.over?.id,
      draggedLeadId: draggedLead?.id,
      overData: event.over?.data?.current,
      timestamp: new Date().toISOString()
    });
    
    const currentDraggedLead = draggedLead;
    setDraggedLead(null);

    if (!event.over || !currentDraggedLead) {
      console.log('ℹ️ [DRAG_END] Drag cancelado:', {
        hasDestination: !!event.over,
        hasLead: !!currentDraggedLead
      });
      console.groupEnd();
      return;
    }

    const newColumnId = event.over.id as string;

    console.log('📊 [DRAG_END] Dados para movimento:', {
      leadId: currentDraggedLead.id,
      leadName: currentDraggedLead.name,
      fromColumn: currentDraggedLead.column_id,
      toColumn: newColumnId,
      isSameColumn: currentDraggedLead.column_id === newColumnId
    });

    if (!currentDraggedLead.id || !newColumnId) {
      console.error('❌ [DRAG_END] IDs inválidos:', {
        leadId: currentDraggedLead.id,
        newColumnId,
        hasLeadId: !!currentDraggedLead.id,
        hasColumnId: !!newColumnId
      });
      toast.error('Erro: Identificadores inválidos');
      console.groupEnd();
      return;
    }

    if (currentDraggedLead.column_id === newColumnId) {
      console.log('ℹ️ [DRAG_END] Mesmo destino - nenhuma ação necessária');
      console.groupEnd();
      return;
    }

    if (isMoving) {
      console.log('❌ [DRAG_END] Movimento bloqueado - já em processamento');
      toast.error('Aguarde o movimento anterior terminar');
      console.groupEnd();
      return;
    }

    console.log('🚀 [DRAG_END] Iniciando movimento do lead...');
    setIsMoving(true);

    try {
      await onMoveLeadToColumn(currentDraggedLead.id, newColumnId);
      console.log('✅ [DRAG_END] Lead movido com sucesso');
      toast.success(`Lead "${currentDraggedLead.name}" movido com sucesso`, {
        description: `Movido para nova coluna`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('❌ [DRAG_END] Erro ao mover lead:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        leadId: currentDraggedLead.id,
        leadName: currentDraggedLead.name,
        targetColumn: newColumnId
      });
      
      let errorMessage = 'Erro inesperado ao mover lead';
      
      if (error instanceof Error) {
        if (error.message.includes('coluna')) {
          errorMessage = 'Erro: Coluna de destino inválida';
        } else if (error.message.includes('permissão')) {
          errorMessage = 'Erro: Sem permissão para mover este lead';
        } else if (error.message.includes('FULL JOIN')) {
          errorMessage = 'Erro: Problema na consulta do banco de dados';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      toast.error(errorMessage, {
        description: `Lead: ${currentDraggedLead.name} | ID: ${currentDraggedLead.id.slice(0, 8)}...`,
        duration: 8000
      });
      
    } finally {
      setTimeout(() => {
        setIsMoving(false);
        console.log('🔄 [DRAG_END] Flag de movimento liberada');
      }, 300);
      console.groupEnd();
    }
  }, [draggedLead, onMoveLeadToColumn, isMoving]);

  return {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd,
    isDragging: !!draggedLead,
    canDrag: !isMoving
  };
};
