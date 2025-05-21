
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import PartnersTable, { Partner } from "@/components/partners/PartnersTable";
import { Skeleton } from "@/components/ui/skeleton";
import PartnerDetail from "@/components/student/partners/PartnerDetail";

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
    <AnimatePresence mode="wait">
      {!selectedPartner ? (
        <motion.div
          key="partner-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Parceiros</span>
                <motion.span 
                  className="text-sm bg-white/20 px-2 py-1 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {filteredPartners.length} encontrado(s)
                </motion.span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <motion.div 
                  className="p-4"
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
                      <Skeleton className="h-12 w-full mb-2" />
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
                    onViewDetails={setSelectedPartner}
                    calculateAverageRating={calculateAverageRating}
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
          className="bg-white rounded-lg shadow-xl border border-purple-100 overflow-hidden"
        >
          <PartnerDetail
            partner={selectedPartner}
            onBack={() => setSelectedPartner(null)}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
