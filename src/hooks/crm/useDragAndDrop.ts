
import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, DragOverEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CRMLead, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';

interface UseDragAndDropProps {
  leadsByColumn: Record<string, LeadWithContacts[]>;
  moveLeadToColumn: (leadId: string, newColumnId: string) => Promise<void>;
}

export const useDragAndDrop = ({ leadsByColumn, moveLeadToColumn }: UseDragAndDropProps) => {
  const [activeLead, setActiveLead] = useState<CRMLead | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // Configurar sensores mais responsivos para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (isMoving) return; // Prevenir múltiplos drags simultâneos
    
    const leadId = event.active.id as string;
    
    const lead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    
    setActiveLead(lead || null);
    setIsDragging(true);
    
    const currentColumnId = Object.keys(leadsByColumn).find(columnId => 
      leadsByColumn[columnId].some(l => l.id === leadId)
    );
    setActiveColumnId(currentColumnId || null);
    
    console.log('🔄 Drag started for lead:', leadId, 'in column:', currentColumnId);
  }, [leadsByColumn, isMoving]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setActiveColumnId(over.id as string);
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveLead(null);
    setActiveColumnId(null);
    setIsDragging(false);

    if (!over || isMoving) {
      console.log('❌ Drag cancelled - no drop target or already moving');
      return;
    }

    const leadId = active.id as string;
    const newColumnId = over.id as string;

    const currentLead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    
    if (!currentLead) {
      console.error('❌ Lead not found:', leadId);
      toast.error('Erro: Lead não encontrado');
      return;
    }

    if (currentLead.column_id === newColumnId) {
      console.log('🔄 Same column, no action needed');
      return;
    }

    console.log(`🔄 Moving lead ${leadId} from ${currentLead.column_id} to ${newColumnId}`);
    
    setIsMoving(true);

    try {
      await moveLeadToColumn(leadId, newColumnId);
      console.log('✅ Lead moved successfully');
      toast.success('Lead movido com sucesso');
      
    } catch (error) {
      console.error('❌ Error moving lead:', error);
      toast.error('Erro ao mover lead. Operação revertida.');
      
    } finally {
      setIsMoving(false);
    }
  }, [leadsByColumn, moveLeadToColumn, isMoving]);

  return {
    activeLead,
    activeColumnId,
    isDragging,
    isMoving,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
