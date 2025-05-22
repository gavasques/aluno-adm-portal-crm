
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import MarcasTab from "./MarcasTab";

interface MarcasTabContentProps {
  brands: any[];
  isEditing: boolean;
  updateSupplierProperty: (property: string, value: any) => void;
}

const MarcasTabContent: React.FC<MarcasTabContentProps> = ({ 
  brands,
  isEditing,
  updateSupplierProperty
}) => {
  return (
    <TabsContent value="marcas">
      <TabCardWrapper tabId="marcas" title="Marcas">
        <MarcasTab 
          brands={brands} 
          isEditing={isEditing}
          onUpdate={(updatedBrands) => {
            updateSupplierProperty('brands', updatedBrands);
          }} 
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default MarcasTabContent;
