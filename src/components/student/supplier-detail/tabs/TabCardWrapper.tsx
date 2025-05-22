
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTabGradient, getHeaderGradient, getTabIcon } from "../SupplierTabUtils";

interface TabCardWrapperProps {
  tabId: string;
  title: string;
  children: React.ReactNode;
}

const TabCardWrapper: React.FC<TabCardWrapperProps> = ({ tabId, title, children }) => {
  return (
    <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient(tabId)}`}>
      <CardHeader className={`bg-gradient-to-r ${getHeaderGradient(tabId)} border-b-2`}>
        <CardTitle className="text-white flex items-center">
          {getTabIcon(tabId)}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default TabCardWrapper;
