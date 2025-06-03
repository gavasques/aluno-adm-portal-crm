
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

  // Configurar sensores mais responsivos
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Menor distância para ativação
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50, // Delay reduzido
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log('🔄 DRAG START:', event.active.id);
    
    const leadId = event.active.id as string;
    const leadData = event.active.data?.current as CRMLead;
    
    if (leadData) {
      setDraggedLead(leadData);
      console.log('📋 Lead sendo arrastado:', {
        id: leadData.id,
        name: leadData.name,
        currentColumn: leadData.column_id
      });
    } else {
      console.warn('⚠️ Dados do lead não encontrados no drag start');
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('🔄 DRAG END:', { 
      activeId: active.id, 
      overId: over?.id,
      activeData: active.data?.current,
      overData: over?.data?.current
    });
    
    setDraggedLead(null);

    if (!over || !active.id) {
      console.log('❌ Drag cancelado - sem destino válido');
      return;
    }

    const leadId = active.id as string;
    const newColumnId = over.id as string;
    const currentLead = active.data?.current as CRMLead;

    // Validações básicas
    if (!leadId || !newColumnId) {
      console.error('❌ IDs inválidos:', { leadId, newColumnId });
      toast.error('Erro: IDs inválidos');
      return;
    }

    // Verificar se realmente mudou de coluna
    if (currentLead?.column_id === newColumnId) {
      console.log('🔄 Lead já está na coluna correta');
      return;
    }

    console.log(`🔄 Iniciando movimento: ${leadId} -> ${newColumnId}`, {
      leadName: currentLead?.name,
      fromColumn: currentLead?.column_id,
      toColumn: newColumnId
    });
    
    setIsMoving(true);

    try {
      await onMoveLeadToColumn(leadId, newColumnId);
      console.log('✅ Lead movido com sucesso');
      toast.success('Lead movido com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao mover lead:', error);
      
      // Mensagens de erro mais específicas
      if (error instanceof Error) {
        if (error.message.includes('column')) {
          toast.error('Erro: Coluna de destino inválida');
        } else if (error.message.includes('permission')) {
          toast.error('Erro: Sem permissão para mover este lead');
        } else {
          toast.error(`Erro ao mover lead: ${error.message}`);
        }
      } else {
        toast.error('Erro inesperado ao mover lead');
      }
      
    } finally {
      setIsMoving(false);
    }
  }, [onMoveLeadToColumn]);

  return {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd
  };
};
