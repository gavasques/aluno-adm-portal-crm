
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Tool } from "../ToolsTable";

interface ImagesTabProps {
  tool: Tool;
  onUpdateTool: (updatedTool: Tool) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = ({ tool, onUpdateTool }) => {
  
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem não pode ter mais de 2MB");
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de imagem não permitido. Por favor, envie uma imagem JPG, PNG, GIF ou WEBP.");
      return;
    }
    
    // In a real app, this would upload to a server and get a URL
    const imageUrl = URL.createObjectURL(file);
    
    const newImage = {
      id: Date.now(),
      url: imageUrl,
      alt: file.name
    };
    
    const updatedTool = {
      ...tool,
      images: [...tool.images, newImage]
    };
    
    onUpdateTool(updatedTool);
    toast.success(`Imagem "${file.name}" enviada com sucesso!`);
  };
  
  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Imagens</h3>
          <div>
            <input
              type="file"
              id="image-upload"
              className="hidden"
              onChange={handleUploadImage}
              accept="image/jpeg,image/png,image/gif,image/webp"
            />
            <label htmlFor="image-upload">
              <Button variant="default" size="sm" className="cursor-pointer">
                <ImagePlus className="h-4 w-4 mr-1" /> Upload de Imagem
              </Button>
            </label>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          Tipos permitidos: JPG, PNG, GIF, WEBP (máx: 2MB)
        </div>
        
        {tool.images && tool.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.images.map((image) => (
              <div key={image.id} className="border rounded-md overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-2">
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Nenhuma imagem disponível.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImagesTab;
