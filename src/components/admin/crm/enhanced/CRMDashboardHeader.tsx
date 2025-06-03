
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
    <div className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-gray-900">
              CRM
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie seus leads e oportunidades de vendas
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex bg-gray-100 rounded-lg p-1">
              {tabsData.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onTabChange(tab.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${activeTab === tab.value 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }
                  `}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
