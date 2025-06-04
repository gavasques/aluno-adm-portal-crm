
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, User, Edit } from "lucide-react";
import { CRMLead, CRMPipelineColumn } from "@/types/crm.types";
import { LeadPipelineControls } from "./lead-detail/LeadPipelineControls";

interface LeadDetailDialogProps {
  lead: CRMLead | null;
  columns: CRMPipelineColumn[];
  onClose: () => void;
  onEdit: (lead: CRMLead) => void;
}

const LeadDetailDialog = React.memo(({ lead, columns, onClose, onEdit }: LeadDetailDialogProps) => {
  if (!lead) return null;

  const leadColumn = columns.find(col => col.id === lead.column_id);

  const handleLeadUpdate = () => {
    // Force re-render/refresh - can be enhanced with query invalidation
    console.log('Lead updated, refreshing data...');
  };

  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-2" />
              {lead.name} - {lead.email}
            </div>
            <Button 
              onClick={e => {
                e.stopPropagation();
                onEdit(lead);
              }} 
              variant="outline" 
              size="sm" 
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Lead
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Detalhes do Lead</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                      <p className="mt-1 text-base">{lead.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-base">{lead.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                      <p className="mt-1 text-base">{lead.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Responsável</h3>
                      <p className="mt-1 text-base">{lead.responsible?.name || 'Sem responsável'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Estágio</h3>
                      <p className="mt-1 text-base">{leadColumn?.name || 'Não definido'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="mt-1 text-base capitalize">{lead.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tem Empresa</h3>
                      <p className="mt-1 text-base">{lead.has_company ? 'Sim' : 'Não'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Vende na Amazon</h3>
                      <p className="mt-1 text-base">{lead.sells_on_amazon ? 'Sim' : 'Não'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Trabalha com FBA</h3>
                      <p className="mt-1 text-base">{lead.works_with_fba ? 'Sim' : 'Não'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Busca marca própria</h3>
                      <p className="mt-1 text-base">{lead.seeks_private_label ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                  
                  {lead.notes && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500">Observações</h3>
                      <p className="mt-1 text-base whitespace-pre-wrap">{lead.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Comentários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      Nenhum comentário ainda.
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Adicionar comentário</h4>
                    <textarea className="w-full border rounded-md p-2 min-h-[100px]" placeholder="Digite seu comentário..." />
                    <Button className="mt-2">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Adicionar Comentário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Histórico de Atividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-gray-200 ml-3 pl-8 pb-2">
                    <div className="mb-8 relative">
                      <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <User className="text-white h-3 w-3" />
                      </div>
                      <p className="font-medium">Lead criado</p>
                      <p className="text-sm text-gray-600">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
                      <p className="text-sm mt-1">Lead adicionado ao sistema.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Nenhum documento anexado.
                  </div>
                  <Button variant="outline" className="mt-4">
                    <span className="mr-2">+</span>
                    Adicionar Documento
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Controles de Pipeline - Adicionados no final */}
        <LeadPipelineControls lead={lead} onLeadUpdate={handleLeadUpdate} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

LeadDetailDialog.displayName = 'LeadDetailDialog';

export default LeadDetailDialog;
