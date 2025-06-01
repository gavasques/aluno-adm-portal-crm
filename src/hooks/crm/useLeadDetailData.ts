
import { useState, useEffect } from 'react';
import { CRMLead, CRMLeadContact } from '@/types/crm.types';

interface UseLeadDetailDataProps {
  lead: CRMLead | null;
}

export const useLeadDetailData = ({ lead }: UseLeadDetailDataProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  // Simular contagem de anexos e comentários (substituir por API real)
  useEffect(() => {
    if (lead) {
      // Aqui você faria chamadas para APIs reais
      setAttachmentCount(3);
      setCommentCount(2);
    }
  }, [lead]);

  const handleLeadUpdate = () => {
    console.log('🔄 Lead updated in detail dialog');
    // Callback para atualizar dados do lead
  };

  return {
    activeTab,
    setActiveTab,
    attachmentCount,
    commentCount,
    handleLeadUpdate
  };
};
