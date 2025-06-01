
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DesignCard } from '@/design-system';
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      {/* Modern Header with Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative overflow-hidden"
      >
        <DesignCard 
          variant="glass" 
          size="md" 
          className="mb-6 border-white/30 bg-white/60 dark:bg-black/20 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-300 bg-clip-text text-transparent font-display">
                CRM
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium">
                Gestão inteligente de leads e pipeline de vendas
              </p>
            </motion.div>
            
            {/* Decorative Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 90, 0] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </div>
        </DesignCard>
      </motion.div>

      {/* Main Content with Improved Layout */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-1 min-h-0"
      >
        <CRMDashboard onOpenLead={handleOpenLead} />
      </motion.div>
    </motion.div>
  );
};

export default CRM;
