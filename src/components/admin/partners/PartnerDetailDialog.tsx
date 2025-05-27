import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTriggerWithBadge } from "@/components/ui/tabs";
import { Eye, Star, MessageSquare, FileText, Images, Calendar } from "lucide-react";
import { Partner } from "@/types/partner.types";
import { DetailsTab } from "./tabs/DetailsTab";
import { RatingsTab } from "./tabs/RatingsTab";
import { CommentsTab } from "./tabs/CommentsTab";
import { FilesTab } from "./tabs/FilesTab";
import { HistoryTab } from "./tabs/HistoryTab";

interface PartnerDetailDialogProps {
  partner: Partner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PartnerDetailDialog: React.FC<PartnerDetailDialogProps> = ({
  partner,
  open,
  onOpenChange
}) => {
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalhes do Parceiro: {partner.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTriggerWithBadge value="details" badgeContent="">
              Dados
            </TabsTriggerWithBadge>
            <TabsTriggerWithBadge value="ratings" badgeContent={partner.ratingsCount || 0}>
              Avaliações
            </TabsTriggerWithBadge>
            <TabsTriggerWithBadge value="comments" badgeContent={partner.commentsCount || 0}>
              Comentários
            </TabsTriggerWithBadge>
            <TabsTriggerWithBadge value="files" badgeContent={partner.filesCount || 0}>
              Arquivos
            </TabsTriggerWithBadge>
            <TabsTriggerWithBadge value="history" badgeContent={partner.historyCount || 0}>
              Histórico
            </TabsTriggerWithBadge>
          </TabsList>

          <TabsContent value="details">
            <DetailsTab partner={partner} />
          </TabsContent>

          <TabsContent value="ratings">
            <RatingsTab partnerId={partner.id} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsTab partnerId={partner.id} />
          </TabsContent>

          <TabsContent value="files">
            <FilesTab partnerId={partner.id} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab partnerId={partner.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
