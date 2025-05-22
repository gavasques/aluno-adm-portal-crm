
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import DadosTab from "./DadosTab";

interface DadosTabContentProps {
  supplier: any;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const DadosTabContent: React.FC<DadosTabContentProps> = ({ 
  supplier,
  isEditing,
  handleInputChange
}) => {
  return (
    <TabsContent value="dados">
      <TabCardWrapper tabId="dados" title="Dados do Fornecedor">
        <DadosTab 
          supplier={supplier} 
          isEditing={isEditing} 
          handleInputChange={handleInputChange} 
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default DadosTabContent;
