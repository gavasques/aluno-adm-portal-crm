
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

  // Sensores otimizados
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
    console.log('🎯 [DRAG_START] Event completo:', {
      activeId: event.active.id,
      activeData: event.active.data?.current,
      hasData: !!event.active.data?.current
    });
    
    if (isMoving) {
      console.log('❌ [DRAG_START] Drag bloqueado - movimento em andamento');
      return;
    }
    
    // Extrair dados do lead corretamente
    const dragData = event.active.data?.current;
    console.log('📦 [DRAG_START] Dados extraídos:', dragData);
    
    if (!dragData || dragData.type !== 'lead' || !dragData.lead) {
      console.error('❌ [DRAG_START] Dados do drag inválidos:', dragData);
      toast.error('Erro: Dados do lead inválidos para movimentação');
      return;
    }
    
    const leadData = dragData.lead as CRMLead;
    
    if (!leadData.id || !leadData.name || !leadData.column_id) {
      console.error('❌ [DRAG_START] Lead com dados incompletos:', leadData);
      toast.error('Erro: Lead com dados incompletos');
      return;
    }
    
    setDraggedLead(leadData);
    
    console.log('✅ [DRAG_START] Drag iniciado com sucesso:', {
      leadId: leadData.id,
      leadName: leadData.name,
      currentColumn: leadData.column_id
    });
  }, [isMoving]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    console.log('🎯 [DRAG_END] Event completo:', {
      activeId: event.active.id,
      overId: event.over?.id,
      draggedLeadId: draggedLead?.id,
      overData: event.over?.data?.current
    });
    
    // Limpar estado
    const currentDraggedLead = draggedLead;
    setDraggedLead(null);

    if (!event.over || !currentDraggedLead) {
      console.log('📋 [DRAG_END] Drag cancelado - sem destino ou lead');
      return;
    }

    const newColumnId = event.over.id as string;

    // Validações básicas
    if (!currentDraggedLead.id || !newColumnId) {
      console.error('❌ [DRAG_END] IDs inválidos:', {
        leadId: currentDraggedLead.id,
        newColumnId
      });
      toast.error('Erro: Identificadores inválidos');
      return;
    }

    if (currentDraggedLead.column_id === newColumnId) {
      console.log('📋 [DRAG_END] Mesmo destino - nenhuma ação necessária');
      return;
    }

    if (isMoving) {
      console.log('❌ [DRAG_END] Movimento bloqueado - já em processamento');
      toast.error('Aguarde o movimento anterior terminar');
      return;
    }

    console.log('🚀 [DRAG_END] Iniciando movimento do lead:', {
      leadId: currentDraggedLead.id,
      leadName: currentDraggedLead.name,
      fromColumn: currentDraggedLead.column_id,
      toColumn: newColumnId
    });
    
    setIsMoving(true);

    try {
      await onMoveLeadToColumn(currentDraggedLead.id, newColumnId);
      console.log('✅ [DRAG_END] Lead movido com sucesso');
      toast.success(`Lead "${currentDraggedLead.name}" movido com sucesso`);
      
    } catch (error) {
      console.error('❌ [DRAG_END] Erro ao mover lead:', error);
      
      let errorMessage = 'Erro inesperado ao mover lead';
      
      if (error instanceof Error) {
        if (error.message.includes('coluna')) {
          errorMessage = 'Erro: Coluna de destino inválida';
        } else if (error.message.includes('permissão')) {
          errorMessage = 'Erro: Sem permissão para mover este lead';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
      
    } finally {
      setTimeout(() => {
        setIsMoving(false);
      }, 300);
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
