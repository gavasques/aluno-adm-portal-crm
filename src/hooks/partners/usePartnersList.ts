
import { useState } from "react";
import { initialPartnersData } from "@/data/partnersData";
import { Partner } from "@/types/partner.types";
import { useToast } from "@/hooks/use-toast";

export const usePartnersList = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>(initialPartnersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("all");
  const [recommendedFilter, setRecommendedFilter] = useState("all");
  
  // Filter partners based on search and filters
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = partnerTypeFilter === "all" || partner.type === partnerTypeFilter;
    
    const matchesRecommended = recommendedFilter === "all" || 
                             (recommendedFilter === "recommended" && partner.recommended) ||
                             (recommendedFilter === "not-recommended" && !partner.recommended);
    
    return matchesSearch && matchesType && matchesRecommended;
  });
  
  const handleDeletePartner = (id: number) => {
    setPartners(partners.filter(partner => partner.id !== id));
    toast({
      title: "Parceiro excluído com sucesso!",
      variant: "default",
    });
  };
  
  const toggleRecommendedStatus = (partnerId: number) => {
    const partnerToUpdate = partners.find(p => p.id === partnerId);
    if (partnerToUpdate) {
      const isRecommended = !partnerToUpdate.recommended;
      
      const updatedHistory = [...(partnerToUpdate.history || []), {
        id: Date.now(),
        action: isRecommended ? "Marcado como recomendado" : "Desmarcado como recomendado",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...partnerToUpdate,
        recommended: isRecommended,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === partnerId ? updatedPartner : p));
    }
  };
  
  const updatePartner = (updatedPartner: Partner) => {
    setPartners(partners.map(p => p.id === updatedPartner.id ? updatedPartner : p));
  };
  
  return {
    partners,
    setPartners,
    filteredPartners,
    searchQuery,
    setSearchQuery,
    partnerTypeFilter,
    setPartnerTypeFilter,
    recommendedFilter,
    setRecommendedFilter,
    handleDeletePartner,
    toggleRecommendedStatus,
    updatePartner
  };
};
