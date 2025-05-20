
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  TabsTriggerWithBadge
} from "@/components/ui/tabs";
import { Search, Users, Star, MessageCircle, FileText, History } from "lucide-react";

// Sample data for partners
const PARTNERS = [
  {
    id: 1,
    name: "Marketing Digital Pro",
    category: "Marketing Digital",
    type: "Agência",
    rating: 4.8,
    comments: 14,
    recommended: true,
    contacts: [
      { name: "Maria Silva", role: "Gerente de Contas", email: "maria@marketingpro.com", phone: "(11) 98765-4321" }
    ],
    description: "Agência especializada em marketing digital para e-commerce.",
    ratings: [
      { id: 1, user: "Ana Carolina", rating: 4, comment: "Ótima parceria, sempre disponíveis para ajudar.", likes: 3 },
      { id: 2, user: "Pedro Santos", rating: 5, comment: "Excelente atendimento e resultados.", likes: 1 }
    ],
    comments: [
      { id: 1, user: "Maria Oliveira", text: "Vocês poderiam compartilhar mais detalhes sobre os serviços deste parceiro?", date: "15/05/2025", likes: 3 },
      { id: 2, user: "Carlos Mendes", text: "Tive uma ótima experiência com eles no meu projeto de e-commerce.", date: "12/05/2025", likes: 2 }
    ],
    files: []
  },
  {
    id: 2,
    name: "Logística Express",
    category: "Logística",
    type: "Serviço",
    rating: 4.3,
    comments: 7,
    recommended: false,
    contacts: [
      { name: "João Oliveira", role: "Diretor Comercial", email: "joao@logisticaexpress.com", phone: "(11) 97654-3210" }
    ],
    description: "Empresa especializada em logística para e-commerce.",
    ratings: [
      { id: 1, user: "Carlos Silva", rating: 4, comment: "Entrega rápida e serviço de qualidade.", likes: 2 }
    ],
    comments: [
      { id: 1, user: "Amanda Costa", text: "Eles atendem entregas para todo o Brasil?", date: "08/05/2025", likes: 0 }
    ],
    files: []
  },
  {
    id: 3,
    name: "Contabilidade Online",
    category: "Contabilidade",
    type: "Consultor",
    rating: 4.6,
    comments: 9,
    recommended: true,
    contacts: [
      { name: "Ana Paula", role: "Contadora Chefe", email: "ana@contabilidadeonline.com", phone: "(11) 99876-5432" }
    ],
    description: "Serviços de contabilidade especializada para e-commerce.",
    ratings: [
      { id: 1, user: "Ricardo Martins", rating: 5, comment: "Profissionais excelentes, super recomendo!", likes: 4 }
    ],
    comments: [
      { id: 1, user: "Fernanda Lima", text: "Qual o valor médio da consultoria mensal?", date: "05/05/2025", likes: 1 }
    ],
    files: []
  },
];

const Partners = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("");
  const [recommendedFilter, setRecommendedFilter] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [ratingText, setRatingText] = useState("");
  const [commentText, setCommentText] = useState("");
  
  // Filter partners based on search query and filters
  const filteredPartners = PARTNERS.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = partnerTypeFilter === "" || partner.type === partnerTypeFilter;
    
    const matchesRecommended = recommendedFilter === "" || 
                              (recommendedFilter === "recommended" && partner.recommended) ||
                              (recommendedFilter === "not-recommended" && !partner.recommended);
    
    return matchesSearch && matchesType && matchesRecommended;
  });

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  // Handle like for a rating
  const handleLikeRating = (ratingId) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.map(rating => {
        if (rating.id === ratingId) {
          return { ...rating, likes: rating.likes + 1 };
        }
        return rating;
      });
      setSelectedPartner({...selectedPartner, ratings: updatedRatings});
    }
  };
  
  // Handle like for a comment
  const handleLikeComment = (commentId) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      });
      setSelectedPartner({...selectedPartner, comments: updatedComments});
    }
  };
  
  // Handle adding a new rating
  const handleAddRating = () => {
    if (selectedPartner && ratingText) {
      const newRating = {
        id: Date.now(),
        user: "Usuário",
        rating: 5,
        comment: ratingText,
        likes: 0
      };
      
      const updatedRatings = [...selectedPartner.ratings, newRating];
      setSelectedPartner({...selectedPartner, ratings: updatedRatings});
      setRatingText("");
    }
  };
  
  // Handle adding a new comment
  const handleAddComment = () => {
    if (selectedPartner && commentText) {
      const newComment = {
        id: Date.now(),
        user: "Usuário",
        text: commentText,
        date: new Date().toLocaleDateString(),
        likes: 0
      };
      
      const updatedComments = [...selectedPartner.comments, newComment];
      setSelectedPartner({...selectedPartner, comments: updatedComments});
      setCommentText("");
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Parceiros</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={partnerTypeFilter} onValueChange={setPartnerTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Parceiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Agência">Agência</SelectItem>
              <SelectItem value="Consultor">Consultor</SelectItem>
              <SelectItem value="Serviço">Serviço</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={recommendedFilter} onValueChange={setRecommendedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="recommended">Recomendados</SelectItem>
              <SelectItem value="not-recommended">Não Recomendados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum parceiro encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {partner.name}
                          {partner.recommended && (
                            <Badge className="bg-green-500">Recomendado</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{partner.category}</TableCell>
                      <TableCell>{partner.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{calculateAverageRating(partner.ratings)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPartner(partner)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Partner Detail Dialog */}
      {selectedPartner && (
        <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedPartner.name}</span>
                {selectedPartner.recommended && (
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
                    badgeCount={selectedPartner.contacts ? selectedPartner.contacts.length : 0}
                  >
                    Contatos
                  </TabsTriggerWithBadge>
                  <TabsTriggerWithBadge 
                    value="comments" 
                    badgeCount={selectedPartner.comments ? selectedPartner.comments.length : 0}
                  >
                    Comentários
                  </TabsTriggerWithBadge>
                  <TabsTriggerWithBadge 
                    value="ratings" 
                    badgeCount={selectedPartner.ratings ? selectedPartner.ratings.length : 0}
                  >
                    Avaliações
                  </TabsTriggerWithBadge>
                  <TabsTriggerWithBadge 
                    value="files" 
                    badgeCount={selectedPartner.files ? selectedPartner.files.length : 0}
                  >
                    Arquivos
                  </TabsTriggerWithBadge>
                </TabsList>
                
                {/* Details Tab */}
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                          <p className="mt-1 text-base">{selectedPartner.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
                          <p className="mt-1 text-base">{selectedPartner.category}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                          <p className="mt-1 text-base">{selectedPartner.type}</p>
                        </div>
                        <div className="col-span-3">
                          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                          <p className="mt-1 text-base">{selectedPartner.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Contacts Tab */}
                <TabsContent value="contacts">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Contatos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPartner.contacts && selectedPartner.contacts.length > 0 ? (
                        <div className="space-y-4">
                          {selectedPartner.contacts.map((contact, index) => (
                            <div key={index} className="border p-4 rounded-md">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                                  <p className="mt-1">{contact.name}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Cargo</h3>
                                  <p className="mt-1">{contact.role}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                  <p className="mt-1">{contact.email}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                                  <p className="mt-1">{contact.phone}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">Nenhum contato cadastrado.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Comments Tab */}
                <TabsContent value="comments">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Comentários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedPartner.comments && selectedPartner.comments.map((comment) => (
                          <div key={comment.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                <span className="font-medium">{comment.user}</span>
                              </div>
                              <span className="text-sm text-gray-500">{comment.date}</span>
                            </div>
                            <p className="mt-2 text-gray-700">{comment.text}</p>
                            <div className="mt-2 flex items-center">
                              <Button variant="ghost" size="sm" className="h-8 text-gray-500" onClick={() => handleLikeComment(comment.id)}>
                                <Star className="h-4 w-4 mr-1" />
                                {comment.likes} likes
                              </Button>
                            </div>
                          </div>
                        ))}

                        {(!selectedPartner.comments || selectedPartner.comments.length === 0) && (
                          <p className="text-center py-4 text-gray-500">
                            Nenhum comentário disponível.
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Adicionar comentário</h3>
                        <textarea 
                          className="w-full border rounded-md p-2 min-h-[100px]" 
                          placeholder="Digite seu comentário..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button className="mt-2" onClick={handleAddComment}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Enviar Comentário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Ratings Tab */}
                <TabsContent value="ratings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Avaliações</CardTitle>
                      <div>
                        Avaliação média: {calculateAverageRating(selectedPartner.ratings)}/5
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPartner.ratings && selectedPartner.ratings.map((rating) => (
                          <div key={rating.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Users className="h-5 w-5 mr-2" />
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
                            <div className="mt-2">
                              <Button variant="ghost" size="sm" onClick={() => handleLikeRating(rating.id)}>
                                <Star className="h-4 w-4 mr-1" />
                                {rating.likes} likes
                              </Button>
                            </div>
                          </div>
                        ))}

                        {(!selectedPartner.ratings || selectedPartner.ratings.length === 0) && (
                          <p className="text-center py-4 text-gray-500">
                            Nenhuma avaliação disponível.
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Adicionar avaliação</h3>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className="h-6 w-6 cursor-pointer text-yellow-400 fill-yellow-400" 
                            />
                          ))}
                        </div>
                        <textarea 
                          className="w-full border rounded-md p-2 min-h-[100px]" 
                          placeholder="Digite sua avaliação..."
                          value={ratingText}
                          onChange={(e) => setRatingText(e.target.value)}
                        />
                        <Button className="mt-2" onClick={handleAddRating}>
                          <Star className="mr-2 h-4 w-4" />
                          Enviar Avaliação
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Files Tab */}
                <TabsContent value="files">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Arquivos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPartner.files && selectedPartner.files.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedPartner.files.map((file, index) => (
                            <div key={index} className="border p-4 rounded-md flex items-center">
                              <FileText className="h-6 w-6 mr-2" />
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">{file.size}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <p className="text-center py-4 text-gray-500">
                            Nenhum arquivo disponível.
                          </p>
                          <div className="mt-4 flex justify-center">
                            <Button>
                              <FileText className="mr-2 h-4 w-4" />
                              Adicionar Arquivo
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Partners;
