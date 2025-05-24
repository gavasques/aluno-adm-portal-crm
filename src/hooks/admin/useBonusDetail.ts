
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Bonus, BonusType, AccessPeriod } from "@/types/bonus.types";

export const useBonusDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "Outros" as BonusType,
    description: "",
    accessPeriod: "30 dias" as AccessPeriod,
    observations: ""
  });

  useEffect(() => {
    const fetchBonus = () => {
      setIsLoading(true);
      
      const storedBonuses = localStorage.getItem("bonuses");
      const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
      
      const foundBonus = bonuses.find(b => b.id === id);
      
      if (foundBonus) {
        setBonus(foundBonus);
        setFormData({
          name: foundBonus.name,
          type: foundBonus.type,
          description: foundBonus.description,
          accessPeriod: foundBonus.access_period,
          observations: foundBonus.observations || ""
        });
      } else {
        toast.error("Bônus não encontrado");
        navigate("/admin/bonus");
      }
      
      setIsLoading(false);
    };
    
    fetchBonus();
  }, [id, navigate]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!bonus) return;
    
    const updatedBonus: Bonus = {
      ...bonus,
      name: formData.name,
      type: formData.type,
      description: formData.description,
      access_period: formData.accessPeriod,
      observations: formData.observations
    };
    
    const storedBonuses = localStorage.getItem("bonuses");
    const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
    
    const updatedBonuses = bonuses.map(b => 
      b.id === id ? updatedBonus : b
    );
    
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    setBonus(updatedBonus);
    setIsEditing(false);
    toast.success("Bônus atualizado com sucesso!");
  };
  
  const handleDelete = () => {
    if (!bonus) return;
    
    const storedBonuses = localStorage.getItem("bonuses");
    const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
    
    const updatedBonuses = bonuses.filter(b => b.id !== id);
    
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    localStorage.removeItem(`bonus_${id}_comments`);
    localStorage.removeItem(`bonus_${id}_files`);
    
    toast.success("Bônus removido com sucesso!");
    navigate("/admin/bonus");
  };

  const handleCancel = () => {
    if (bonus) {
      setFormData({
        name: bonus.name,
        type: bonus.type,
        description: bonus.description,
        accessPeriod: bonus.access_period,
        observations: bonus.observations || ""
      });
    }
    setIsEditing(false);
  };

  return {
    isLoading,
    bonus,
    isEditing,
    formData,
    setIsEditing,
    handleFormChange,
    handleSave,
    handleDelete,
    handleCancel,
    navigate
  };
};
