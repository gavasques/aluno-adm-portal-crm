
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import PartnersTable, { Partner } from "@/components/partners/PartnersTable";
import PartnerDetailDialog from "@/components/partners/PartnerDetailDialog";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento para mostrar o skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Parceiros</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                {filteredPartners.length} encontrado(s)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <PartnersTable 
                partners={filteredPartners}
                onViewDetails={setSelectedPartner}
                calculateAverageRating={calculateAverageRating}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
      
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
