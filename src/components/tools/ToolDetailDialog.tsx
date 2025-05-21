
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tool } from "./ToolsTable";
import DetailsTab from "./tabs/DetailsTab";
import ContactsTab from "./tabs/ContactsTab";
import CommentsTab from "./tabs/CommentsTab";
import RatingsTab from "./tabs/RatingsTab";
import FilesTab from "./tabs/FilesTab";
import ImagesTab from "./tabs/ImagesTab";

interface ToolDetailDialogProps {
  tool: Tool | null;
  isAdmin: boolean;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTool: (updatedTool: Tool) => void;
}

const ToolDetailDialog: React.FC<ToolDetailDialogProps> = ({
  tool,
  isAdmin,
  isOpen,
  onClose,
  onUpdateTool
}) => {
  if (!tool) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-portal-accent text-white flex items-center justify-center text-lg font-bold mr-2">
              {tool.logo}
            </div>
            {tool.name}
            <div className="flex gap-2 ml-4">
              {tool.recommended && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Recomendada
                </Badge>
              )}
              {tool.notRecommended && (
                <Badge variant="destructive">
                  Não Recomendado (Corre)
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Dados da Ferramenta</TabsTrigger>
              <TabsTrigger value="contacts">Contatos</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              <TabsTrigger value="files">Arquivos</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="max-h-[60vh] overflow-y-auto">
              <DetailsTab 
                tool={tool} 
                isAdmin={isAdmin}
              />
            </TabsContent>
            
            <TabsContent value="contacts" className="max-h-[60vh] overflow-y-auto">
              <ContactsTab 
                tool={tool}
                onUpdateTool={onUpdateTool}
                isAdmin={isAdmin}
              />
            </TabsContent>
            
            <TabsContent value="comments" className="max-h-[60vh] overflow-y-auto">
              <CommentsTab 
                tool={tool}
                onUpdateTool={onUpdateTool}
              />
            </TabsContent>
            
            <TabsContent value="reviews" className="max-h-[60vh] overflow-y-auto">
              <RatingsTab 
                tool={tool}
                onUpdateTool={onUpdateTool}
              />
            </TabsContent>
            
            <TabsContent value="files" className="max-h-[60vh] overflow-y-auto">
              <FilesTab 
                tool={tool}
                onUpdateTool={onUpdateTool}
              />
            </TabsContent>
            
            <TabsContent value="images" className="max-h-[60vh] overflow-y-auto">
              <ImagesTab 
                tool={tool}
                onUpdateTool={onUpdateTool}
              />
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDetailDialog;
