
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import TabCardWrapper from "./TabCardWrapper";
import CommentsTab from "../../supplier-tabs/CommentsTab";

interface ComentariosTabContentProps {
  comments: any[];
  updateSupplierProperty: (property: string, value: any) => void;
}

const ComentariosTabContent: React.FC<ComentariosTabContentProps> = ({ 
  comments,
  updateSupplierProperty
}) => {
  return (
    <TabsContent value="comentarios">
      <TabCardWrapper tabId="comentarios" title="Comentários">
        <CommentsTab 
          comments={comments || []}
          onUpdate={(updatedComments) => {
            updateSupplierProperty('comments', updatedComments);
          }}
        />
      </TabCardWrapper>
    </TabsContent>
  );
};

export default ComentariosTabContent;
