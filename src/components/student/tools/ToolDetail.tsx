
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  TabsTriggerWithBadge
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tool } from "@/components/tools/ToolsTable";
import { 
  ArrowLeft, 
  Info, 
  MessageSquare, 
  Star, 
  FileText, 
  FileImage, 
  UserCircle
} from "lucide-react";
import DetailsTab from "@/components/tools/tabs/DetailsTab";
import RatingsTab from "@/components/tools/tabs/RatingsTab";
import CommentsTab from "@/components/tools/tabs/CommentsTab";
import ContactsTab from "@/components/tools/tabs/ContactsTab";
import FilesTab from "@/components/tools/tabs/FilesTab";
import ImagesTab from "@/components/tools/tabs/ImagesTab";

interface ToolDetailProps {
  tool: Tool;
  onClose: () => void;
  onUpdateTool: (tool: Tool) => void;
  isAdmin: boolean;
}

const ToolDetail: React.FC<ToolDetailProps> = ({
  tool,
  onClose,
  onUpdateTool,
  isAdmin
}) => {
  const [activeTab, setActiveTab] = useState("details");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getTabGradient = (tab: string) => {
    const gradients = {
      details: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      ratings: "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
      comments: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      contacts: "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      files: "bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
      images: "bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
    };
    
    return gradients[tab] || gradients.details;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } }
  };

  const logoColor = tool.name.charCodeAt(0) % 6;
  const logoColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-emerald-500 to-emerald-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-amber-500 to-amber-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
  ];

  return (
    <motion.div
      className="w-full bg-white z-10 overflow-y-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="sticky top-0 z-20 bg-gradient-to-r from-teal-600 to-emerald-500 text-white p-4 shadow-md"
        variants={headerVariants}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft />
            </Button>
            <div className="flex items-center gap-4">
              <div className={`${logoColors[logoColor]} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {tool.logo || tool.name.substring(0, 2)}
              </div>
              <div>
                <h1 className="text-xl font-bold">{tool.name}</h1>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <span>{tool.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/70"></span>
                  <span>{tool.provider}</span>
                </div>
              </div>
            </div>
          </div>
          {isAdmin && (
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Editar Ferramenta
            </Button>
          )}
        </div>
      </motion.div>

      <div className="py-6 px-4">
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Tabs 
            defaultValue="details" 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b px-4 py-2">
              <TabsList className="bg-white/70 backdrop-blur-sm grid grid-cols-3 md:grid-cols-6 gap-2">
                <TabsTrigger 
                  value="details"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 transition-all duration-200"
                >
                  <Info className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Detalhes</span>
                </TabsTrigger>
                <TabsTriggerWithBadge 
                  value="ratings"
                  badgeContent={tool.ratings_list?.length || 0}
                  className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 transition-all duration-200"
                >
                  <Star className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Avaliações</span>
                </TabsTriggerWithBadge>
                <TabsTriggerWithBadge 
                  value="comments"
                  badgeContent={tool.comments_list?.length || 0}
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 transition-all duration-200"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Comentários</span>
                </TabsTriggerWithBadge>
                <TabsTriggerWithBadge 
                  value="contacts"
                  badgeContent={tool.contacts?.length || 0}
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 transition-all duration-200"
                >
                  <UserCircle className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Contatos</span>
                </TabsTriggerWithBadge>
                <TabsTriggerWithBadge 
                  value="files"
                  badgeContent={tool.files?.length || 0}
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 transition-all duration-200"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Arquivos</span>
                </TabsTriggerWithBadge>
                <TabsTriggerWithBadge 
                  value="images"
                  badgeContent={tool.images?.length || 0}
                  className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 transition-all duration-200"
                >
                  <FileImage className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Imagens</span>
                </TabsTriggerWithBadge>
              </TabsList>
            </div>

            <div className={`p-6 ${getTabGradient(activeTab)} min-h-[400px]`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabContentVariants}
                  className="h-full"
                >
                  <TabsContent value="details" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <DetailsTab tool={tool} />
                  </TabsContent>
                  
                  <TabsContent value="ratings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <RatingsTab 
                      tool={tool} 
                      onUpdateTool={onUpdateTool}
                    />
                  </TabsContent>
                  
                  <TabsContent value="comments" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <CommentsTab 
                      tool={tool} 
                      onUpdateTool={onUpdateTool}
                    />
                  </TabsContent>
                  
                  <TabsContent value="contacts" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ContactsTab 
                      tool={tool} 
                      onUpdateTool={onUpdateTool} 
                      isAdmin={isAdmin}
                    />
                  </TabsContent>
                  
                  <TabsContent value="files" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <FilesTab 
                      tool={tool} 
                      onUpdateTool={onUpdateTool}
                    />
                  </TabsContent>
                  
                  <TabsContent value="images" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ImagesTab 
                      tool={tool} 
                      onUpdateTool={onUpdateTool}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ToolDetail;
