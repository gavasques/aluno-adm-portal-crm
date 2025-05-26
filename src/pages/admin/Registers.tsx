
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { 
  Gift, 
  FolderOpen, 
  Settings, 
  HandHeart, 
  GraduationCap,
  Search,
  Plus,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Bonus from "./Bonus";
import Categories from "./Categories";
import SoftwareTypes from "./SoftwareTypes";
import PartnerTypes from "./PartnerTypes";
import Courses from "./Courses";

const Registers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bonus");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extrair o parâmetro 'tab' da URL, se existir
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && tabParam !== "mentoring") {
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
      value: "bonus", 
      label: "Bônus", 
      shortLabel: "Bônus",
      icon: Gift, 
      count: 8,
      color: "from-amber-500 to-orange-600"
    },
    { 
      value: "categories", 
      label: "Categorias", 
      shortLabel: "Categ",
      icon: FolderOpen, 
      count: 15,
      color: "from-green-500 to-emerald-600"
    },
    { 
      value: "software-types", 
      label: "Ferramentas", 
      shortLabel: "Ferram",
      icon: Settings, 
      count: 24,
      color: "from-purple-500 to-violet-600"
    },
    { 
      value: "partner-types", 
      label: "Parceiros", 
      shortLabel: "Parcer",
      icon: HandHeart, 
      count: 18,
      color: "from-pink-500 to-rose-600"
    },
    { 
      value: "courses", 
      label: "Cursos", 
      shortLabel: "Cursos",
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              defaultValue="bonus" 
              className="w-full" 
              value={activeTab}
              onValueChange={handleTabChange}
            >
              {/* Mobile Dropdown for Tabs */}
              <div className="lg:hidden bg-gray-50 border-b p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        {activeTabData?.icon && <activeTabData.icon className="h-4 w-4" />}
                        {activeTabData?.label}
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {activeTabData?.count}
                        </Badge>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {tabsData.map((tab) => (
                      <DropdownMenuItem 
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className="flex items-center gap-2"
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {tab.count}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop Tabs - Compact Version */}
              <TabsList className="hidden lg:flex w-full justify-start p-0 bg-gray-50 rounded-none border-b h-auto">
                {tabsData.map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-2 py-2 flex flex-col items-center gap-1 text-xs min-w-0 flex-1"
                  >
                    <tab.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="hidden xl:block text-xs font-medium truncate">{tab.label}</span>
                      <span className="xl:hidden text-xs font-medium truncate">{tab.shortLabel}</span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto min-h-0">
                        {tab.count}
                      </Badge>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              
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
