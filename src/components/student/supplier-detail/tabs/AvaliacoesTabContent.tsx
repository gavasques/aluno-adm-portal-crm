
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import RatingsTab from "../../supplier-tabs/RatingsTab";

interface AvaliacoesTabContentProps {
  ratings: any[];
  updateSupplierProperty: (property: string, value: any) => void;
}

const AvaliacoesTabContent: React.FC<AvaliacoesTabContentProps> = ({ 
  ratings,
  updateSupplierProperty
}) => {
  return (
    <TabsContent value="avaliacoes">
      <TabCardWrapper tabId="avaliacoes" title="Avaliações">
        <RatingsTab 
          ratings={ratings || []}
          onUpdate={(updatedRatings) => {
            updateSupplierProperty('ratings', updatedRatings);
          }}
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default AvaliacoesTabContent;
