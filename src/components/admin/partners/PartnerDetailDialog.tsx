
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsTriggerWithBadge } from "@/components/ui/tabs";
import { Partner } from "@/types/partner.types";

import DetailsTab from "./DetailsTab";
import ContactsTab from "./ContactsTab";
import CommentsTab from "./CommentsTab";
import RatingsTab from "./RatingsTab";
import FilesTab from "./FilesTab";
import HistoryTab from "./HistoryTab";

interface PartnerDetailDialogProps {
  partner: Partner | null;
  onClose: () => void;
  onEdit: (partner: Partner) => void;
  
  // For contacts tab
  newContactName: string;
  newContactRole: string;
  newContactEmail: string;
  newContactPhone: string;
  setNewContactName: (value: string) => void;
  setNewContactRole: (value: string) => void;
  setNewContactEmail: (value: string) => void;
  setNewContactPhone: (value: string) => void;
  handleAddContact: () => void;
  handleDeleteContact: (contactId: number) => void;
  
  // For comments tab
  commentText: string;
  setCommentText: (value: string) => void;
  handleAddComment: () => void;
  handleLikeComment: (commentId: number) => void;
  handleDeleteComment: (commentId: number) => void;
  
  // For ratings tab
  calculateAverageRating: (ratings: any[]) => string;
  ratingValue: number;
  ratingText: string;
  setRatingValue: (value: number) => void;
  setRatingText: (value: string) => void;
  handleAddRating: () => void;
  handleLikeRating: (ratingId: number) => void;
  handleDeleteRating: (ratingId: number) => void;
}

const PartnerDetailDialog = ({
  partner,
  onClose,
  onEdit,
  newContactName,
  newContactRole,
  newContactEmail,
  newContactPhone,
  setNewContactName,
  setNewContactRole,
  setNewContactEmail,
  setNewContactPhone,
  handleAddContact,
  handleDeleteContact,
  commentText,
  setCommentText,
  handleAddComment,
  handleLikeComment,
  handleDeleteComment,
  calculateAverageRating,
  ratingValue,
  ratingText,
  setRatingValue,
  setRatingText,
  handleAddRating,
  handleLikeRating,
  handleDeleteRating
}: PartnerDetailDialogProps) => {
  if (!partner) return null;

  return (
    <Dialog open={!!partner} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl">
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
              <TabsTrigger value="details">Dados do Parceiro</TabsTrigger>
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
              <TabsTriggerWithBadge 
                value="history" 
                badgeCount={partner.history ? partner.history.length : 0}
              >
                Histórico
              </TabsTriggerWithBadge>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details">
              <DetailsTab partner={partner} onEdit={onEdit} />
            </TabsContent>
            
            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <ContactsTab 
                partner={partner}
                newContactName={newContactName}
                newContactRole={newContactRole}
                newContactEmail={newContactEmail}
                newContactPhone={newContactPhone}
                setNewContactName={setNewContactName}
                setNewContactRole={setNewContactRole}
                setNewContactEmail={setNewContactEmail}
                setNewContactPhone={setNewContactPhone}
                handleAddContact={handleAddContact}
                handleDeleteContact={handleDeleteContact}
              />
            </TabsContent>
            
            {/* Comments Tab */}
            <TabsContent value="comments">
              <CommentsTab 
                partner={partner}
                commentText={commentText}
                setCommentText={setCommentText}
                handleAddComment={handleAddComment}
                handleLikeComment={handleLikeComment}
                handleDeleteComment={handleDeleteComment}
              />
            </TabsContent>
            
            {/* Ratings Tab */}
            <TabsContent value="ratings">
              <RatingsTab 
                partner={partner}
                calculateAverageRating={calculateAverageRating}
                ratingValue={ratingValue}
                ratingText={ratingText}
                setRatingValue={setRatingValue}
                setRatingText={setRatingText}
                handleAddRating={handleAddRating}
                handleLikeRating={handleLikeRating}
                handleDeleteRating={handleDeleteRating}
              />
            </TabsContent>
            
            {/* Files Tab */}
            <TabsContent value="files">
              <FilesTab partner={partner} />
            </TabsContent>
            
            {/* History Tab (Admin only) */}
            <TabsContent value="history">
              <HistoryTab partner={partner} />
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerDetailDialog;
