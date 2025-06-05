
import { useState, useCallback } from 'react';
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CRMLead } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';

interface UseUltraSimplifiedDragAndDropProps {
  onMoveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useUltraSimplifiedDragAndDrop = ({
  onMoveLeadToColumn
}: UseUltraSimplifiedDragAndDropProps) => {
  const [draggedLead, setDraggedLead] = useState<CRMLead | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    
    if (!active || !active.data.current) {
      debugLogger.warn('🚫 [ULTRA_SIMPLIFIED_DRAG] DragStart: Dados inválidos', { active });
      return;
    }

    const leadData = active.data.current.lead;
    if (!leadData) {
      debugLogger.warn('🚫 [ULTRA_SIMPLIFIED_DRAG] DragStart: Lead não encontrado', { activeData: active.data.current });
      return;
    }

    debugLogger.info('🎯 [ULTRA_SIMPLIFIED_DRAG] DragStart:', {
      leadId: leadData.id,
      leadName: leadData.name,
      currentColumn: leadData.column_id,
      timestamp: new Date().toISOString()
    });

    setDraggedLead(leadData);
    setIsDragging(true);
    setCanDrag(false);
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    debugLogger.info('🏁 [ULTRA_SIMPLIFIED_DRAG] DragEnd iniciado:', {
      activeId: active?.id,
      overId: over?.id,
      activeData: active?.data?.current,
      overData: over?.data?.current,
      timestamp: new Date().toISOString()
    });

    setIsDragging(false);
    
    if (!over || !active || !draggedLead) {
      debugLogger.warn('🚫 [ULTRA_SIMPLIFIED_DRAG] DragEnd: Dados insuficientes', {
        hasOver: !!over,
        hasActive: !!active,
        hasDraggedLead: !!draggedLead
      });
      
      setDraggedLead(null);
      setCanDrag(true);
      return;
    }

    const targetColumnId = over.data?.current?.columnId || over.id;
    const sourceColumnId = draggedLead.column_id;

    debugLogger.info('🎯 [ULTRA_SIMPLIFIED_DRAG] Processando movimento:', {
      leadId: draggedLead.id,
      leadName: draggedLead.name,
      sourceColumnId,
      targetColumnId,
      sameColumn: sourceColumnId === targetColumnId
    });

    // Se solto na mesma coluna, não fazer nada
    if (sourceColumnId === targetColumnId) {
      debugLogger.info('↩️ [ULTRA_SIMPLIFIED_DRAG] Mesma coluna - cancelando movimento');
      setDraggedLead(null);
      setCanDrag(true);
      return;
    }

    setIsMoving(true);

    try {
      await onMoveLeadToColumn(draggedLead.id, targetColumnId as string);
      
      debugLogger.info('✅ [ULTRA_SIMPLIFIED_DRAG] Movimento concluído com sucesso:', {
        leadId: draggedLead.id,
        from: sourceColumnId,
        to: targetColumnId,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      debugLogger.error('❌ [ULTRA_SIMPLIFIED_DRAG] Erro no movimento:', {
        leadId: draggedLead.id,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    } finally {
      setDraggedLead(null);
      setIsMoving(false);
      // Pequeno delay para evitar cliques acidentais
      setTimeout(() => setCanDrag(true), 100);
    }
  }, [draggedLead, onMoveLeadToColumn]);

  return {
    draggedLead,
    isMoving,
    isDragging,
    canDrag,
    sensors,
    handleDragStart,
    handleDragEnd
  };
};
