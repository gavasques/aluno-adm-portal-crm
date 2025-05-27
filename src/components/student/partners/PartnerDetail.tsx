
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Partner } from "@/types/partner.types";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  TabsTriggerWithBadge
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Star, MessageSquare, Users, FileText, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Import tab components
import DetailsTab from "@/components/partners/tabs/DetailsTab";
import ContactsTab from "@/components/partners/tabs/ContactsTab";
import CommentsTab from "@/components/partners/tabs/CommentsTab";
import RatingsTab from "@/components/partners/tabs/RatingsTab";
import FilesTab from "@/components/partners/tabs/FilesTab";

interface PartnerDetailProps {
  partner: Partner;
  onClose: () => void;
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

const PartnerDetail: React.FC<PartnerDetailProps> = ({
  partner,
  onClose,
  commentText,
  ratingText,
  setCommentText,
  setRatingText,
  handleAddComment,
  handleAddRating,
  handleLikeComment,
  handleLikeRating,
  calculateAverageRating
}) => {
  const [activeTab, setActiveTab] = useState("details");
  
  // Define tab-specific gradients and animations
  const tabStyles = {
    details: {
      gradient: "from-blue-500 to-indigo-600",
      hoverGradient: "hover:from-blue-600 hover:to-indigo-700",
      bgGradient: "from-blue-50 to-indigo-50",
      icon: <Info className="h-5 w-5 mr-2" />
    },
    contacts: {
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "hover:from-emerald-600 hover:to-teal-700",
      bgGradient: "from-emerald-50 to-teal-50",
      icon: <Users className="h-5 w-5 mr-2" />
    },
    comments: {
      gradient: "from-amber-500 to-orange-600",
      hoverGradient: "hover:from-amber-600 hover:to-orange-700",
      bgGradient: "from-amber-50 to-orange-50",
      icon: <MessageSquare className="h-5 w-5 mr-2" />
    },
    ratings: {
      gradient: "from-yellow-500 to-amber-600", 
      hoverGradient: "hover:from-yellow-600 hover:to-amber-700",
      bgGradient: "from-yellow-50 to-amber-50",
      icon: <Star className="h-5 w-5 mr-2" />
    },
    files: {
      gradient: "from-purple-500 to-violet-600",
      hoverGradient: "hover:from-purple-600 hover:to-violet-700",
      bgGradient: "from-purple-50 to-violet-50",
      icon: <FileText className="h-5 w-5 mr-2" />
    }
  };

  const averageRating = calculateAverageRating(partner.id);
  
  const calculateAverageRatingString = (ratings: any[]): string => {
    if (!ratings || ratings.length === 0) return "0.0";
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const handleCommentAdd = () => {
    handleAddComment(partner.id, commentText);
  };

  const handleRatingAdd = () => {
    handleAddRating(partner.id, 5, ratingText);
  };

  const handleCommentLike = (commentId: number) => {
    handleLikeComment(partner.id, commentId);
  };

  const handleRatingLike = (ratingId: number) => {
    handleLikeRating(partner.id, ratingId);
  };
  
  return (
    <div className="container mx-auto py-2 px-4">
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-blue-100 transition-colors duration-300"
        >
          <ChevronLeft className="h-6 w-6 text-blue-600" />
        </Button>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">{partner.name}</h1>
            {partner.recommended && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Recomendado
                </Badge>
              </motion.div>
            )}
          </div>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span className="font-medium">{partner.category}</span>
            <span className="mx-2">•</span>
            <span>{partner.type}</span>
            <span className="mx-2">•</span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-2">
                <p className="text-sm">Avaliação média baseada em {partner.ratings.length} avaliações</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </motion.div>

      <Tabs 
        defaultValue="details" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <motion.div
          className="bg-white rounded-lg shadow-md p-1 mb-6 overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <TabsList className="flex w-full bg-gray-100/80">
            <TabsTrigger
              value="details"
              className={`flex-1 rounded-md data-[state=active]:bg-gradient-to-r ${tabStyles.details.gradient} data-[state=active]:text-white transition-all duration-300 data-[state=inactive]:hover:bg-blue-100`}
            >
              {tabStyles.details.icon} Dados
            </TabsTrigger>
            
            <TabsTriggerWithBadge
              value="contacts"
              badgeContent={partner.contacts ? partner.contacts.length : 0}
              className={`flex-1 rounded-md data-[state=active]:bg-gradient-to-r ${tabStyles.contacts.gradient} data-[state=active]:text-white transition-all duration-300 data-[state=inactive]:hover:bg-emerald-100`}
            >
              {tabStyles.contacts.icon} Contatos
            </TabsTriggerWithBadge>
            
            <TabsTriggerWithBadge
              value="comments"
              badgeContent={partner.comments ? partner.comments.length : 0}
              className={`flex-1 rounded-md data-[state=active]:bg-gradient-to-r ${tabStyles.comments.gradient} data-[state=active]:text-white transition-all duration-300 data-[state=inactive]:hover:bg-amber-100`}
            >
              {tabStyles.comments.icon} Comentários
            </TabsTriggerWithBadge>
            
            <TabsTriggerWithBadge
              value="ratings"
              badgeContent={partner.ratings ? partner.ratings.length : 0}
              className={`flex-1 rounded-md data-[state=active]:bg-gradient-to-r ${tabStyles.ratings.gradient} data-[state=active]:text-white transition-all duration-300 data-[state=inactive]:hover:bg-yellow-100`}
            >
              {tabStyles.ratings.icon} Avaliações
            </TabsTriggerWithBadge>
            
            <TabsTriggerWithBadge
              value="files"
              badgeContent={partner.files ? partner.files.length : 0}
              className={`flex-1 rounded-md data-[state=active]:bg-gradient-to-r ${tabStyles.files.gradient} data-[state=active]:text-white transition-all duration-300 data-[state=inactive]:hover:bg-purple-100`}
            >
              {tabStyles.files.icon} Arquivos
            </TabsTriggerWithBadge>
          </TabsList>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <TabsContent value="details" className="mt-0">
              <Card className={`border-none shadow-md overflow-hidden bg-gradient-to-br ${tabStyles.details.bgGradient}`}>
                <CardHeader className={`bg-gradient-to-r ${tabStyles.details.gradient} text-white`}>
                  <CardTitle className="flex items-center">
                    {tabStyles.details.icon} Dados do Parceiro
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <DetailsTab partner={partner} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-0">
              <Card className={`border-none shadow-md overflow-hidden bg-gradient-to-br ${tabStyles.contacts.bgGradient}`}>
                <CardHeader className={`bg-gradient-to-r ${tabStyles.contacts.gradient} text-white`}>
                  <CardTitle className="flex items-center">
                    {tabStyles.contacts.icon} Contatos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ContactsTab partner={partner} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-0">
              <Card className={`border-none shadow-md overflow-hidden bg-gradient-to-br ${tabStyles.comments.bgGradient}`}>
                <CardHeader className={`bg-gradient-to-r ${tabStyles.comments.gradient} text-white`}>
                  <CardTitle className="flex items-center">
                    {tabStyles.comments.icon} Comentários
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CommentsTab
                    partner={partner}
                    commentText={commentText}
                    onCommentTextChange={setCommentText}
                    onAddComment={handleCommentAdd}
                    onLikeComment={handleCommentLike}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ratings" className="mt-0">
              <Card className={`border-none shadow-md overflow-hidden bg-gradient-to-br ${tabStyles.ratings.bgGradient}`}>
                <CardHeader className={`bg-gradient-to-r ${tabStyles.ratings.gradient} text-white`}>
                  <CardTitle className="flex items-center">
                    {tabStyles.ratings.icon} Avaliações
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <RatingsTab
                    partner={partner}
                    ratingText={ratingText}
                    onRatingTextChange={setRatingText}
                    onAddRating={handleRatingAdd}
                    onLikeRating={handleRatingLike}
                    calculateAverageRating={calculateAverageRatingString}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="files" className="mt-0">
              <Card className={`border-none shadow-md overflow-hidden bg-gradient-to-br ${tabStyles.files.bgGradient}`}>
                <CardHeader className={`bg-gradient-to-r ${tabStyles.files.gradient} text-white`}>
                  <CardTitle className="flex items-center">
                    {tabStyles.files.icon} Arquivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FilesTab partner={partner} />
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default PartnerDetail;
