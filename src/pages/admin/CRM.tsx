
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CRMDashboard from '@/components/admin/crm/enhanced/CRMDashboard';

const CRM = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handleOpenLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full w-full"
    >
      <CRMDashboard onOpenLead={handleOpenLead} />
    </motion.div>
  );
};

export default CRM;
