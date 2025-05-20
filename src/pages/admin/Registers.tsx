
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Mentoring from "./Mentoring";
import Bonus from "./Bonus";
import Categories from "./Categories";
import SoftwareTypes from "./SoftwareTypes";
import PartnerTypes from "./PartnerTypes";

const Registers = () => {
  const [activeTab, setActiveTab] = useState("mentoring");
  
  return (
    <div className="px-6 py-6 w-full">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastros</h1>
      
      <Tabs 
        defaultValue="mentoring" 
        className="w-full" 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="mentoring">Mentorias</TabsTrigger>
          <TabsTrigger value="bonus">Bônus</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="software-types">Tipos de Software</TabsTrigger>
          <TabsTrigger value="partner-types">Tipos de Parceiros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mentoring" className="mt-0">
          <Mentoring />
        </TabsContent>
        
        <TabsContent value="bonus" className="mt-0">
          <Bonus />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-0">
          <Categories />
        </TabsContent>
        
        <TabsContent value="software-types" className="mt-0">
          <SoftwareTypes />
        </TabsContent>
        
        <TabsContent value="partner-types" className="mt-0">
          <PartnerTypes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Registers;
