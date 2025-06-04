
import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CRMLead } from '@/types/crm.types';
import { toast } from 'sonner';
import { debugLogger } from '@/utils/debug-logger';

interface UseUltraSimplifiedDragAndDropProps {
  onMoveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useUltraSimplifiedDragAndDrop = ({ onMoveLeadToColumn }: UseUltraSimplifiedDragAndDropProps) => {
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
    const dragStartId = `ultra_simple_drag_start_${Date.now()}`;
    
    debugLogger.info(`🎯 [ULTRA_SIMPLE_DRAG_START_${dragStartId}] INÍCIO`, {
      activeId: event.active.id,
      isMoving,
      timestamp: new Date().toISOString()
    });
    
    if (isMoving) {
      debugLogger.warn('❌ [DRAG_START] Drag bloqueado - movimento em andamento');
      toast.warning('Aguarde o movimento anterior terminar');
      return;
    }
    
    const dragData = event.active.data?.current;
    
    if (!dragData || dragData.type !== 'lead' || !dragData.lead) {
      debugLogger.error('❌ [DRAG_START] Dados do drag inválidos:', {
        hasData: !!dragData,
        type: dragData?.type,
        hasLead: !!dragData?.lead
      });
      toast.error('Erro: Dados do lead inválidos para movimentação');
      return;
    }
    
    const leadData = dragData.lead as CRMLead;
    
    // Validação rigorosa dos dados do lead
    if (!leadData.id || !leadData.name || !leadData.column_id) {
      debugLogger.error('❌ [DRAG_START] Lead com dados incompletos:', {
        hasId: !!leadData.id,
        hasName: !!leadData.name,
        hasColumnId: !!leadData.column_id,
        leadData: {
          id: leadData.id,
          name: leadData.name,
          column_id: leadData.column_id
        }
      });
      toast.error('Erro: Lead com dados incompletos');
      return;
    }
    
    setDraggedLead(leadData);
    
    debugLogger.info('✅ [DRAG_START] Drag iniciado com sucesso:', {
      leadId: leadData.id,
      leadName: leadData.name,
      currentColumn: leadData.column_id
    });
  }, [isMoving]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const dragEndId = `ultra_simple_drag_end_${Date.now()}`;
    
    debugLogger.info(`🎯 [ULTRA_SIMPLE_DRAG_END_${dragEndId}] FINAL`, {
      hasDestination: !!event.over,
      hasLead: !!draggedLead,
      isMoving,
      timestamp: new Date().toISOString()
    });
    
    const currentDraggedLead = draggedLead;
    setDraggedLead(null);

    if (!event.over || !currentDraggedLead) {
      debugLogger.info('ℹ️ [DRAG_END] Drag cancelado - sem destino ou lead');
      return;
    }

    const newColumnId = event.over.id as string;

    debugLogger.info('📊 [DRAG_END] Dados para movimento:', {
      leadId: currentDraggedLead.id,
      leadName: currentDraggedLead.name,
      fromColumn: currentDraggedLead.column_id,
      toColumn: newColumnId,
      isSameColumn: currentDraggedLead.column_id === newColumnId
    });

    // Validações básicas
    if (!currentDraggedLead.id || !newColumnId) {
      debugLogger.error('❌ [DRAG_END] IDs inválidos:', {
        leadId: currentDraggedLead.id,
        newColumnId
      });
      toast.error('Erro: Identificadores inválidos');
      return;
    }

    if (currentDraggedLead.column_id === newColumnId) {
      debugLogger.info('ℹ️ [DRAG_END] Mesmo destino - nenhuma ação necessária');
      return;
    }

    if (isMoving) {
      debugLogger.warn('❌ [DRAG_END] Movimento bloqueado - já em processamento');
      toast.warning('Aguarde o movimento anterior terminar');
      return;
    }

    debugLogger.info('🚀 [DRAG_END] Iniciando movimento ultra simplificado do lead...');
    setIsMoving(true);

    try {
      await onMoveLeadToColumn(currentDraggedLead.id, newColumnId);
      
      debugLogger.info('✅ [DRAG_END] Lead movido com sucesso (ultra simplificado)');
      
    } catch (error) {
      debugLogger.error('❌ [DRAG_END] Erro ao mover lead:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        leadId: currentDraggedLead.id,
        leadName: currentDraggedLead.name,
        targetColumn: newColumnId
      });
      
      // Erro já foi tratado no hook de movimento, não precisa mostrar toast aqui
      
    } finally {
      // Delay para evitar conflitos de estado
      setTimeout(() => {
        setIsMoving(false);
        debugLogger.info('🔄 [DRAG_END] Flag de movimento liberada');
      }, 500);
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
