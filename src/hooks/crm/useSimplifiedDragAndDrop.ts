
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

  // Configurar sensores mais permissivos
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduzir distância para ativação
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Reduzir delay
        tolerance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log('🔄 Drag iniciado:', event.active.id);
    
    const leadId = event.active.id as string;
    const leadData = event.active.data?.current as CRMLead;
    
    if (leadData) {
      setDraggedLead(leadData);
      console.log('📋 Lead sendo arrastado:', leadData.name);
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('🔄 Drag finalizado:', { activeId: active.id, overId: over?.id });
    
    setDraggedLead(null);

    if (!over || !active.id) {
      console.log('❌ Drag cancelado - sem destino válido');
      return;
    }

    const leadId = active.id as string;
    const newColumnId = over.id as string;
    const currentLead = active.data?.current as CRMLead;

    // Verificar se realmente mudou de coluna
    if (currentLead?.column_id === newColumnId) {
      console.log('🔄 Lead já está na coluna correta');
      return;
    }

    console.log(`🔄 Movendo lead ${leadId} para coluna ${newColumnId}`);
    
    setIsMoving(true);

    try {
      await onMoveLeadToColumn(leadId, newColumnId);
      toast.success('Lead movido com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao mover lead:', error);
      toast.error('Erro ao mover lead. Tente novamente.');
      
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
