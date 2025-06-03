
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CRMDashboardHeaderProps {
  activeTab: 'dashboard' | 'reports' | 'analytics' | 'settings';
  onTabChange: (tab: string) => void;
}

export const CRMDashboardHeader: React.FC<CRMDashboardHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
            <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
          </div>
          
          <TabsList className="grid w-[800px] grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
        </div>
      </div>
    </div>
  );
};
