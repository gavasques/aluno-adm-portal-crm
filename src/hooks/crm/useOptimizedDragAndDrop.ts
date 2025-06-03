
import { useState, useCallback, useRef } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CRMLead } from '@/types/crm.types';
import { toast } from 'sonner';
import { measureAsyncOperation } from '@/utils/performanceMonitor';

interface UseOptimizedDragAndDropProps {
  onMoveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useOptimizedDragAndDrop = ({ onMoveLeadToColumn }: UseOptimizedDragAndDropProps) => {
  const [draggedLead, setDraggedLead] = useState<CRMLead | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const dragStartTimeRef = useRef<number | null>(null);
  const pendingOperationsRef = useRef<Set<string>>(new Set());

  // Sensores otimizados com debounce
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduzido para maior responsividade
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50, // Reduzido significativamente
        tolerance: 5,
      },
    })
  );

  const validateDragOperation = useCallback((leadData: any, newColumnId?: string): boolean => {
    if (!leadData?.id || !leadData?.name || !leadData?.column_id) {
      console.error('❌ [OPTIMIZED_DRAG] Lead com dados incompletos:', leadData);
      return false;
    }

    if (newColumnId && leadData.column_id === newColumnId) {
      return false; // Sem movimento necessário
    }

    if (pendingOperationsRef.current.has(leadData.id)) {
      console.log('⚠️ [OPTIMIZED_DRAG] Operação já em andamento para lead:', leadData.id);
      return false;
    }

    return true;
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const startTime = performance.now();
    dragStartTimeRef.current = startTime;
    
    if (isMoving) {
      console.log('❌ [OPTIMIZED_DRAG] Drag bloqueado - movimento em andamento');
      return;
    }
    
    const leadData = event.active.data?.current as CRMLead;
    
    if (!validateDragOperation(leadData)) {
      toast.error('Erro: Dados do lead inválidos para movimentação');
      return;
    }
    
    setDraggedLead(leadData);
    
    console.log('✅ [OPTIMIZED_DRAG] Drag iniciado:', {
      leadId: leadData.id,
      leadName: leadData.name,
      startTime
    });
  }, [isMoving, validateDragOperation]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const endTime = performance.now();
    const dragDuration = dragStartTimeRef.current ? endTime - dragStartTimeRef.current : 0;
    
    // Limpar estado de drag imediatamente
    setDraggedLead(null);
    dragStartTimeRef.current = null;

    if (!event.over || !event.active.id) {
      return;
    }

    const leadId = event.active.id as string;
    const newColumnId = event.over.id as string;
    const currentLead = event.active.data?.current as CRMLead;

    if (!validateDragOperation(currentLead, newColumnId)) {
      return;
    }

    // Verificar operações pendentes
    if (pendingOperationsRef.current.has(leadId)) {
      toast.error('Operação já em andamento para este lead');
      return;
    }

    console.log('🚀 [OPTIMIZED_DRAG] Iniciando movimento otimizado:', {
      leadName: currentLead.name,
      fromColumn: currentLead.column_id,
      toColumn: newColumnId,
      dragDuration
    });
    
    // Adicionar à lista de operações pendentes
    pendingOperationsRef.current.add(leadId);
    setIsMoving(true);

    try {
      await measureAsyncOperation(
        'lead_movement_operation',
        () => onMoveLeadToColumn(leadId, newColumnId)
      );
      
      console.log('✅ [OPTIMIZED_DRAG] Lead movido com sucesso');
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`);
      
    } catch (error) {
      console.error('❌ [OPTIMIZED_DRAG] Erro ao mover lead:', error);
      
      let errorMessage = 'Erro inesperado ao mover lead';
      if (error instanceof Error) {
        if (error.message.includes('column')) {
          errorMessage = 'Erro: Coluna de destino inválida';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Erro: Sem permissão para mover este lead';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
      
    } finally {
      // Remover da lista de operações pendentes
      pendingOperationsRef.current.delete(leadId);
      
      // Delay para evitar conflitos de estado
      setTimeout(() => {
        setIsMoving(false);
      }, 100); // Reduzido para maior responsividade
    }
  }, [onMoveLeadToColumn, validateDragOperation]);

  return {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd,
    // Estados derivados otimizados
    isDragging: !!draggedLead,
    canDrag: !isMoving,
    pendingOperations: pendingOperationsRef.current.size
  };
};
