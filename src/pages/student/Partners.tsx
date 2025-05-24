
import React from "react";
import { motion } from "framer-motion";
import { PartnerHeader } from "@/components/student/partners/PartnerHeader";
import { PartnerContent } from "@/components/student/partners/PartnerContent";
import StudentRouteGuard from "@/components/student/RouteGuard";
import { usePartners } from "@/hooks/student/usePartners";

const Partners = () => {
  const {
    searchQuery,
    setSearchQuery,
    partnerTypeFilter,
    setPartnerTypeFilter,
    recommendedFilter,
    setRecommendedFilter,
    filteredPartners,
    selectedPartner,
    setSelectedPartner,
    commentText,
    setCommentText,
    ratingText,
    setRatingText,
    handleAddComment,
    handleAddRating,
    handleLikeComment,
    handleLikeRating,
    calculateAverageRating
  } = usePartners();

  return (
    <StudentRouteGuard requiredMenuKey="partners">
      <div className="w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PartnerHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            partnerTypeFilter={partnerTypeFilter}
            setPartnerTypeFilter={setPartnerTypeFilter}
            recommendedFilter={recommendedFilter}
            setRecommendedFilter={setRecommendedFilter}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>
      </div>
    </StudentRouteGuard>
  );
};

export default Partners;
