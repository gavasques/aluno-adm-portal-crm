
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRMLead } from '@/types/crm.types';

export const useKanbanNavigation = () => {
  const navigate = useNavigate();

  const handleOpenDetail = useCallback((lead: CRMLead, isDragging?: boolean, isMoving?: boolean) => {
    // Prevenir abertura durante drag ou movimento
    if (isDragging || isMoving) {
      console.log('🚫 Navigation blocked - drag or move in progress');
      return;
    }

    // Verificar se o lead existe e tem ID válido
    if (!lead || !lead.id) {
      console.error('❌ Invalid lead data for navigation:', lead);
      return;
    }

    try {
      console.log('🔄 Navigating to lead detail:', lead.id);
      // Usar a rota correta /admin/lead/{id}
      navigate(`/admin/lead/${lead.id}`);
    } catch (error) {
      console.error('❌ Error navigating to lead detail:', error);
    }
  }, [navigate]);

  return {
    handleOpenDetail
  };
};
