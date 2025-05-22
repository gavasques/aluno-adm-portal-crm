
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import TabsHeaderList from "./tabs/TabsHeaderList";
import TabContentWrapper from "./tabs/TabContentWrapper";
import DadosTabContent from "./tabs/DadosTabContent";
import MarcasTabContent from "./tabs/MarcasTabContent";
import FiliaisTabContent from "./tabs/FiliaisTabContent";
import ContatosTabContent from "./tabs/ContatosTabContent";
import ComunicacaoTabContent from "./tabs/ComunicacaoTabContent";
import ArquivosTabContent from "./tabs/ArquivosTabContent";
import AvaliacoesTabContent from "./tabs/AvaliacoesTabContent";
import ComentariosTabContent from "./tabs/ComentariosTabContent";

interface SupplierTabsProps {
  supplier: any;
  activeTab: string;
  setActiveTab: (value: string) => void;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  updateSupplierProperty: (property: string, value: any) => void;
}

const SupplierTabs: React.FC<SupplierTabsProps> = ({ 
  supplier, 
  activeTab, 
  setActiveTab, 
  isEditing,
  handleInputChange,
  updateSupplierProperty
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => setActiveTab(value)}
      className="w-full"
    >
      <TabsHeaderList activeTab={activeTab} />

      <TabContentWrapper activeTab={activeTab}>
        <DadosTabContent 
          supplier={supplier} 
          isEditing={isEditing} 
          handleInputChange={handleInputChange} 
        />

        <MarcasTabContent 
          brands={supplier.brands} 
          isEditing={isEditing} 
          updateSupplierProperty={updateSupplierProperty} 
        />

        <FiliaisTabContent 
          branches={supplier.branches} 
          isEditing={isEditing} 
          updateSupplierProperty={updateSupplierProperty}
        />

        <ContatosTabContent 
          contacts={supplier.contacts} 
          isEditing={isEditing} 
          updateSupplierProperty={updateSupplierProperty}
        />

        <ComunicacaoTabContent 
          communications={supplier.communications}
          updateSupplierProperty={updateSupplierProperty}
        />

        <ArquivosTabContent 
          files={supplier.files}
          updateSupplierProperty={updateSupplierProperty}
        />

        <AvaliacoesTabContent 
          ratings={supplier.ratings}
          updateSupplierProperty={updateSupplierProperty}
        />

        <ComentariosTabContent 
          comments={supplier.comments}
          updateSupplierProperty={updateSupplierProperty}
        />
      </TabContentWrapper>
    </Tabs>
  );
};

export default SupplierTabs;
