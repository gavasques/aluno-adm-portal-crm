
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CRMDashboard } from '@/components/admin/crm/enhanced/CRMDashboard';
import { UnifiedCRMProvider } from '@/providers/CRMProvider';

const CRM = () => {
  console.log('🎯 [CRM Page] Carregando página do CRM...');
  
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handleOpenLead = (leadId: string) => {
    console.log('🔗 [CRM Page] Abrindo lead:', leadId);
    setSelectedLeadId(leadId);
  };

  return (
    <UnifiedCRMProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-full w-full relative"
      >
        <CRMDashboard onOpenLead={handleOpenLead} />
      </motion.div>
    </UnifiedCRMProvider>
  );
};

export default CRM;
