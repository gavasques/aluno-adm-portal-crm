
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, LayoutGroup } from "framer-motion";
import { getTabIcon, tabsData } from "../SupplierTabUtils";

interface TabsHeaderListProps {
  activeTab: string;
}

const TabsHeaderList: React.FC<TabsHeaderListProps> = ({ activeTab }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 mb-8 bg-gradient-to-r from-purple-100 to-blue-100 p-1 rounded-lg">
        <LayoutGroup>
          {tabsData.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className="relative data-[state=active]:text-purple-700 transition-all duration-300 flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center justify-center">
                {getTabIcon(tab.id)}
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div 
                  className="absolute inset-0 bg-white rounded-md shadow-md"
                  layoutId="tab-background"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </TabsTrigger>
          ))}
        </LayoutGroup>
      </TabsList>
    </motion.div>
  );
};

export default TabsHeaderList;
