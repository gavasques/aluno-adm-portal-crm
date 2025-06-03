
import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CRMLead, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';

interface UseUnifiedDragAndDropProps {
  onMoveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useUnifiedDragAndDrop = ({ onMoveLeadToColumn }: UseUnifiedDragAndDropProps) => {
  const [draggedLead, setDraggedLead] = useState<CRMLead | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);

  // Sensores otimizados para diferentes dispositivos
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Responsividade otimizada
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  );

  const validateDragOperation = useCallback((leadData: any, newColumnId?: string): boolean => {
    if (!leadData || !leadData.id || !leadData.name || !leadData.column_id) {
      console.error('❌ [UNIFIED_DRAG] Lead com dados incompletos:', leadData);
      return false;
    }

    if (newColumnId && leadData.column_id === newColumnId) {
      console.log('📋 [UNIFIED_DRAG] Lead já está na coluna correta');
      return false;
    }

    return true;
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const startTime = Date.now();
    setDragStartTime(startTime);
    
    console.log('🎯 [UNIFIED_DRAG] Iniciando drag and drop:', {
      timestamp: new Date().toISOString(),
      activeId: event.active.id,
      startTime
    });
    
    if (isMoving) {
      console.log('❌ [UNIFIED_DRAG] Drag bloqueado - movimento em andamento');
      return;
    }
    
    const leadId = event.active.id as string;
    const leadData = event.active.data?.current as CRMLead;
    
    if (!validateDragOperation(leadData)) {
      toast.error('Erro: Dados do lead inválidos para movimentação');
      return;
    }
    
    setDraggedLead(leadData);
    
    console.log('✅ [UNIFIED_DRAG] Drag iniciado com sucesso:', {
      leadId: leadData.id,
      leadName: leadData.name,
      currentColumn: leadData.column_id,
      pipeline: leadData.pipeline_id
    });
  }, [isMoving, validateDragOperation]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const endTime = Date.now();
    const dragDuration = dragStartTime ? endTime - dragStartTime : 0;
    
    console.log('🎯 [UNIFIED_DRAG] Finalizando drag and drop:', {
      timestamp: new Date().toISOString(),
      activeId: event.active.id,
      overId: event.over?.id,
      dragDuration,
      endTime
    });
    
    // Limpar estado independente do resultado
    setDraggedLead(null);
    setDragStartTime(null);

    if (!event.over || !event.active.id) {
      console.log('📋 [UNIFIED_DRAG] Drag cancelado - sem destino válido');
      return;
    }

    const leadId = event.active.id as string;
    const newColumnId = event.over.id as string;
    const currentLead = event.active.data?.current as CRMLead;

    // Validações unificadas
    if (!validateDragOperation(currentLead, newColumnId)) {
      toast.error('Erro: Operação de movimentação inválida');
      return;
    }

    if (isMoving) {
      console.log('❌ [UNIFIED_DRAG] Movimento bloqueado - já em processamento');
      toast.error('Aguarde o movimento anterior terminar');
      return;
    }

    console.log('🚀 [UNIFIED_DRAG] Iniciando movimento do lead:', {
      leadName: currentLead.name,
      fromColumn: currentLead.column_id,
      toColumn: newColumnId,
      pipeline: currentLead.pipeline_id
    });
    
    setIsMoving(true);

    try {
      const moveStartTime = Date.now();
      console.log('💾 [UNIFIED_DRAG] Persistindo movimento no banco...');
      
      await onMoveLeadToColumn(leadId, newColumnId);
      
      const moveDuration = Date.now() - moveStartTime;
      console.log('✅ [UNIFIED_DRAG] Lead movido com sucesso:', {
        leadName: currentLead.name,
        fromColumn: currentLead.column_id,
        toColumn: newColumnId,
        moveDuration,
        totalDragDuration: dragDuration
      });
      
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`);
      
    } catch (error) {
      console.error('❌ [UNIFIED_DRAG] Erro ao mover lead:', {
        error,
        leadName: currentLead.name,
        fromColumn: currentLead.column_id,
        toColumn: newColumnId,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro inesperado ao mover lead';
      
      if (error instanceof Error) {
        if (error.message.includes('column')) {
          errorMessage = 'Erro: Coluna de destino inválida';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Erro: Sem permissão para mover este lead';
        } else if (error.message.includes('pipeline')) {
          errorMessage = 'Erro: Pipeline incompatível';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
      
    } finally {
      // Delay para evitar conflitos de estado
      setTimeout(() => {
        setIsMoving(false);
        console.log('🔄 [UNIFIED_DRAG] Estado de movimento limpo');
      }, 300);
    }
  }, [onMoveLeadToColumn, isMoving, dragStartTime, validateDragOperation]);

  return {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd,
    // Estados úteis para componentes
    isDragging: !!draggedLead,
    canDrag: !isMoving
  };
};
