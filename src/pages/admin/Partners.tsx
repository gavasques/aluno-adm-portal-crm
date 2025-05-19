
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Plus, Star, MessageSquare } from "lucide-react";

const Partners = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  // Mock data para parceiros
  const partners = [
    { 
      id: 1, 
      name: "Consultoria XYZ", 
      category: "Consultoria", 
      contact: "João Silva", 
      phone: "(11) 98765-4321", 
      email: "contato@consultoriaxyz.com", 
      address: "Av. Paulista, 1000 - São Paulo, SP", 
      description: "Consultoria especializada em comércio eletrônico e marketing digital.",
      website: "www.consultoriaxyz.com",
      ratings: [
        { id: 1, user: "Ana Carolina", rating: 4, comment: "Ótima parceria, sempre disponíveis para ajudar." },
        { id: 2, user: "Pedro Santos", rating: 5, comment: "Excelente atendimento e resultados." }
      ],
      comments: [
        { id: 1, user: "Maria Oliveira", text: "Vocês poderiam compartilhar mais detalhes sobre os serviços deste parceiro?", date: "15/05/2025", likes: 3 },
        { id: 2, user: "Carlos Mendes", text: "Tive uma ótima experiência com eles no meu projeto de e-commerce.", date: "12/05/2025", likes: 2, replies: [
          { id: 1, user: "Ana Silva", text: "Qual serviço você contratou com eles?", date: "13/05/2025" }
        ] }
      ]
    },
    { 
      id: 2, 
      name: "Marketing Digital Pro", 
      category: "Marketing", 
      contact: "Maria Oliveira", 
      phone: "(11) 91234-5678", 
      email: "contato@marketingdigitalpro.com", 
      address: "Rua Augusta, 500 - São Paulo, SP", 
      description: "Agência especializada em marketing digital para e-commerce.",
      website: "www.marketingdigitalpro.com",
      ratings: [
        { id: 1, user: "João Silva", rating: 5, comment: "Estratégias eficientes e resultados rápidos." },
        { id: 2, user: "Ana Carolina", rating: 4, comment: "Boa comunicação e entregas no prazo." }
      ],
      comments: [
        { id: 1, user: "Roberto Almeida", text: "Alguém já trabalhou com eles em campanhas para Facebook?", date: "10/05/2025", likes: 1 }
      ]
    },
    { 
      id: 3, 
      name: "Logística Express", 
      category: "Logística", 
      contact: "Carlos Mendes", 
      phone: "(11) 93333-4444", 
      email: "contato@logisticaexpress.com", 
      address: "Av. das Nações Unidas, 2000 - São Paulo, SP", 
      description: "Soluções logísticas completas para e-commerce.",
      website: "www.logisticaexpress.com",
      ratings: [
        { id: 1, user: "Pedro Santos", rating: 3, comment: "Bom serviço, mas prazos de entrega podem melhorar." }
      ],
      comments: [
        { id: 1, user: "Amanda Costa", text: "Eles atendem entregas para todo o Brasil?", date: "08/05/2025", likes: 0 }
      ]
    },
  ];
  
  const handleOpenPartner = (partner) => {
    setSelectedPartner(partner);
  };
  
  const handleClosePartner = () => {
    setSelectedPartner(null);
  };
  
  const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Parceiros</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Parceiro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Parceiro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Formulário seria implementado aqui */}
              <p>Formulário para adicionar um novo parceiro.</p>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
          <CardDescription>
            Gerencie os parceiros e seus dados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.category}</TableCell>
                    <TableCell>{partner.contact}</TableCell>
                    <TableCell>{partner.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{calculateAverageRating(partner.ratings)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenPartner(partner)}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para detalhes do parceiro */}
      {selectedPartner && (
        <Dialog open={!!selectedPartner} onOpenChange={handleClosePartner}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="mr-2" />
                {selectedPartner.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Dados do Parceiro</TabsTrigger>
                  <TabsTrigger value="ratings">Avaliações</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                          <p className="mt-1 text-base">{selectedPartner.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
                          <p className="mt-1 text-base">{selectedPartner.category}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Contato</h3>
                          <p className="mt-1 text-base">{selectedPartner.contact}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                          <p className="mt-1 text-base">{selectedPartner.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-base">{selectedPartner.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Website</h3>
                          <p className="mt-1 text-base">
                            <a href={`https://${selectedPartner.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedPartner.website}
                            </a>
                          </p>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
                          <p className="mt-1 text-base">{selectedPartner.address}</p>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                          <p className="mt-1 text-base">{selectedPartner.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ratings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Avaliações</CardTitle>
                      <CardDescription>
                        Avaliação média: {calculateAverageRating(selectedPartner.ratings)}/5
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPartner.ratings.map((rating) => (
                          <div key={rating.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                <span className="font-medium">{rating.user}</span>
                              </div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-2 text-gray-700">{rating.comment}</p>
                          </div>
                        ))}
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
                      <div className="space-y-6">
                        {selectedPartner.comments.map((comment) => (
                          <div key={comment.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                <span className="font-medium">{comment.user}</span>
                              </div>
                              <span className="text-sm text-gray-500">{comment.date}</span>
                            </div>
                            <p className="mt-2 text-gray-700">{comment.text}</p>
                            <div className="mt-2 flex items-center">
                              <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                                <Star className="h-4 w-4 mr-1" />
                                {comment.likes} likes
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Responder
                              </Button>
                            </div>
                            
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 pl-6 border-l-2 space-y-4">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="pt-2">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        <span className="font-medium text-sm">{reply.user}</span>
                                      </div>
                                      <span className="text-xs text-gray-500">{reply.date}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-700">{reply.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Adicionar comentário</h3>
                        <textarea 
                          className="w-full border rounded-md p-2 min-h-[100px]" 
                          placeholder="Digite seu comentário..."
                        />
                        <Button className="mt-2">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Enviar Comentário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClosePartner}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Partners;
