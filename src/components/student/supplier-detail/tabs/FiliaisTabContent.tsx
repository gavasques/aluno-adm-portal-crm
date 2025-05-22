
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import BranchesTab from "../../supplier-tabs/BranchesTab";
import { ESTADOS_BRASILEIROS } from "../SupplierTabUtils";

interface FiliaisTabContentProps {
  branches: any[];
  isEditing: boolean;
  updateSupplierProperty: (property: string, value: any) => void;
}

const FiliaisTabContent: React.FC<FiliaisTabContentProps> = ({ 
  branches,
  isEditing,
  updateSupplierProperty
}) => {
  return (
    <TabsContent value="filiais">
      <TabCardWrapper tabId="filiais" title="Filiais">
        <BranchesTab 
          branches={branches}
          onUpdate={(updatedBranches) => {
            updateSupplierProperty('branches', updatedBranches);
          }}
          isEditing={isEditing}
          states={ESTADOS_BRASILEIROS}
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default FiliaisTabContent;
