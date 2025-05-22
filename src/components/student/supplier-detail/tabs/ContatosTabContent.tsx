
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import ContactsTab from "../../supplier-tabs/ContactsTab";

interface ContatosTabContentProps {
  contacts: any[];
  isEditing: boolean;
  updateSupplierProperty: (property: string, value: any) => void;
}

const ContatosTabContent: React.FC<ContatosTabContentProps> = ({ 
  contacts,
  isEditing,
  updateSupplierProperty
}) => {
  return (
    <TabsContent value="contatos">
      <TabCardWrapper tabId="contatos" title="Contatos">
        <ContactsTab 
          contacts={contacts}
          onUpdate={(updatedContacts) => {
            updateSupplierProperty('contacts', updatedContacts);
          }}
          isEditing={isEditing}
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default ContatosTabContent;
