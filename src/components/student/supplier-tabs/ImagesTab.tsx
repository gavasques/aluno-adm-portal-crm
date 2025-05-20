
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash, Expand, X } from "lucide-react";
import { toast } from "sonner";

interface ImageItem {
  id: number;
  name: string;
  src: string;
  date: string;
  type: string;
  size: string;
}

interface ImagesTabProps {
  images: ImageItem[];
  onUpdate: (images: ImageItem[]) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = ({ images, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewImage, setViewImage] = useState<ImageItem | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setIsLoading(true);
    
    // Processar cada arquivo
    Array.from(selectedFiles).forEach(file => {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem válida.`);
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} é muito grande. Tamanho máximo é 5MB.`);
        return;
      }
      
      // Calcular tamanho em KB ou MB
      let fileSize;
      if (file.size < 1024 * 1024) {
        fileSize = (file.size / 1024).toFixed(1) + "KB";
      } else {
        fileSize = (file.size / (1024 * 1024)).toFixed(1) + "MB";
      }
      
      // Criar URL da imagem para preview
      const imageUrl = URL.createObjectURL(file);
      
      // Criar um novo registro de imagem
      const newImage: ImageItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: file.name,
        src: imageUrl,
        date: new Date().toISOString().split('T')[0],
        type: file.type.split('/')[1].toUpperCase(),
        size: fileSize
      };
      
      // Adicionar à lista de imagens
      onUpdate([...images, newImage]);
    });
    
    // Resetar o input de arquivo
    e.target.value = '';
    setIsLoading(false);
    toast.success("Imagem(ns) adicionada(s) com sucesso!");
  };

  const handleDeleteImage = (id: number) => {
    // Encontrar a imagem para revogar a URL
    const imageToDelete = images.find(image => image.id === id);
    if (imageToDelete && imageToDelete.src.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete.src);
    }
    
    // Remover da lista
    onUpdate(images.filter(image => image.id !== id));
    toast.success("Imagem excluída com sucesso!");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Imagens</CardTitle>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple
            />
            <Button onClick={handleUploadClick} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" /> 
              {isLoading ? "Carregando..." : "Adicionar Imagem"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma imagem adicionada. Clique no botão acima para adicionar.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className="relative group border rounded-md overflow-hidden aspect-square"
                >
                  <img 
                    src={image.src} 
                    alt={image.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-full h-8 w-8 p-0"
                        onClick={() => setViewImage(image)}
                      >
                        <Expand className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="rounded-full h-8 w-8 p-0"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir imagem</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteImage(image.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-1 text-xs truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog de visualização de imagem */}
      <Dialog open={viewImage !== null} onOpenChange={(open) => !open && setViewImage(null)}>
        <DialogContent className="max-w-3xl w-full p-0 bg-black">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-2 text-white bg-black bg-opacity-50 rounded-full h-8 w-8 p-0 z-10"
              onClick={() => setViewImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {viewImage && (
              <>
                <div className="flex items-center justify-center h-[80vh]">
                  <img 
                    src={viewImage.src} 
                    alt={viewImage.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="bg-black text-white p-3 absolute bottom-0 left-0 right-0">
                  <DialogTitle className="text-white">{viewImage.name}</DialogTitle>
                  <div className="flex gap-4 text-sm text-gray-300 mt-1">
                    <span>Tipo: {viewImage.type}</span>
                    <span>Tamanho: {viewImage.size}</span>
                    <span>Data: {viewImage.date}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagesTab;
