
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
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600">Gestão de leads e pipeline de vendas</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CRMDashboard onOpenLead={handleOpenLead} />
      </div>
    </motion.div>
  );
};

export default CRM;
