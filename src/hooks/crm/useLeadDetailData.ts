
import { useState, useCallback, useMemo } from 'react';
import { CRMLead } from '@/types/crm.types';

interface UseLeadDetailDataProps {
  lead: CRMLead | null;
}

export const useLeadDetailData = ({ lead }: UseLeadDetailDataProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'attachments' | 'comments' | 'history'>('overview');

  // Função wrapper para compatibilidade com o componente Tabs
  const handleTabChange = useCallback((value: string) => {
    if (value === 'overview' || value === 'contacts' || value === 'attachments' || value === 'comments' || value === 'history') {
      setActiveTab(value);
    }
  }, []);

  // Mock data para contadores - em um cenário real, estes viriam de hooks específicos
  const attachmentCount = useMemo(() => {
    // Aqui você faria uma query para contar anexos do lead
    return 3; // Mock
  }, [lead?.id]);

  const commentCount = useMemo(() => {
    // Aqui você faria uma query para contar comentários do lead
    return 2; // Mock
  }, [lead?.id]);

  const handleLeadUpdate = useCallback(() => {
    console.log('🔄 Lead data updated');
    // Aqui você pode invalidar queries ou refetch dados necessários
  }, []);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    attachmentCount,
    commentCount,
    handleLeadUpdate
  };
};
