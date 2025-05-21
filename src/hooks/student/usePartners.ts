
import { useState } from "react";
import { Partner } from "@/components/partners/PartnersTable";

// Dados de exemplo para parceiros
const PARTNERS = [
  {
    id: 1,
    name: "Marketing Digital Pro",
    category: "Marketing Digital",
    type: "Agência",
    rating: 4.8,
    commentCount: 14,
    recommended: true,
    website: "www.marketingdigitalpro.com",
    contacts: [
      { name: "Maria Silva", role: "Gerente de Contas", email: "maria@marketingpro.com", phone: "(11) 98765-4321" }
    ],
    description: "Agência especializada em marketing digital para e-commerce.",
    ratings: [
      { id: 1, user: "Ana Carolina", rating: 4, comment: "Ótima parceria, sempre disponíveis para ajudar.", likes: 3 },
      { id: 2, user: "Pedro Santos", rating: 5, comment: "Excelente atendimento e resultados.", likes: 1 }
    ],
    comments: [
      { id: 1, user: "Maria Oliveira", text: "Vocês poderiam compartilhar mais detalhes sobre os serviços deste parceiro?", date: "15/05/2025", likes: 3 },
      { id: 2, user: "Carlos Mendes", text: "Tive uma ótima experiência com eles no meu projeto de e-commerce.", date: "12/05/2025", likes: 2 }
    ],
    files: [],
    history: []
  },
  {
    id: 2,
    name: "Logística Express",
    category: "Logística",
    type: "Serviço",
    rating: 4.3,
    commentCount: 7,
    recommended: false,
    website: "www.logisticaexpress.com",
    contacts: [
      { name: "João Oliveira", role: "Diretor Comercial", email: "joao@logisticaexpress.com", phone: "(11) 97654-3210" }
    ],
    description: "Empresa especializada em logística para e-commerce.",
    ratings: [
      { id: 1, user: "Carlos Silva", rating: 4, comment: "Entrega rápida e serviço de qualidade.", likes: 2 }
    ],
    comments: [
      { id: 1, user: "Amanda Costa", text: "Eles atendem entregas para todo o Brasil?", date: "08/05/2025", likes: 0 }
    ],
    files: [],
    history: []
  },
  {
    id: 3,
    name: "Contabilidade Online",
    category: "Contabilidade",
    type: "Consultor",
    rating: 4.6,
    commentCount: 9,
    recommended: true,
    website: "www.contabilidadeonline.com",
    contacts: [
      { name: "Ana Paula", role: "Contadora Chefe", email: "ana@contabilidadeonline.com", phone: "(11) 99876-5432" }
    ],
    description: "Serviços de contabilidade especializada para e-commerce.",
    ratings: [
      { id: 1, user: "Ricardo Martins", rating: 5, comment: "Profissionais excelentes, super recomendo!", likes: 4 }
    ],
    comments: [
      { id: 1, user: "Fernanda Lima", text: "Qual o valor médio da consultoria mensal?", date: "05/05/2025", likes: 1 }
    ],
    files: [],
    history: []
  },
];

export const usePartners = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("");
  const [recommendedFilter, setRecommendedFilter] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [ratingText, setRatingText] = useState("");
  const [commentText, setCommentText] = useState("");
  
  // Filter partners based on search query and filters
  const filteredPartners = PARTNERS.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = partnerTypeFilter === "" || partner.type === partnerTypeFilter;
    
    const matchesRecommended = recommendedFilter === "" || 
                              (recommendedFilter === "recommended" && partner.recommended) ||
                              (recommendedFilter === "not-recommended" && !partner.recommended);
    
    return matchesSearch && matchesType && matchesRecommended;
  });

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return "0.0";
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  // Handle like for a rating
  const handleLikeRating = (ratingId) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.map(rating => {
        if (rating.id === ratingId) {
          return { ...rating, likes: rating.likes + 1 };
        }
        return rating;
      });
      setSelectedPartner({...selectedPartner, ratings: updatedRatings});
    }
  };
  
  // Handle like for a comment
  const handleLikeComment = (commentId) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      });
      setSelectedPartner({...selectedPartner, comments: updatedComments});
    }
  };
  
  // Handle adding a new rating
  const handleAddRating = () => {
    if (selectedPartner && ratingText) {
      const newRating = {
        id: Date.now(),
        user: "Usuário",
        rating: 5,
        comment: ratingText,
        likes: 0
      };
      
      const updatedRatings = [...selectedPartner.ratings, newRating];
      setSelectedPartner({...selectedPartner, ratings: updatedRatings});
      setRatingText("");
    }
  };
  
  // Handle adding a new comment
  const handleAddComment = () => {
    if (selectedPartner && commentText) {
      const newComment = {
        id: Date.now(),
        user: "Usuário",
        text: commentText,
        date: new Date().toLocaleDateString(),
        likes: 0
      };
      
      const updatedComments = [...selectedPartner.comments, newComment];
      setSelectedPartner({...selectedPartner, comments: updatedComments});
      setCommentText("");
    }
  };
  
  return {
    searchQuery,
    setSearchQuery,
    partnerTypeFilter,
    setPartnerTypeFilter,
    recommendedFilter,
    setRecommendedFilter,
    selectedPartner,
    setSelectedPartner,
    ratingText,
    setRatingText,
    commentText,
    setCommentText,
    filteredPartners,
    calculateAverageRating,
    handleLikeRating,
    handleLikeComment,
    handleAddRating,
    handleAddComment
  };
};
