
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BrandsTab from "./supplier-tabs/BrandsTab";
import BranchesTab from "./supplier-tabs/BranchesTab";
import ContactsTab from "./supplier-tabs/ContactsTab";
import CommunicationsTab from "./supplier-tabs/CommunicationsTab";
import FilesTab from "./supplier-tabs/FilesTab";
import ImagesTab from "./supplier-tabs/ImagesTab";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

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

  // Garantir que todas as propriedades necessárias existam
  if (!editedSupplier.images) editedSupplier.images = [];

  const handleSave = () => {
    // Validar campos obrigatórios
    if (!editedSupplier.name || !editedSupplier.category) {
      toast.error("Nome e categoria são campos obrigatórios.");
      return;
    }

    onUpdate(editedSupplier);
    setIsEditing(false);
    toast.success("Dados do fornecedor atualizados com sucesso!");
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

  return (
    <motion.div
      className="container mx-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="flex items-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mr-4 group hover:bg-purple-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:text-purple-700" /> 
          <span className="group-hover:text-purple-700">Voltar</span>
        </Button>
        
        <div 
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text"
          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {editedSupplier.name}
        </div>
        
        {!isEditing && (
          <Button 
            className="ml-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white" 
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Editar Fornecedor
          </Button>
        )}
        {isEditing && (
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setEditedSupplier({ ...supplier });
                setIsEditing(false);
              }}
              className="border-gray-200 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </div>
        )}
      </motion.div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 mb-8 bg-gradient-to-r from-purple-100 to-blue-100 p-1 rounded-lg">
            <TabsTrigger 
              value="dados" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Dados
            </TabsTrigger>
            <TabsTrigger 
              value="marcas" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Marcas
            </TabsTrigger>
            <TabsTrigger 
              value="filiais" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Filiais
            </TabsTrigger>
            <TabsTrigger 
              value="contatos" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Contatos
            </TabsTrigger>
            <TabsTrigger 
              value="comunicacao" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Comunicação
            </TabsTrigger>
            <TabsTrigger 
              value="arquivos" 
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Arquivos
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <TabsContent value="dados">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Dados do Fornecedor</CardTitle>
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
                        className="border-purple-200 focus-visible:ring-purple-500"
                      />
                    </motion.div>

                    <motion.div variants={item}>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria*</label>
                      <select
                        id="category"
                        value={editedSupplier.category}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                      >
                        {CATEGORIAS.map(categoria => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div variants={item}>
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
                        className="border-purple-200 focus-visible:ring-purple-500"
                      />
                    </motion.div>

                    <motion.div variants={item}>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        id="type"
                        value={editedSupplier.type}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
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
                        className="border-purple-200 focus-visible:ring-purple-500"
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
                        className="border-purple-200 focus-visible:ring-purple-500"
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
                        className="border-purple-200 focus-visible:ring-purple-500"
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
                        className="border-purple-200 focus-visible:ring-purple-500"
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
                        className="w-full rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
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
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Marcas</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[400px]">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editedSupplier.brands && editedSupplier.brands.length > 0 ? (
                      editedSupplier.brands.map((brand) => (
                        <Badge key={brand.id} variant="secondary" className="text-sm py-2 bg-blue-50 text-blue-700 border border-blue-200">
                          {brand.name}
                        </Badge>
                      ))
                    ) : (
                      <div className="text-gray-500 flex flex-col items-center justify-center w-full py-8">
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                            <path d="M8 2c1.981 0 3.671 1.178 4.432 2.872"/>
                            <path d="M2 9.5c0 1.847.29 3 1 4"/>
                            <path d="M4.5 21h6.499a3 3 0 0 0 2.103-.86l8.388-8.387a3 3 0 0 0 0-4.242l-1.06-1.06a3 3 0 0 0-4.243 0L8.14 14.397A3 3 0 0 0 7.28 16.5L7 21"/>
                            <path d="M8 15h-.5a2 2 0 0 0-2 2v.5"/>
                          </svg>
                        </div>
                        <p>Nenhuma marca cadastrada.</p>
                      </div>
                    )}
                  </div>
                  
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
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Filiais</CardTitle>
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
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Contatos</CardTitle>
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
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Comunicação</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CommunicationsTab 
                  communications={editedSupplier.communications}
                  onUpdate={(updatedCommunications) => {
                    setEditedSupplier({ ...editedSupplier, communications: updatedCommunications });
                  }}
                  isEditing={isEditing}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="arquivos">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Arquivos</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <FilesTab 
                  files={editedSupplier.files || []}
                  onUpdate={(updatedFiles) => {
                    setEditedSupplier({ ...editedSupplier, files: updatedFiles });
                  }}
                  isEditing={isEditing}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
};

export default SupplierDetail;
