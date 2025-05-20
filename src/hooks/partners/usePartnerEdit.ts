
import { useState } from "react";
import { Partner } from "@/types/partner.types";
import { useToast } from "@/hooks/use-toast";

export const usePartnerEdit = (updatePartner: (partner: Partner) => void) => {
  const { toast } = useToast();
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  
  const handleEditPartner = (partner: Partner | null) => {
    setEditingPartner(partner ? {...partner} : null);
  };
  
  const handleSavePartner = () => {
    if (editingPartner) {
      // Adicionar registro ao histórico
      const updatedHistory = [...(editingPartner.history || []), {
        id: Date.now(),
        action: "Parceiro editado",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...editingPartner,
        history: updatedHistory
      };
      
      updatePartner(updatedPartner);
      setEditingPartner(null);
      
      toast({
        title: "Parceiro atualizado com sucesso!",
        variant: "default",
      });
    }
  };
  
  return {
    editingPartner,
    setEditingPartner,
    handleEditPartner,
    handleSavePartner
  };
};
