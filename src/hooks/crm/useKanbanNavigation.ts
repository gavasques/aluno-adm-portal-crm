
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRMLead } from '@/types/crm.types';

export const useKanbanNavigation = () => {
  const navigate = useNavigate();

  const handleOpenDetail = useCallback((lead: CRMLead, isDragging: boolean, isMoving: boolean) => {
    if (isDragging || isMoving) return; // Evitar navegação durante drag/move
    console.log('🔗 Navigating to modern lead detail page:', lead.id);
    navigate(`/admin/lead/${lead.id}`);
  }, [navigate]);

  return { handleOpenDetail };
};
