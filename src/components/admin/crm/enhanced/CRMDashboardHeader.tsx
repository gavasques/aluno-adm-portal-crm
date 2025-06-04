
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface CRMDashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedPipelineId?: string;
}

export const CRMDashboardHeader: React.FC<CRMDashboardHeaderProps> = ({
  activeTab,
  onTabChange,
  selectedPipelineId
}) => {
  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-1">Gerencie seus leads e pipeline de vendas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsList className="grid w-auto grid-cols-4 bg-gray-100 p-1">
            <TabsTrigger 
              value="dashboard" 
              className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              onClick={() => onTabChange('dashboard')}
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              onClick={() => onTabChange('reports')}
            >
              Relatórios
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              onClick={() => onTabChange('analytics')}
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              onClick={() => onTabChange('settings')}
            >
              Configurações
            </TabsTrigger>
          </TabsList>
        </motion.div>
      </div>
    </div>
  );
};
