
import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { LeadWithContacts } from '@/types/crm.types';

interface UseOptimizedDragAndDropProps {
  onMoveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useOptimizedDragAndDrop = ({
  onMoveLeadToColumn
}: UseOptimizedDragAndDropProps) => {
  const [draggedLead, setDraggedLead] = useState<LeadWithContacts | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingOperations, setPendingOperations] = useState(0);

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
    
    console.log('🎯 [DRAG_START] Iniciando drag:', {
      activeId: active.id,
      activeData: active.data.current
    });

    // Extrair dados do lead do active data
    const leadData = active.data.current;
    
    if (leadData?.lead) {
      setDraggedLead(leadData.lead);
      setIsDragging(true);
      console.log('🎯 [DRAG_START] Lead configurado para drag:', {
        leadId: leadData.lead.id,
        leadName: leadData.lead.name,
        currentColumn: leadData.lead.column_id
      });
    } else {
      console.warn('⚠️ [DRAG_START] Dados do lead não encontrados no drag start');
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('🎯 [DRAG_END] Finalizando drag:', {
      activeId: active.id,
      overId: over?.id,
      draggedLead: draggedLead?.id
    });

    setIsDragging(false);
    
    if (!over || !draggedLead) {
      console.log('🎯 [DRAG_END] Drag cancelado - sem destino ou lead');
      setDraggedLead(null);
      return;
    }

    const newColumnId = over.id as string;
    const currentColumnId = draggedLead.column_id;

    if (newColumnId === currentColumnId) {
      console.log('🎯 [DRAG_END] Mesmo destino - nenhuma ação necessária');
      setDraggedLead(null);
      return;
    }

    try {
      setIsMoving(true);
      setPendingOperations(prev => prev + 1);
      
      console.log('🚀 [DRAG_END] Movendo lead:', {
        leadId: draggedLead.id,
        leadName: draggedLead.name,
        from: currentColumnId,
        to: newColumnId
      });

      await onMoveLeadToColumn(draggedLead.id, newColumnId);
      
      console.log('✅ [DRAG_END] Lead movido com sucesso');
      
    } catch (error) {
      console.error('❌ [DRAG_END] Erro ao mover lead:', error);
    } finally {
      setIsMoving(false);
      setPendingOperations(prev => Math.max(0, prev - 1));
      setDraggedLead(null);
    }
  }, [draggedLead, onMoveLeadToColumn]);

  const canDrag = useCallback((leadId: string) => {
    return !isMoving && !isDragging && pendingOperations === 0;
  }, [isMoving, isDragging, pendingOperations]);

  return {
    draggedLead,
    isMoving,
    isDragging,
    canDrag,
    pendingOperations,
    sensors,
    handleDragStart,
    handleDragEnd
  };
};
