
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Trash, Image, ImagePlus } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  isEditing?: boolean;
}

// Função para converter tamanho string para bytes
const stringToBytes = (sizeStr: string): number => {
  const size = parseFloat(sizeStr);
  if (sizeStr.includes("KB")) return size * 1024;
  if (sizeStr.includes("MB")) return size * 1024 * 1024;
  if (sizeStr.includes("GB")) return size * 1024 * 1024 * 1024;
  return size;
};

// Função para formatar bytes para string legível
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Total de armazenamento disponível em bytes (100MB)
const STORAGE_LIMIT = 100 * 1024 * 1024;

// Lista de placeholders para simulação de upload
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
  "https://images.unsplash.com/photo-1579632652768-6cb9dcf85912",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
];

const ImagesTab: React.FC<ImagesTabProps> = ({ 
  images = [], 
  onUpdate,
  isEditing = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Calcular armazenamento usado
  const usedStorage = images.reduce((total, image) => total + stringToBytes(image.size), 0);
  const usedPercentage = (usedStorage / STORAGE_LIMIT) * 100;

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSize = file.size;
      
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast.error("O arquivo selecionado não é uma imagem válida.");
        return;
      }
      
      // Verificar se tem espaço suficiente
      if (usedStorage + fileSize > STORAGE_LIMIT) {
        toast.error("Limite de armazenamento excedido! Remova algumas imagens antes de adicionar novas.");
        return;
      }

      // Simular upload
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Adicionar nova imagem (usando um placeholder para simular)
          const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
          const newImage = {
            id: Date.now(),
            name: file.name,
            src: PLACEHOLDER_IMAGES[randomIndex],
            date: new Date().toISOString().split('T')[0],
            type: file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
            size: formatBytes(file.size)
          };
          
          onUpdate([...images, newImage]);
          toast.success("Imagem enviada com sucesso!");
          setIsUploading(false);
          setUploadProgress(0);
          
          // Limpar o input
          e.target.value = '';
        }
      }, 100);
    }
  };

  const handleDeleteImage = (id: number) => {
    onUpdate(images.filter(image => image.id !== id));
    toast.success("Imagem excluída com sucesso!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Imagens</CardTitle>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-1">
            {formatBytes(usedStorage)} de {formatBytes(STORAGE_LIMIT)} usados
          </div>
          <div className="w-40">
            <Progress value={usedPercentage} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="mb-6">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={handleAddImage}
                disabled={isUploading || usedStorage >= STORAGE_LIMIT}
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  usedStorage >= STORAGE_LIMIT ? 'opacity-50' : ''
                }`}
              >
                <ImagePlus className="h-10 w-10 text-portal-primary mb-2" />
                <span className="text-portal-primary font-medium">
                  {usedStorage >= STORAGE_LIMIT ? 
                    "Limite de armazenamento atingido" : 
                    "Clique para enviar uma imagem"}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  ou arraste e solte aqui
                </span>
              </label>
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Enviando...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}
        
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="border rounded-md overflow-hidden group relative"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => setPreviewImage(image.src)}
                >
                  <AspectRatio ratio={4/3} className="bg-muted">
                    <img
                      src={image.src}
                      alt={image.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                
                <div className="p-2">
                  <div className="text-sm font-medium truncate">{image.name}</div>
                  <div className="text-xs text-gray-500">
                    {image.type} • {image.size} • {image.date}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7 rounded-full"
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
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Image className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>Nenhuma imagem cadastrada.</p>
          </div>
        )}
      </CardContent>
      
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full object-contain max-h-[70vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ImagesTab;
