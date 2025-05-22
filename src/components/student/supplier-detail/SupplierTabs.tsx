
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { getTabGradient, getHeaderGradient, getTabIcon, tabsData } from "./SupplierTabUtils";
import DadosTab from "./tabs/DadosTab";
import MarcasTab from "./tabs/MarcasTab";

// Import existing tabs
import BranchesTab from "../supplier-tabs/BranchesTab";
import ContactsTab from "../supplier-tabs/ContactsTab";
import CommunicationsTab from "../supplier-tabs/CommunicationsTab";
import FilesTab from "../supplier-tabs/FilesTab";
import RatingsTab from "../supplier-tabs/RatingsTab";
import CommentsTab from "../supplier-tabs/CommentsTab";
import ImagesTab from "../supplier-tabs/ImagesTab";
import { ESTADOS_BRASILEIROS } from "./SupplierTabUtils";

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
                <DadosTab 
                  supplier={supplier} 
                  isEditing={isEditing} 
                  handleInputChange={handleInputChange} 
                />
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
                <MarcasTab 
                  brands={supplier.brands} 
                  isEditing={isEditing}
                  onUpdate={(updatedBrands) => {
                    updateSupplierProperty('brands', updatedBrands);
                  }} 
                />
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
                  branches={supplier.branches}
                  onUpdate={(updatedBranches) => {
                    updateSupplierProperty('branches', updatedBranches);
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
                  contacts={supplier.contacts}
                  onUpdate={(updatedContacts) => {
                    updateSupplierProperty('contacts', updatedContacts);
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
                  communications={supplier.communications}
                  onUpdate={(updatedCommunications) => {
                    updateSupplierProperty('communications', updatedCommunications);
                  }}
                  isEditing={true}
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
                  files={supplier.files || []}
                  onUpdate={(updatedFiles) => {
                    updateSupplierProperty('files', updatedFiles);
                  }}
                  isEditing={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="avaliacoes">
            <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('avaliacoes')}`}>
              <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('avaliacoes')} border-b-2`}>
                <CardTitle className="text-white flex items-center">
                  {getTabIcon("avaliacoes")}
                  Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RatingsTab 
                  ratings={supplier.ratings || []}
                  onUpdate={(updatedRatings) => {
                    updateSupplierProperty('ratings', updatedRatings);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comentarios">
            <Card className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r ${getTabGradient('comentarios')}`}>
              <CardHeader className={`bg-gradient-to-r ${getHeaderGradient('comentarios')} border-b-2`}>
                <CardTitle className="text-white flex items-center">
                  {getTabIcon("comentarios")}
                  Comentários
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CommentsTab 
                  comments={supplier.comments || []}
                  onUpdate={(updatedComments) => {
                    updateSupplierProperty('comments', updatedComments);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
};

export default SupplierTabs;
