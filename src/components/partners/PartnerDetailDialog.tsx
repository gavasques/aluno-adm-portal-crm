
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  TabsTriggerWithBadge
} from "@/components/ui/tabs";
import { Partner } from "./PartnersTable";
import DetailsTab from "./tabs/DetailsTab";
import ContactsTab from "./tabs/ContactsTab";
import CommentsTab from "./tabs/CommentsTab";
import RatingsTab from "./tabs/RatingsTab";
import FilesTab from "./tabs/FilesTab";

interface PartnerDetailDialogProps {
  partner: Partner | null;
  onClose: () => void;
  commentText: string;
  ratingText: string;
  onCommentTextChange: (text: string) => void;
  onRatingTextChange: (text: string) => void;
  onAddComment: () => void;
  onAddRating: () => void;
  onLikeComment: (commentId: number) => void;
  onLikeRating: (ratingId: number) => void;
  calculateAverageRating: (ratings: any[]) => string;
}

const PartnerDetailDialog: React.FC<PartnerDetailDialogProps> = ({
  partner,
  onClose,
  commentText,
  ratingText,
  onCommentTextChange,
  onRatingTextChange,
  onAddComment,
  onAddRating,
  onLikeComment,
  onLikeRating,
  calculateAverageRating
}) => {
  if (!partner) return null;

  return (
    <Dialog open={!!partner} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{partner.name}</span>
            {partner.recommended && (
              <Badge className="bg-green-500">Recomendado</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="details">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="details">Dados</TabsTrigger>
              <TabsTriggerWithBadge 
                value="contacts" 
                badgeCount={partner.contacts ? partner.contacts.length : 0}
              >
                Contatos
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="comments" 
                badgeCount={partner.comments ? partner.comments.length : 0}
              >
                Comentários
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="ratings" 
                badgeCount={partner.ratings ? partner.ratings.length : 0}
              >
                Avaliações
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="files" 
                badgeCount={partner.files ? partner.files.length : 0}
              >
                Arquivos
              </TabsTriggerWithBadge>
            </TabsList>
            
            <TabsContent value="details">
              <DetailsTab partner={partner} />
            </TabsContent>
            
            <TabsContent value="contacts">
              <ContactsTab partner={partner} />
            </TabsContent>
            
            <TabsContent value="comments">
              <CommentsTab
                partner={partner}
                commentText={commentText}
                onCommentTextChange={onCommentTextChange}
                onAddComment={onAddComment}
                onLikeComment={onLikeComment}
              />
            </TabsContent>
            
            <TabsContent value="ratings">
              <RatingsTab
                partner={partner}
                ratingText={ratingText}
                onRatingTextChange={onRatingTextChange}
                onAddRating={onAddRating}
                onLikeRating={onLikeRating}
                calculateAverageRating={calculateAverageRating}
              />
            </TabsContent>
            
            <TabsContent value="files">
              <FilesTab partner={partner} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerDetailDialog;
