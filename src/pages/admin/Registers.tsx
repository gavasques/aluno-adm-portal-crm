
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { 
  Users, 
  Gift, 
  FolderOpen, 
  Settings, 
  HandHeart, 
  GraduationCap,
  Search,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Cadastros' }
  ];

  const tabsData = [
    { 
      value: "mentoring", 
      label: "Mentorias", 
      icon: Users, 
      count: 12,
      color: "from-blue-500 to-indigo-600"
    },
    { 
      value: "bonus", 
      label: "Bônus", 
      icon: Gift, 
      count: 8,
      color: "from-amber-500 to-orange-600"
    },
    { 
      value: "categories", 
      label: "Categorias", 
      icon: FolderOpen, 
      count: 15,
      color: "from-green-500 to-emerald-600"
    },
    { 
      value: "software-types", 
      label: "Ferramentas", 
      icon: Settings, 
      count: 24,
      color: "from-purple-500 to-violet-600"
    },
    { 
      value: "partner-types", 
      label: "Parceiros", 
      icon: HandHeart, 
      count: 18,
      color: "from-pink-500 to-rose-600"
    },
    { 
      value: "courses", 
      label: "Cursos", 
      icon: GraduationCap, 
      count: 6,
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const activeTabData = tabsData.find(tab => tab.value === activeTab);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin"
        />

        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${activeTabData?.color || 'from-blue-500 to-indigo-600'} text-white`}>
                      {activeTabData?.icon && <activeTabData.icon className="h-6 w-6" />}
                    </div>
                    Cadastros - {activeTabData?.label}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      {activeTabData?.count || 0} Registros
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Sistema Ativo
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar registros..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Registro
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tabsData.map((tab, index) => (
              <motion.div
                key={tab.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className={`cursor-pointer ${activeTab === tab.value ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleTabChange(tab.value)}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-r ${tab.color} flex items-center justify-center text-white`}>
                        <tab.icon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{tab.count}</div>
                      <div className="text-xs text-gray-600">{tab.label}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <Tabs 
              defaultValue="mentoring" 
              className="w-full" 
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <TabsList className="w-full justify-start p-0 bg-gray-50 rounded-none border-b h-auto">
                {tabsData.map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-6 py-3 flex items-center gap-2"
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {tab.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="mentoring" className="mt-0 p-6">
                <Mentoring />
              </TabsContent>
              
              <TabsContent value="bonus" className="mt-0 p-6">
                <Bonus />
              </TabsContent>
              
              <TabsContent value="categories" className="mt-0 p-6">
                <Categories />
              </TabsContent>
              
              <TabsContent value="software-types" className="mt-0 p-6">
                <SoftwareTypes />
              </TabsContent>
              
              <TabsContent value="partner-types" className="mt-0 p-6">
                <PartnerTypes />
              </TabsContent>

              <TabsContent value="courses" className="mt-0 p-6">
                <Courses />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Registers;
