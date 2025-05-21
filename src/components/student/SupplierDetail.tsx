import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Star, Heart, Calendar, FileText, MessageSquare, Building, Tag, Edit } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BrandsTab from "./supplier-tabs/BrandsTab";
import BranchesTab from "./supplier-tabs/BranchesTab";
import ContactsTab from "./supplier-tabs/ContactsTab";
import CommunicationsTab from "./supplier-tabs/CommunicationsTab";
import FilesTab from "./supplier-tabs/FilesTab";
import ImagesTab from "./supplier-tabs/ImagesTab";
import RatingsTab from "./supplier-tabs/RatingsTab";
import CommentsTab from "./supplier-tabs/CommentsTab";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

// Estados brasileiros para o dropdown
const ESTADOS_BRASILEIROS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  "Outro Local"
];

// Categorias para o dropdown
const CATEGORIAS = [
  "Produtos Regionais",
  "Tecnologia",
  "Vestuário",
  "Alimentos",
  "Bebidas",
  "Eletrônicos",
  "Sustentáveis", 
  "Decoração",
  "Produtos Diversos"
];

interface SupplierDetailProps {
  supplier: any;
  onBack: () => void;
  onUpdate: (updatedSupplier: any) => void;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, onBack, onUpdate }) => {
  const [editedSupplier, setEditedSupplier] = useState({ ...supplier });
  const [activeTab, setActiveTab] = useState("dados");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Garantir que todas as propriedades necessárias existam
  if (!editedSupplier.images) editedSupplier.images = [];
  if (!editedSupplier.communications) editedSupplier.communications = [];
  if (!editedSupplier.brands) editedSupplier.brands = [];
  if (!editedSupplier.branches) editedSupplier.branches = [];
  if (!editedSupplier.contacts) editedSupplier.contacts = [];
  if (!editedSupplier.files) editedSupplier.files = [];
  if (!editedSupplier.ratings) editedSupplier.ratings = [];
  if (!editedSupplier.comments) editedSupplier.comments = [];

  const handleSave = () => {
    // Validar campos obrigatórios
    if (!editedSupplier.name || !editedSupplier.category) {
      toast.error("Nome e categoria são campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    
    // Simular delay de processamento
    setTimeout(() => {
      onUpdate(editedSupplier);
      setIsEditing(false);
      setIsSubmitting(false);
      toast.success("Dados do fornecedor atualizados com sucesso!", {
        position: "top-center",
        style: {
          background: "linear-gradient(to right, #8B5CF6, #6366F1)",
          color: "white",
          fontSize: "16px",
        },
      });
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEditedSupplier({ ...editedSupplier, [id]: value });
  };

  // Formatar CNPJ com máscara
  const formatCNPJ = (value: string) => {
    const cnpjClean = value.replace(/\D/g, '');
    let formattedCNPJ = cnpjClean;
    
    if (cnpjClean.length > 2) formattedCNPJ = cnpjClean.substring(0, 2) + '.' + cnpjClean.substring(2);
    if (cnpjClean.length > 5) formattedCNPJ = formattedCNPJ.substring(0, 6) + '.' + cnpjClean.substring(5);
    if (cnpjClean.length > 8) formattedCNPJ = formattedCNPJ.substring(0, 10) + '/' + cnpjClean.substring(8);
    if (cnpjClean.length > 12) formattedCNPJ = formattedCNPJ.substring(0, 15) + '-' + cnpjClean.substring(12, 14);
    
    return formattedCNPJ;
  };

  // Formatar CEP com máscara
  const formatCEP = (value: string) => {
    const cepClean = value.replace(/\D/g, '');
    if (cepClean.length > 5) {
      return cepClean.substring(0, 5) + '-' + cepClean.substring(5, 8);
    }
    return cepClean;
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Add background gradient based on tab
  const getTabGradient = (tab: string) => {
    switch (tab) {
      case "dados":
        return "from-violet-50 to-indigo-50 border-violet-200";
      case "marcas":
        return "from-blue-50 to-sky-50 border-blue-200";
      case "filiais":
        return "from-emerald-50 to-teal-50 border-emerald-200";
      case "contatos":
        return "from-amber-50 to-yellow-50 border-amber-200";
      case "comunicacao":
        return "from-rose-50 to-pink-50 border-rose-200";
      case "arquivos":
        return "from-gray-50 to-slate-50 border-gray-200";
      case "avaliacoes":
        return "from-purple-50 to-fuchsia-50 border-purple-200";
      case "comentarios":
        return "from-cyan-50 to-blue-50 border-cyan-200";
      default:
        return "from-purple-50 to-blue-50 border-purple-100";
    }
  };

  // Get header gradient based on tab
  const getHeaderGradient = (tab: string) => {
    switch (tab) {
      case "dados":
        return "from-violet-500 to-indigo-500 border-violet-300";
      case "marcas":
        return "from-blue-500 to-sky-500 border-blue-300";
      case "filiais":
        return "from-emerald-500 to-teal-500 border-emerald-300";
      case "contatos":
        return "from-amber-500 to-yellow-500 border-amber-300";
      case "comunicacao":
        return "from-rose-500 to-pink-500 border-rose-300";
      case "arquivos":
        return "from-gray-600 to-slate-500 border-gray-400";
      case "avaliacoes":
        return "from-purple-500 to-fuchsia-500 border-purple-300";
      case "comentarios":
        return "from-cyan-500 to-blue-500 border-cyan-300";
      default:
        return "from-purple-500 to-blue-500 border-purple-300";
    }
  };

  // Get icon for tab
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "dados":
        return <FileText className="mr-2 h-4 w-4" />;
      case "marcas":
        return <Tag className="mr-2 h-4 w-4" />;
      case "filiais":
        return <Building className="mr-2 h-4 w-4" />;
      case "contatos":
        return <MessageSquare className="mr-2 h-4 w-4" />;
      case "comunicacao":
        return <Calendar className="mr-2 h-4 w-4" />;
      case "arquivos":
        return <FileText className="mr-2 h-4 w-4" />;
      case "avaliacoes":
        return <Star className="mr-2 h-4 w-4" />;
      case "comentarios":
        return <MessageSquare className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  const tabsData = [
    { id: "dados", label: "Dados" },
    { id: "marcas", label: "Marcas" },
    { id: "filiais", label: "Filiais" },
    { id: "contatos", label: "Contatos" },
    { id: "comunicacao", label: "Comunicação" },
    { id: "arquivos", label: "Arquivos" },
    { id: "avaliacoes", label: "Avaliações" },
    { id: "comentarios", label: "Comentários" }
  ];

  return (
    <motion.div
      className="container mx-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "radial-gradient(circle at 50% 0%, rgba(251, 254, 251, 0.12), rgba(255, 255, 255, 0))"
      }}
    >
      {/* Header with animation */}
      <motion.div 
        className="flex items-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mr-4 group hover:bg-purple-100 relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:text-purple-700 relative z-10" /> 
          <span className="group-hover:text-purple-700 relative z-10">Voltar</span>
        </Button>
        
        <div className="relative flex flex-col">
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {editedSupplier.name}
          </motion.h2>
          
          <motion.div className="flex items-center gap-2 text-sm text-gray-500">
            <Badge className="bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-800 border-none hover:from-amber-300 hover:to-yellow-300">
              {editedSupplier.category}
            </Badge>
            
            {editedSupplier.type && (
              <Badge className="bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-800 border-none">
                {editedSupplier.type}
              </Badge>
            )}
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
        
        {/* Botão Editar Fornecedor removido da área do aluno */}
      </motion.div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
        }}
        className="w-full"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 mb-8 bg-gradient-to-r from-purple-100 to-blue-100 p-1 rounded-lg">
            <LayoutGroup>
              {tabsData.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="relative data-[state=active]:text-purple-700 transition-all duration-300 flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {getTabIcon(tab.id)}
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div 
                      className="absolute inset-0 bg-white rounded-md shadow-md"
                      layoutId="tab-background"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </LayoutGroup>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <TabsContent value="dados">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('dados')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('dados')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                    Dados do Fornecedor
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[500px] pr-4">
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <motion.div variants={item}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
                        <Input
                          id="name"
                          value={editedSupplier.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
                        />
                      </motion.div>

                      <motion.div variants={item}>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria*</label>
                        <select
                          id="category"
                          value={editedSupplier.category}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 shadow-sm"
                        >
                          {CATEGORIAS.map(categoria => (
                            <option key={categoria} value={categoria}>
                              {categoria}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div variants={item} className="relative">
                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                        <Input
                          id="cnpj"
                          value={editedSupplier.cnpj}
                          onChange={(e) => {
                            // Formatar o CNPJ
                            const formattedValue = formatCNPJ(e.target.value);
                            setEditedSupplier({ ...editedSupplier, cnpj: formattedValue });
                          }}
                          disabled={!isEditing}
                          placeholder="00.000.000/0000-00"
                          className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
                        />
                        {isEditing && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-2 -right-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
                          >
                            Editando
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div variants={item}>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                          id="type"
                          value={editedSupplier.type}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 shadow-sm"
                        >
                          <option value="Distribuidor">Distribuidor</option>
                          <option value="Fabricante">Fabricante</option>
                          <option value="Importador">Importador</option>
                          <option value="Atacadista">Atacadista</option>
                          <option value="Varejista">Varejista</option>
                          <option value="Representante">Representante</option>
                        </select>
                      </motion.div>

                      <motion.div className="md:col-span-2" variants={item}>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                        <Input
                          id="address"
                          value={editedSupplier.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Rua, número, bairro - cidade/estado"
                          className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
                        />
                      </motion.div>

                      <motion.div variants={item}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <Input
                          id="email"
                          type="email"
                          value={editedSupplier.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="email@exemplo.com"
                          className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
                        />
                      </motion.div>

                      <motion.div variants={item}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <Input
                          id="phone"
                          value={editedSupplier.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="(00) 00000-0000"
                          className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
                        />
                      </motion.div>

                      <motion.div className="md:col-span-2" variants={item}>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <Input
                          id="website"
                          value={editedSupplier.website}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="www.example.com"
                          className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
                        />
                      </motion.div>

                      <motion.div className="md:col-span-2" variants={item}>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          id="status"
                          value={editedSupplier.isActive ? "true" : "false"}
                          onChange={(e) => {
                            setEditedSupplier({ 
                              ...editedSupplier, 
                              isActive: e.target.value === "true"
                            });
                          }}
                          disabled={!isEditing}
                          className="w-full rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 shadow-sm"
                        >
                          <option value="true">Ativo</option>
                          <option value="false">Inativo</option>
                        </select>
                      </motion.div>
                    </motion.div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marcas">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('marcas')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('marcas')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    Marcas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px]">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-wrap gap-2 mb-4"
                    >
                      {editedSupplier.brands && editedSupplier.brands.length > 0 ? (
                        editedSupplier.brands.map((brand, index) => (
                          <motion.div
                            key={brand.id || index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <HoverCard>
                              <HoverCardTrigger>
                                <Badge
                                  variant="secondary" 
                                  className="text-sm py-2 bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border border-blue-200 shadow-sm hover:shadow-md transition-all"
                                >
                                  {brand.name}
                                </Badge>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64 bg-white p-4 shadow-lg rounded-lg border border-blue-200">
                                <div className="flex flex-col gap-2">
                                  <h4 className="text-lg font-semibold text-blue-700">{brand.name}</h4>
                                  <div className="text-sm text-gray-600">
                                    <p>Marca do fornecedor {editedSupplier.name}</p>
                                    <p className="mt-2 text-blue-600 text-xs">Clique para mais detalhes</p>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          className="text-gray-500 flex flex-col items-center justify-center w-full py-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-sky-100 flex items-center justify-center mb-3 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                              <path d="M8 2c1.981 0 3.671 1.178 4.432 2.872"/>
                              <path d="M2 9.5c0 1.847.29 3 1 4"/>
                              <path d="M4.5 21h6.499a3 3 0 0 0 2.103-.86l8.388-8.387a3 3 0 0 0 0-4.242l-1.06-1.06a3 3 0 0 0-4.243 0L8.14 14.397A3 3 0 0 0 7.28 16.5L7 21"/>
                              <path d="M8 15h-.5a2 2 0 0 0-2 2v.5"/>
                            </svg>
                          </div>
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Nenhuma marca cadastrada.
                          </motion.p>
                        </motion.div>
                      )}
                    </motion.div>
                    
                    {isEditing && (
                      <BrandsTab 
                        brands={editedSupplier.brands}
                        onUpdate={(updatedBrands) => {
                          setEditedSupplier({ ...editedSupplier, brands: updatedBrands });
                        }}
                      />
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="filiais">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('filiais')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('filiais')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Filiais
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <BranchesTab 
                    branches={editedSupplier.branches}
                    onUpdate={(updatedBranches) => {
                      setEditedSupplier({ ...editedSupplier, branches: updatedBranches });
                    }}
                    isEditing={isEditing}
                    states={ESTADOS_BRASILEIROS}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contatos">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('contatos')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('contatos')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Contatos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ContactsTab 
                    contacts={editedSupplier.contacts}
                    onUpdate={(updatedContacts) => {
                      setEditedSupplier({ ...editedSupplier, contacts: updatedContacts });
                    }}
                    isEditing={isEditing}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comunicacao">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('comunicacao')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('comunicacao')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Comunicação
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CommunicationsTab 
                    communications={editedSupplier.communications}
                    onUpdate={(updatedCommunications) => {
                      setEditedSupplier({ ...editedSupplier, communications: updatedCommunications });
                    }}
                    isEditing={true} // Liberando a adição de comunicações
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="arquivos">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('arquivos')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('arquivos')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    Arquivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FilesTab 
                    files={editedSupplier.files || []}
                    onUpdate={(updatedFiles) => {
                      setEditedSupplier({ ...editedSupplier, files: updatedFiles });
                    }}
                    isEditing={true} // Liberando a adição de arquivos
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="avaliacoes">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('avaliacoes')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('avaliacoes')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <Star className="mr-3 h-5 w-5" />
                    Avaliações
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <RatingsTab 
                    ratings={editedSupplier.ratings || []}
                    onUpdate={(updatedRatings) => {
                      setEditedSupplier({...editedSupplier, ratings: updatedRatings});
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comentarios">
              <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('comentarios')}`}>
                <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('comentarios')} border-b-2`}>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Comentários
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CommentsTab 
                    comments={editedSupplier.comments || []}
                    onUpdate={(updatedComments) => {
                      setEditedSupplier({...editedSupplier, comments: updatedComments});
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default SupplierDetail;
