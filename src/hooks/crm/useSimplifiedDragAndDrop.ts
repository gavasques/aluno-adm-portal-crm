
import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CRMLead, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';

interface UseSimplifiedDragAndDropProps {
  onMoveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useSimplifiedDragAndDrop = ({ onMoveLeadToColumn }: UseSimplifiedDragAndDropProps) => {
  const [draggedLead, setDraggedLead] = useState<CRMLead | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);

  // Sensores otimizados com melhor responsividade
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduzido para maior responsividade
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Reduzido para dispositivos touch
        tolerance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const startTime = Date.now();
    setDragStartTime(startTime);
    
    console.log('🎯 [DRAG_START] Iniciando drag and drop:', {
      timestamp: new Date().toISOString(),
      activeId: event.active.id,
      startTime
    });
    
    // Prevenir múltiplos drags simultâneos
    if (isMoving) {
      console.log('❌ [DRAG_START] Drag bloqueado - movimento em andamento');
      return;
    }
    
    const leadId = event.active.id as string;
    const leadData = event.active.data?.current as CRMLead;
    
    // Validação robusta dos dados do lead
    if (!leadId || !leadData) {
      console.error('❌ [DRAG_START] Dados do lead inválidos:', {
        leadId,
        hasLeadData: !!leadData,
        leadData
      });
      toast.error('Erro: Dados do lead não encontrados');
      return;
    }

    // Validar integridade do lead
    if (!leadData.id || !leadData.name || !leadData.column_id) {
      console.error('❌ [DRAG_START] Lead com dados incompletos:', {
        id: leadData.id,
        name: leadData.name,
        column_id: leadData.column_id,
        pipeline_id: leadData.pipeline_id
      });
      toast.error('Erro: Lead com dados incompletos');
      return;
    }
    
    setDraggedLead(leadData);
    
    console.log('✅ [DRAG_START] Drag iniciado com sucesso:', {
      leadId: leadData.id,
      leadName: leadData.name,
      currentColumn: leadData.column_id,
      pipeline: leadData.pipeline_id
    });
  }, [isMoving]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const endTime = Date.now();
    const dragDuration = dragStartTime ? endTime - dragStartTime : 0;
    
    console.log('🎯 [DRAG_END] Finalizando drag and drop:', {
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
      console.log('📋 [DRAG_END] Drag cancelado - sem destino válido:', {
        hasOver: !!event.over,
        hasActiveId: !!event.active.id
      });
      return;
    }

    const leadId = event.active.id as string;
    const newColumnId = event.over.id as string;
    const currentLead = event.active.data?.current as CRMLead;

    // Validações críticas antes do movimento
    console.log('🔍 [DRAG_END] Validando movimento:', {
      leadId,
      newColumnId,
      currentLead: {
        id: currentLead?.id,
        name: currentLead?.name,
        currentColumn: currentLead?.column_id,
        pipeline: currentLead?.pipeline_id
      }
    });

    // Validação 1: IDs válidos
    if (!leadId || !newColumnId) {
      console.error('❌ [DRAG_END] IDs inválidos:', { leadId, newColumnId });
      toast.error('Erro: Identificadores inválidos para movimento');
      return;
    }

    // Validação 2: Lead existe e tem dados completos
    if (!currentLead || !currentLead.id || !currentLead.column_id) {
      console.error('❌ [DRAG_END] Lead inválido ou incompleto:', currentLead);
      toast.error('Erro: Lead não encontrado ou dados incompletos');
      return;
    }

    // Validação 3: Verificar se realmente mudou de coluna
    if (currentLead.column_id === newColumnId) {
      console.log('📋 [DRAG_END] Lead já está na coluna correta:', {
        leadName: currentLead.name,
        columnId: newColumnId
      });
      return;
    }

    // Validação 4: Prevenir movimentos durante processamento
    if (isMoving) {
      console.log('❌ [DRAG_END] Movimento bloqueado - já em processamento');
      toast.error('Aguarde o movimento anterior terminar');
      return;
    }

    console.log('🚀 [DRAG_END] Iniciando movimento do lead:', {
      leadName: currentLead.name,
      fromColumn: currentLead.column_id,
      toColumn: newColumnId,
      pipeline: currentLead.pipeline_id
    });
    
    setIsMoving(true);

    try {
      const moveStartTime = Date.now();
      console.log('💾 [DRAG_END] Persistindo movimento no banco...');
      
      await onMoveLeadToColumn(leadId, newColumnId);
      
      const moveDuration = Date.now() - moveStartTime;
      console.log('✅ [DRAG_END] Lead movido com sucesso:', {
        leadName: currentLead.name,
        fromColumn: currentLead.column_id,
        toColumn: newColumnId,
        moveDuration,
        totalDragDuration: dragDuration
      });
      
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`);
      
    } catch (error) {
      console.error('❌ [DRAG_END] Erro ao mover lead:', {
        error,
        leadName: currentLead.name,
        fromColumn: currentLead.column_id,
        toColumn: newColumnId,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
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
        } else if (error.message.includes('foreign key')) {
          errorMessage = 'Erro: Referência inválida no banco de dados';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
      
    } finally {
      // Delay para evitar conflitos de estado
      setTimeout(() => {
        setIsMoving(false);
        console.log('🔄 [DRAG_END] Estado de movimento limpo');
      }, 300);
    }
  }, [onMoveLeadToColumn, isMoving, dragStartTime]);

  return {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd
  };
};
