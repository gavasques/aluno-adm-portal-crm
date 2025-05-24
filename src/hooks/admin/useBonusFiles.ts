
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface BonusFile {
  id: string;
  name: string;
  size: number;
  type: string;
  description: string;
  uploadedAt: Date;
}

export const useBonusFiles = (bonusId: string | undefined) => {
  const [files, setFiles] = useState<BonusFile[]>([]);
  const [newFileDescription, setNewFileDescription] = useState("");

  useEffect(() => {
    if (!bonusId) return;
    
    const storedFiles = localStorage.getItem(`bonus_${bonusId}_files`);
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles).map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt)
      })));
    }
  }, [bonusId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !bonusId) return;
    
    const file = e.target.files[0];
    const newFile: BonusFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      description: newFileDescription,
      uploadedAt: new Date()
    };
    
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    localStorage.setItem(`bonus_${bonusId}_files`, JSON.stringify(updatedFiles));
    setNewFileDescription("");
    
    e.target.value = '';
    
    toast.success("Arquivo adicionado!");
  };
  
  const deleteFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    if (bonusId) {
      localStorage.setItem(`bonus_${bonusId}_files`, JSON.stringify(updatedFiles));
    }
    toast.success("Arquivo removido!");
  };

  return {
    files,
    newFileDescription,
    setNewFileDescription,
    handleFileUpload,
    deleteFile
  };
};
