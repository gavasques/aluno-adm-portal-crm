
import { Partner } from "@/types/partner.types";
import { usePartnersList } from "./partners/usePartnersList";
import { usePartnerDetail } from "./partners/usePartnerDetail";
import { usePartnerEdit } from "./partners/usePartnerEdit";
import { usePartnerContacts } from "./partners/usePartnerContacts";
import { usePartnerComments } from "./partners/usePartnerComments";
import { usePartnerRatings } from "./partners/usePartnerRatings";

export const usePartnersState = () => {
  const { 
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
  } = usePartnersList();
  
  const {
    selectedPartner,
    setSelectedPartner,
    handleOpenPartner,
    handleClosePartner,
    calculateAverageRating
  } = usePartnerDetail();
  
  const {
    editingPartner,
    setEditingPartner,
    handleEditPartner,
    handleSavePartner
  } = usePartnerEdit(updatePartner);
  
  const {
    newContactName,
    newContactRole,
    newContactEmail,
    newContactPhone,
    setNewContactName,
    setNewContactRole,
    setNewContactEmail,
    setNewContactPhone,
    handleAddContact,
    handleDeleteContact
  } = usePartnerContacts(selectedPartner, setSelectedPartner, updatePartner);
  
  const {
    commentText,
    setCommentText,
    handleAddComment,
    handleLikeComment,
    handleDeleteComment
  } = usePartnerComments(selectedPartner, setSelectedPartner, updatePartner);
  
  const {
    ratingValue,
    ratingText,
    setRatingValue,
    setRatingText,
    handleAddRating,
    handleLikeRating,
    handleDeleteRating
  } = usePartnerRatings(selectedPartner, setSelectedPartner, updatePartner);
  
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

export * from "@/types/partner.types";
