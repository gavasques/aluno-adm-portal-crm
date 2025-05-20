
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
import { Lead, Column } from "@/hooks/useCRMState";

interface LeadDetailDialogProps {
  lead: Lead | null;
  columns: Column[];
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

const LeadDetailDialog = ({ lead, columns, onClose, onEdit }: LeadDetailDialogProps) => {
  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-2" />
              {lead.name} - {lead.company}
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
                      <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                      <p className="mt-1 text-base">{lead.company}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-base">{lead.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                      <p className="mt-1 text-base">{lead.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Responsável</h3>
                      <p className="mt-1 text-base">{lead.responsible}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Estágio</h3>
                      <p className="mt-1 text-base">{columns.find(col => col.id === lead.column)?.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Último Contato</h3>
                      <p className="mt-1 text-base">{lead.lastContact}</p>
                    </div>
                  </div>
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
                    {lead.comments.map(comment => (
                      <div key={comment.id} className="border rounded-md p-3">
                        <p className="text-sm">{comment.text}</p>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>{comment.author}</span>
                          <span>{comment.date}</span>
                        </div>
                      </div>
                    ))}
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
                      <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Calendar className="text-white h-3 w-3" />
                      </div>
                      <p className="font-medium">Reunião agendada</p>
                      <p className="text-sm text-gray-600">25/05/2025 às 14:30</p>
                      <p className="text-sm mt-1">Apresentação do produto para o cliente.</p>
                    </div>
                    
                    <div className="mb-8 relative">
                      <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <MessageSquare className="text-white h-3 w-3" />
                      </div>
                      <p className="font-medium">Contato por email</p>
                      <p className="text-sm text-gray-600">20/05/2025</p>
                      <p className="text-sm mt-1">Envio de proposta comercial.</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-11 mt-1.5 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <User className="text-white h-3 w-3" />
                      </div>
                      <p className="font-medium">Lead criado</p>
                      <p className="text-sm text-gray-600">15/05/2025</p>
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
                  <div className="space-y-2">
                    <div className="flex items-center p-3 border rounded-md">
                      <span className="flex-1">Proposta_Comercial.pdf</span>
                      <Button variant="ghost" size="sm">Ver</Button>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                    <div className="flex items-center p-3 border rounded-md">
                      <span className="flex-1">Contrato.docx</span>
                      <Button variant="ghost" size="sm">Ver</Button>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
