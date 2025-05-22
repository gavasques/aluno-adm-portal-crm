
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import FilesTab from "../../supplier-tabs/FilesTab";
import { CustomFile } from "../../supplier-tabs/files/utils";

interface ArquivosTabContentProps {
  files: CustomFile[];
  updateSupplierProperty: (property: string, value: any) => void;
}

const ArquivosTabContent: React.FC<ArquivosTabContentProps> = ({ 
  files,
  updateSupplierProperty
}) => {
  return (
    <TabsContent value="arquivos">
      <TabCardWrapper tabId="arquivos" title="Arquivos">
        <FilesTab 
          files={files || []}
          onUpdate={(updatedFiles) => {
            updateSupplierProperty('files', updatedFiles);
          }}
          isEditing={true}
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default ArquivosTabContent;
