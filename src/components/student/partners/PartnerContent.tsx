
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PartnersTable from "@/components/partners/PartnersTable";
import PartnerDetail from "@/components/student/partners/PartnerDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Partner } from "@/types/partner.types";

interface PartnerContentProps {
  filteredPartners: Partner[];
  selectedPartner: Partner | null;
  setSelectedPartner: (partner: Partner | null) => void;
  commentText: string;
  ratingText: string;
  setCommentText: (text: string) => void;
  setRatingText: (text: string) => void;
  handleAddComment: (partnerId: number, comment: string) => void;
  handleAddRating: (partnerId: number, rating: number, comment: string) => void;
  handleLikeComment: (partnerId: number, commentId: number) => void;
  handleLikeRating: (partnerId: number, ratingId: number) => void;
  calculateAverageRating: (partnerId: number) => number;
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
    <AnimatePresence mode="wait">
      {!selectedPartner ? (
        <motion.div
          key="partner-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-green-50">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white py-[9px] px-[12px] mx-0 my-0">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">Lista de Parceiros</span>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {filteredPartners.length} encontrado(s)
                  </motion.div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <motion.div
                  className="p-6 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Skeleton className="h-10 w-full mb-4" />
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    >
                      <Skeleton className="h-16 w-full mb-2 rounded-md" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <PartnersTable
                    partners={filteredPartners}
                    onSelectPartner={setSelectedPartner}
                    isAdmin={false}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="partner-detail"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-xl border border-green-100 overflow-hidden"
        >
          <PartnerDetail
            partner={selectedPartner}
            onClose={() => setSelectedPartner(null)}
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
      )}
    </AnimatePresence>
  );
}
