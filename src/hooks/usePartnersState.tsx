
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Define interfaces
export interface Comment {
  id: number;
  text: string;
  date: string;
  user: string;
  likes: number;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  user: string;
  text: string;
  date: string;
}

export interface Rating {
  id: number;
  user: string;
  rating: number;
  comment: string;
  likes: number;
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface File {
  id: number;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export interface HistoryItem {
  id: number;
  action: string;
  user: string;
  date: string;
}

export interface Partner {
  id: number;
  name: string;
  category: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  website: string;
  recommended: boolean;
  ratings: Rating[];
  comments: Comment[];
  contacts: Contact[];
  files: File[];
  history: HistoryItem[];
}

export const usePartnersState = () => {
  const { toast } = useToast();

  // State for partners
  const [partners, setPartners] = useState<Partner[]>([
    { 
      id: 1, 
      name: "Consultoria XYZ", 
      category: "Consultoria", 
      type: "Agência",
      contact: "João Silva", 
      phone: "(11) 98765-4321", 
      email: "contato@consultoriaxyz.com", 
      address: "Av. Paulista, 1000 - São Paulo, SP", 
      description: "Consultoria especializada em comércio eletrônico e marketing digital.",
      website: "www.consultoriaxyz.com",
      recommended: true,
      ratings: [
        { id: 1, user: "Ana Carolina", rating: 4, comment: "Ótima parceria, sempre disponíveis para ajudar.", likes: 2 },
        { id: 2, user: "Pedro Santos", rating: 5, comment: "Excelente atendimento e resultados.", likes: 0 }
      ],
      comments: [
        { id: 1, user: "Maria Oliveira", text: "Vocês poderiam compartilhar mais detalhes sobre os serviços deste parceiro?", date: "15/05/2025", likes: 3 },
        { id: 2, user: "Carlos Mendes", text: "Tive uma ótima experiência com eles no meu projeto de e-commerce.", date: "12/05/2025", likes: 2, replies: [
          { id: 1, user: "Ana Silva", text: "Qual serviço você contratou com eles?", date: "13/05/2025" }
        ] }
      ],
      contacts: [
        { id: 1, name: "João Silva", role: "Gerente de Contas", email: "joao@consultoriaxyz.com", phone: "(11) 98765-4321" },
        { id: 2, name: "Maria Oliveira", role: "Diretora de Projetos", email: "maria@consultoriaxyz.com", phone: "(11) 91234-5678" }
      ],
      files: [],
      history: [
        { id: 1, action: "Parceiro adicionado", user: "Admin", date: "10/05/2025" },
        { id: 2, action: "Marcado como recomendado", user: "Admin", date: "11/05/2025" },
        { id: 3, action: "Contato adicionado: João Silva", user: "Admin", date: "12/05/2025" }
      ]
    },
    { 
      id: 2, 
      name: "Marketing Digital Pro", 
      category: "Marketing", 
      type: "Consultor",
      contact: "Maria Oliveira", 
      phone: "(11) 91234-5678", 
      email: "contato@marketingdigitalpro.com", 
      address: "Rua Augusta, 500 - São Paulo, SP", 
      description: "Agência especializada em marketing digital para e-commerce.",
      website: "www.marketingdigitalpro.com",
      recommended: false,
      ratings: [
        { id: 1, user: "João Silva", rating: 5, comment: "Estratégias eficientes e resultados rápidos.", likes: 1 },
        { id: 2, user: "Ana Carolina", rating: 4, comment: "Boa comunicação e entregas no prazo.", likes: 0 }
      ],
      comments: [
        { id: 1, user: "Roberto Almeida", text: "Alguém já trabalhou com eles em campanhas para Facebook?", date: "10/05/2025", likes: 1 }
      ],
      contacts: [
        { id: 1, name: "Maria Oliveira", role: "Diretora", email: "maria@marketingpro.com", phone: "(11) 91234-5678" }
      ],
      files: [
        { id: 1, name: "Apresentação.pdf", size: "2.5 MB", uploadedBy: "Admin", date: "15/05/2025" }
      ],
      history: [
        { id: 1, action: "Parceiro adicionado", user: "Admin", date: "05/05/2025" },
        { id: 2, action: "Arquivo adicionado: Apresentação.pdf", user: "Admin", date: "15/05/2025" }
      ]
    },
    { 
      id: 3, 
      name: "Logística Express", 
      category: "Logística", 
      type: "Serviço",
      contact: "Carlos Mendes", 
      phone: "(11) 93333-4444", 
      email: "contato@logisticaexpress.com", 
      address: "Av. das Nações Unidas, 2000 - São Paulo, SP", 
      description: "Soluções logísticas completas para e-commerce.",
      website: "www.logisticaexpress.com",
      recommended: true,
      ratings: [
        { id: 1, user: "Pedro Santos", rating: 3, comment: "Bom serviço, mas prazos de entrega podem melhorar.", likes: 0 }
      ],
      comments: [
        { id: 1, user: "Amanda Costa", text: "Eles atendem entregas para todo o Brasil?", date: "08/05/2025", likes: 0 }
      ],
      contacts: [
        { id: 1, name: "Carlos Mendes", role: "Executivo de Contas", email: "carlos@logisticaexpress.com", phone: "(11) 93333-4444" }
      ],
      files: [],
      history: [
        { id: 1, action: "Parceiro adicionado", user: "Admin", date: "01/05/2025" },
        { id: 2, action: "Marcado como recomendado", user: "Admin", date: "02/05/2025" }
      ]
    },
  ]);
  
  // UI state
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("all");
  const [recommendedFilter, setRecommendedFilter] = useState("all");
  
  // Form state for new contacts
  const [newContactName, setNewContactName] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  
  // Form state for new comments and ratings
  const [commentText, setCommentText] = useState("");
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingText, setRatingText] = useState("");
  
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
  
  // Helper functions
  const handleOpenPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };
  
  const handleClosePartner = () => {
    setSelectedPartner(null);
  };
  
  const calculateAverageRating = (ratings: Rating[]): string => {
    if (!ratings || !ratings.length) return "0.0";
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  const handleDeletePartner = (id: number) => {
    setPartners(partners.filter(partner => partner.id !== id));
    setSelectedPartner(null);
    toast({
      title: "Parceiro excluído com sucesso!",
      variant: "default",
    });
  };

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
      
      setPartners(partners.map(p => p.id === editingPartner.id ? updatedPartner : p));
      
      // Se o parceiro editado for o selecionado, atualize a visualização
      if (selectedPartner && selectedPartner.id === editingPartner.id) {
        setSelectedPartner(updatedPartner);
      }
      
      setEditingPartner(null);
      toast({
        title: "Parceiro atualizado com sucesso!",
        variant: "default",
      });
    }
  };

  const handleAddContact = () => {
    if (selectedPartner && newContactName && newContactEmail) {
      const newContact = {
        id: Date.now(),
        name: newContactName,
        role: newContactRole,
        email: newContactEmail,
        phone: newContactPhone
      };
      
      const updatedContacts = [...(selectedPartner.contacts || []), newContact];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: `Contato adicionado: ${newContactName}`,
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        contacts: updatedContacts,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      
      // Reset form
      setNewContactName("");
      setNewContactRole("");
      setNewContactEmail("");
      setNewContactPhone("");
      toast({
        title: "Contato adicionado com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleDeleteContact = (contactId: number) => {
    if (selectedPartner) {
      const contactToDelete = selectedPartner.contacts.find(c => c.id === contactId);
      const updatedContacts = selectedPartner.contacts.filter(c => c.id !== contactId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: `Contato removido: ${contactToDelete?.name || 'Desconhecido'}`,
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        contacts: updatedContacts,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      toast({
        title: "Contato removido com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleAddComment = () => {
    if (selectedPartner && commentText) {
      const newComment = {
        id: Date.now(),
        user: "Admin",
        text: commentText,
        date: new Date().toLocaleDateString(),
        likes: 0
      };
      
      const updatedComments = [...(selectedPartner.comments || []), newComment];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Comentário adicionado",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      setCommentText("");
      toast({
        title: "Comentário adicionado com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleLikeComment = (commentId: number) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      });
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.filter(comment => comment.id !== commentId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Comentário removido",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      toast({
        title: "Comentário removido com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleAddRating = () => {
    if (selectedPartner && ratingText) {
      const newRating = {
        id: Date.now(),
        user: "Admin",
        rating: ratingValue,
        comment: ratingText,
        likes: 0
      };
      
      const updatedRatings = [...(selectedPartner.ratings || []), newRating];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Avaliação adicionada",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      setRatingText("");
      setRatingValue(5);
      toast({
        title: "Avaliação adicionada com sucesso!",
        variant: "default",
      });
    }
  };
  
  const handleLikeRating = (ratingId: number) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.map(rating => {
        if (rating.id === ratingId) {
          return { ...rating, likes: rating.likes + 1 };
        }
        return rating;
      });
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
    }
  };

  const handleDeleteRating = (ratingId: number) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.filter(rating => rating.id !== ratingId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Avaliação removida",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      toast({
        title: "Avaliação removida com sucesso!",
        variant: "default",
      });
    }
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
      
      if (selectedPartner && selectedPartner.id === partnerId) {
        setSelectedPartner(updatedPartner);
      }
    }
  };

  return {
    // State
    partners,
    filteredPartners,
    selectedPartner,
    editingPartner,
    searchQuery,
    partnerTypeFilter,
    recommendedFilter,
    newContactName,
    newContactEmail,
    newContactRole,
    newContactPhone,
    commentText,
    ratingValue,
    ratingText,
    
    // Setters
    setSearchQuery,
    setPartnerTypeFilter,
    setRecommendedFilter,
    setNewContactName,
    setNewContactEmail,
    setNewContactRole,
    setNewContactPhone,
    setCommentText,
    setRatingValue,
    setRatingText,
    setEditingPartner,
    
    // Actions
    handleOpenPartner,
    handleClosePartner,
    calculateAverageRating,
    handleDeletePartner,
    handleEditPartner,
    handleSavePartner,
    handleAddContact,
    handleDeleteContact,
    handleAddComment,
    handleLikeComment,
    handleDeleteComment,
    handleAddRating,
    handleLikeRating,
    handleDeleteRating,
    toggleRecommendedStatus
  };
};
