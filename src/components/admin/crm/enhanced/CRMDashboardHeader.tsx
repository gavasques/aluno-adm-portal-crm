
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Settings, PieChart, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface CRMDashboardHeaderProps {
  activeTab: 'dashboard' | 'reports' | 'analytics' | 'settings';
  onTabChange: (tab: string) => void;
}

export const CRMDashboardHeader: React.FC<CRMDashboardHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabsData = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'reports', label: 'Relatórios', icon: BarChart3 },
    { value: 'analytics', label: 'Analytics', icon: PieChart },
    { value: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-gray-200/50 flex-shrink-0">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              CRM
            </h1>
            <p className="text-gray-600 mt-1 font-medium">
              Gerencie seus leads e oportunidades de vendas
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <TabsList className="grid w-[600px] grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              {tabsData.map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  onClick={() => onTabChange(tab.value)}
                  className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
