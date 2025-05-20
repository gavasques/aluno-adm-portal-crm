
import React from "react";
import { motion } from "framer-motion";
import { PartnerHeader } from "@/components/student/partners/PartnerHeader";
import { PartnerContent } from "@/components/student/partners/PartnerContent";
import { usePartners } from "@/hooks/student/usePartners";
import { Toaster } from "@/components/ui/sonner";

const Partners = () => {
  const {
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
  } = usePartners();
  
  return (
    <motion.div 
      className="container mx-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!selectedPartner && (
        <PartnerHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          partnerTypeFilter={partnerTypeFilter}
          setPartnerTypeFilter={setPartnerTypeFilter}
          recommendedFilter={recommendedFilter}
          setRecommendedFilter={setRecommendedFilter}
        />
      )}
      
      <PartnerContent
        filteredPartners={filteredPartners}
        selectedPartner={selectedPartner}
        setSelectedPartner={setSelectedPartner}
        commentText={commentText}
        ratingText={ratingText}
        setCommentText={setCommentText}
        setRatingText={setRatingText}
        handleAddComment={handleAddComment}
        handleAddRating={handleAddRating}
        handleLikeComment={handleLikeComment}
        handleLikeRating={handleLikeRating}
        calculateAverageRating={calculateAverageRating}
      />

      <Toaster />
    </motion.div>
  );
};

export default Partners;
