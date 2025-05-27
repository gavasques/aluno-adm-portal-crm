
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTriggerWithBadge } from "@/components/ui/tabs";
import { Star, MessageSquare, FileText, Calendar } from "lucide-react";

interface PartnerDetailDialogProps {
  partner: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PartnerDetailDialog: React.FC<PartnerDetailDialogProps> = ({
  partner,
  open,
  onOpenChange
}) => {
  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Parceiro: {partner.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTriggerWithBadge value="details" badgeContent="">
              Dados
            </TabsTriggerWithBadge>
            <TabsTriggerWithBadge value="ratings" badgeContent={partner.ratingsCount || 0}>
              Avaliações
            </TabsTriggerWithBadge>
            <TabsTriggerWithBadge value="comments" badgeContent={partner.commentsCount || 0}>
              Comentários
            </TabsTriggerWithBadge>
            <TabsTriggerWithBadge value="history" badgeContent={partner.historyCount || 0}>
              Histórico
            </TabsTriggerWithBadge>
          </TabsList>

          <TabsContent value="details">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome:</label>
                  <p className="text-sm text-gray-600">{partner.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo:</label>
                  <p className="text-sm text-gray-600">{partner.type || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email:</label>
                  <p className="text-sm text-gray-600">{partner.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone:</label>
                  <p className="text-sm text-gray-600">{partner.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ratings">
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma avaliação disponível</p>
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum comentário disponível</p>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum histórico disponível</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
