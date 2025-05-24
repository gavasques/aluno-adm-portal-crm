
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import Mentoring from "./Mentoring";
import Bonus from "./Bonus";
import Categories from "./Categories";
import SoftwareTypes from "./SoftwareTypes";
import PartnerTypes from "./PartnerTypes";
import Courses from "./Courses";

const Registers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mentoring");
  
  // Extrair o parâmetro 'tab' da URL, se existir
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  
  // Atualizar a URL quando a aba mudar
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/cadastros?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastros</h1>
      
      <Tabs 
        defaultValue="mentoring" 
        className="w-full" 
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="mentoring">Mentorias</TabsTrigger>
          <TabsTrigger value="bonus">Bônus</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="software-types">Ferramentas</TabsTrigger>
          <TabsTrigger value="partner-types">Parceiros</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
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

        <TabsContent value="courses" className="mt-0">
          <Courses />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Registers;
