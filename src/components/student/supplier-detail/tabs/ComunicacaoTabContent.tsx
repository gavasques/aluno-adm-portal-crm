
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import CommunicationsTab from "../../supplier-tabs/CommunicationsTab";

interface ComunicacaoTabContentProps {
  communications: any[];
  updateSupplierProperty: (property: string, value: any) => void;
}

const ComunicacaoTabContent: React.FC<ComunicacaoTabContentProps> = ({ 
  communications,
  updateSupplierProperty
}) => {
  return (
    <TabsContent value="comunicacao">
      <TabCardWrapper tabId="comunicacao" title="Comunicação">
        <CommunicationsTab 
          communications={communications}
          onUpdate={(updatedCommunications) => {
            updateSupplierProperty('communications', updatedCommunications);
          }}
          isEditing={true}
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default ComunicacaoTabContent;
