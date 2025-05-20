
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PartnersTable, { Partner } from "@/components/partners/PartnersTable";
import PartnerDetailDialog from "@/components/partners/PartnerDetailDialog";

interface PartnerContentProps {
  filteredPartners: Partner[];
  selectedPartner: Partner | null;
  setSelectedPartner: (partner: Partner | null) => void;
  commentText: string;
  ratingText: string;
  setCommentText: (text: string) => void;
  setRatingText: (text: string) => void;
  handleAddComment: () => void;
  handleAddRating: () => void;
  handleLikeComment: (commentId: number) => void;
  handleLikeRating: (ratingId: number) => void;
  calculateAverageRating: (ratings: any[]) => string;
}

export function PartnerContent({
  filteredPartners,
  selectedPartner,
  setSelectedPartner,
  commentText,
  ratingText,
  setCommentText,
  setRatingText,
  handleAddComment,
  handleAddRating,
  handleLikeComment,
  handleLikeRating,
  calculateAverageRating
}: PartnerContentProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnersTable 
            partners={filteredPartners}
            onViewDetails={setSelectedPartner}
            calculateAverageRating={calculateAverageRating}
          />
        </CardContent>
      </Card>
      
      {/* Partner Detail Dialog */}
      <PartnerDetailDialog
        partner={selectedPartner}
        onClose={() => setSelectedPartner(null)}
        commentText={commentText}
        ratingText={ratingText}
        onCommentTextChange={setCommentText}
        onRatingTextChange={setRatingText}
        onAddComment={handleAddComment}
        onAddRating={handleAddRating}
        onLikeComment={handleLikeComment}
        onLikeRating={handleLikeRating}
        calculateAverageRating={calculateAverageRating}
      />
    </>
  );
}
