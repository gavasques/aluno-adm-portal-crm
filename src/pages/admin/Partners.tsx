
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsTriggerWithBadge } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, Plus, Star, MessageSquare, Search, Trash, FileText, History, MoreHorizontal, Users, Edit, Pencil } from "lucide-react";
import { toast } from "sonner";

const Partners = () => {
  // Mock data for partners
  const [partners, setPartners] = useState([
    { 
      id: 1, 
      name: "Consultoria XYZ", 
      category: "Consultoria", 
      type: "Agência",
      contact: "João Silva", 
      phone: "(11) 98765-4321", 
      email: "contato@consultoriaxyz.com", 
      address: "Av. Paulista, 1000 - São Paulo, SP", 
      description: "Consultoria especializada em comércio eletrônico e marketing digital.",
      website: "www.consultoriaxyz.com",
      recommended: true,
      ratings: [
        { id: 1, user: "Ana Carolina", rating: 4, comment: "Ótima parceria, sempre disponíveis para ajudar.", likes: 2 },
        { id: 2, user: "Pedro Santos", rating: 5, comment: "Excelente atendimento e resultados.", likes: 0 }
      ],
      comments: [
        { id: 1, user: "Maria Oliveira", text: "Vocês poderiam compartilhar mais detalhes sobre os serviços deste parceiro?", date: "15/05/2025", likes: 3 },
        { id: 2, user: "Carlos Mendes", text: "Tive uma ótima experiência com eles no meu projeto de e-commerce.", date: "12/05/2025", likes: 2, replies: [
          { id: 1, user: "Ana Silva", text: "Qual serviço você contratou com eles?", date: "13/05/2025" }
        ] }
      ],
      contacts: [
        { id: 1, name: "João Silva", role: "Gerente de Contas", email: "joao@consultoriaxyz.com", phone: "(11) 98765-4321" },
        { id: 2, name: "Maria Oliveira", role: "Diretora de Projetos", email: "maria@consultoriaxyz.com", phone: "(11) 91234-5678" }
      ],
      files: [],
      history: [
        { id: 1, action: "Parceiro adicionado", user: "Admin", date: "10/05/2025" },
        { id: 2, action: "Marcado como recomendado", user: "Admin", date: "11/05/2025" },
        { id: 3, action: "Contato adicionado: João Silva", user: "Admin", date: "12/05/2025" }
      ]
    },
    { 
      id: 2, 
      name: "Marketing Digital Pro", 
      category: "Marketing", 
      type: "Consultor",
      contact: "Maria Oliveira", 
      phone: "(11) 91234-5678", 
      email: "contato@marketingdigitalpro.com", 
      address: "Rua Augusta, 500 - São Paulo, SP", 
      description: "Agência especializada em marketing digital para e-commerce.",
      website: "www.marketingdigitalpro.com",
      recommended: false,
      ratings: [
        { id: 1, user: "João Silva", rating: 5, comment: "Estratégias eficientes e resultados rápidos.", likes: 1 },
        { id: 2, user: "Ana Carolina", rating: 4, comment: "Boa comunicação e entregas no prazo.", likes: 0 }
      ],
      comments: [
        { id: 1, user: "Roberto Almeida", text: "Alguém já trabalhou com eles em campanhas para Facebook?", date: "10/05/2025", likes: 1 }
      ],
      contacts: [
        { id: 1, name: "Maria Oliveira", role: "Diretora", email: "maria@marketingpro.com", phone: "(11) 91234-5678" }
      ],
      files: [
        { id: 1, name: "Apresentação.pdf", size: "2.5 MB", uploadedBy: "Admin", date: "15/05/2025" }
      ],
      history: [
        { id: 1, action: "Parceiro adicionado", user: "Admin", date: "05/05/2025" },
        { id: 2, action: "Arquivo adicionado: Apresentação.pdf", user: "Admin", date: "15/05/2025" }
      ]
    },
    { 
      id: 3, 
      name: "Logística Express", 
      category: "Logística", 
      type: "Serviço",
      contact: "Carlos Mendes", 
      phone: "(11) 93333-4444", 
      email: "contato@logisticaexpress.com", 
      address: "Av. das Nações Unidas, 2000 - São Paulo, SP", 
      description: "Soluções logísticas completas para e-commerce.",
      website: "www.logisticaexpress.com",
      recommended: true,
      ratings: [
        { id: 1, user: "Pedro Santos", rating: 3, comment: "Bom serviço, mas prazos de entrega podem melhorar.", likes: 0 }
      ],
      comments: [
        { id: 1, user: "Amanda Costa", text: "Eles atendem entregas para todo o Brasil?", date: "08/05/2025", likes: 0 }
      ],
      contacts: [
        { id: 1, name: "Carlos Mendes", role: "Executivo de Contas", email: "carlos@logisticaexpress.com", phone: "(11) 93333-4444" }
      ],
      files: [],
      history: [
        { id: 1, action: "Parceiro adicionado", user: "Admin", date: "01/05/2025" },
        { id: 2, action: "Marcado como recomendado", user: "Admin", date: "02/05/2025" }
      ]
    },
  ]);
  
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("all");
  const [recommendedFilter, setRecommendedFilter] = useState("all");
  const [newContactName, setNewContactName] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [commentText, setCommentText] = useState("");
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingText, setRatingText] = useState("");
  
  // Filter partners
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = partnerTypeFilter === "all" || partner.type === partnerTypeFilter;
    
    const matchesRecommended = recommendedFilter === "all" || 
                             (recommendedFilter === "recommended" && partner.recommended) ||
                             (recommendedFilter === "not-recommended" && !partner.recommended);
    
    return matchesSearch && matchesType && matchesRecommended;
  });
  
  // Helper functions
  const handleOpenPartner = (partner) => {
    setSelectedPartner(partner);
  };
  
  const handleClosePartner = () => {
    setSelectedPartner(null);
  };
  
  const calculateAverageRating = (ratings) => {
    if (!ratings || !ratings.length) return 0;
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  const handleDeletePartner = (id) => {
    setPartners(partners.filter(partner => partner.id !== id));
    setSelectedPartner(null);
    toast.success("Parceiro excluído com sucesso!");
  };

  const handleEditPartner = (partner) => {
    setEditingPartner({...partner});
  };

  const handleSavePartner = () => {
    if (editingPartner) {
      // Adicionar registro ao histórico
      const updatedHistory = [...(editingPartner.history || []), {
        id: Date.now(),
        action: "Parceiro editado",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];

      const updatedPartner = {
        ...editingPartner,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === editingPartner.id ? updatedPartner : p));
      
      // Se o parceiro editado for o selecionado, atualize a visualização
      if (selectedPartner && selectedPartner.id === editingPartner.id) {
        setSelectedPartner(updatedPartner);
      }
      
      setEditingPartner(null);
      toast.success("Parceiro atualizado com sucesso!");
    }
  };

  const handleAddContact = () => {
    if (selectedPartner && newContactName && newContactEmail) {
      const newContact = {
        id: Date.now(),
        name: newContactName,
        role: newContactRole,
        email: newContactEmail,
        phone: newContactPhone
      };
      
      const updatedContacts = [...(selectedPartner.contacts || []), newContact];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: `Contato adicionado: ${newContactName}`,
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        contacts: updatedContacts,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      
      // Reset form
      setNewContactName("");
      setNewContactRole("");
      setNewContactEmail("");
      setNewContactPhone("");
      toast.success("Contato adicionado com sucesso!");
    }
  };
  
  const handleDeleteContact = (contactId) => {
    if (selectedPartner) {
      const contactToDelete = selectedPartner.contacts.find(c => c.id === contactId);
      const updatedContacts = selectedPartner.contacts.filter(c => c.id !== contactId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: `Contato removido: ${contactToDelete?.name || 'Desconhecido'}`,
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        contacts: updatedContacts,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      toast.success("Contato removido com sucesso!");
    }
  };
  
  const handleAddComment = () => {
    if (selectedPartner && commentText) {
      const newComment = {
        id: Date.now(),
        user: "Admin",
        text: commentText,
        date: new Date().toLocaleDateString(),
        likes: 0
      };
      
      const updatedComments = [...(selectedPartner.comments || []), newComment];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Comentário adicionado",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      setCommentText("");
      toast.success("Comentário adicionado com sucesso!");
    }
  };
  
  const handleLikeComment = (commentId) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      });
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
    }
  };

  const handleDeleteComment = (commentId) => {
    if (selectedPartner) {
      const updatedComments = selectedPartner.comments.filter(comment => comment.id !== commentId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Comentário removido",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        comments: updatedComments,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      toast.success("Comentário removido com sucesso!");
    }
  };
  
  const handleAddRating = () => {
    if (selectedPartner && ratingText) {
      const newRating = {
        id: Date.now(),
        user: "Admin",
        rating: ratingValue,
        comment: ratingText,
        likes: 0
      };
      
      const updatedRatings = [...(selectedPartner.ratings || []), newRating];
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Avaliação adicionada",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      setRatingText("");
      setRatingValue(5);
      toast.success("Avaliação adicionada com sucesso!");
    }
  };
  
  const handleLikeRating = (ratingId) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.map(rating => {
        if (rating.id === ratingId) {
          return { ...rating, likes: rating.likes + 1 };
        }
        return rating;
      });
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
    }
  };

  const handleDeleteRating = (ratingId) => {
    if (selectedPartner) {
      const updatedRatings = selectedPartner.ratings.filter(rating => rating.id !== ratingId);
      const updatedHistory = [...(selectedPartner.history || []), {
        id: Date.now(),
        action: "Avaliação removida",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...selectedPartner,
        ratings: updatedRatings,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === selectedPartner.id ? updatedPartner : p));
      setSelectedPartner(updatedPartner);
      toast.success("Avaliação removida com sucesso!");
    }
  };
  
  const toggleRecommendedStatus = (partnerId) => {
    const partnerToUpdate = partners.find(p => p.id === partnerId);
    if (partnerToUpdate) {
      const isRecommended = !partnerToUpdate.recommended;
      
      const updatedHistory = [...(partnerToUpdate.history || []), {
        id: Date.now(),
        action: isRecommended ? "Marcado como recomendado" : "Desmarcado como recomendado",
        user: "Admin",
        date: new Date().toLocaleDateString()
      }];
      
      const updatedPartner = {
        ...partnerToUpdate,
        recommended: isRecommended,
        history: updatedHistory
      };
      
      setPartners(partners.map(p => p.id === partnerId ? updatedPartner : p));
      
      if (selectedPartner && selectedPartner.id === partnerId) {
        setSelectedPartner(updatedPartner);
      }
    }
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
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
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
              <SelectValue placeholder="Filtro: Tipo de Parceiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Agência">Agência</SelectItem>
              <SelectItem value="Consultor">Consultor</SelectItem>
              <SelectItem value="Serviço">Serviço</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={recommendedFilter} onValueChange={setRecommendedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtro: Recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Recomendações</SelectItem>
              <SelectItem value="recommended">Recomendados</SelectItem>
              <SelectItem value="not-recommended">Não Recomendados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
          <CardDescription>
            Gerencie os parceiros disponíveis no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contato Principal</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum parceiro encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {partner.name}
                          {partner.recommended && (
                            <Badge className="bg-green-500">Recomendado</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{partner.category}</TableCell>
                      <TableCell>{partner.type}</TableCell>
                      <TableCell>{partner.contact}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{calculateAverageRating(partner.ratings)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenPartner(partner)}
                          >
                            Ver Detalhes
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleEditPartner(partner)}
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Editar parceiro
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                onClick={() => toggleRecommendedStatus(partner.id)}
                              >
                                {partner.recommended ? "Remover recomendação" : "Marcar como recomendado"}
                              </DropdownMenuItem>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <span className="text-red-500 flex items-center">
                                      <Trash className="h-4 w-4 mr-2" /> Excluir parceiro
                                    </span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o parceiro "{partner.name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeletePartner(partner.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Partner Edit Dialog */}
      {editingPartner && (
        <Dialog open={!!editingPartner} onOpenChange={() => setEditingPartner(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Parceiro</DialogTitle>
              <DialogDescription>
                Atualize as informações do parceiro. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input 
                    value={editingPartner.name} 
                    onChange={(e) => setEditingPartner({...editingPartner, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <Input 
                    value={editingPartner.category} 
                    onChange={(e) => setEditingPartner({...editingPartner, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <Select 
                    value={editingPartner.type} 
                    onValueChange={(value) => setEditingPartner({...editingPartner, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agência">Agência</SelectItem>
                      <SelectItem value="Consultor">Consultor</SelectItem>
                      <SelectItem value="Serviço">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contato Principal</label>
                  <Input 
                    value={editingPartner.contact} 
                    onChange={(e) => setEditingPartner({...editingPartner, contact: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input 
                    value={editingPartner.email} 
                    onChange={(e) => setEditingPartner({...editingPartner, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <Input 
                    value={editingPartner.phone} 
                    onChange={(e) => setEditingPartner({...editingPartner, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <Input 
                    value={editingPartner.website} 
                    onChange={(e) => setEditingPartner({...editingPartner, website: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recomendado</label>
                  <div className="flex items-center mt-2">
                    <input 
                      type="checkbox"
                      checked={editingPartner.recommended}
                      onChange={(e) => setEditingPartner({...editingPartner, recommended: e.target.checked})}
                      className="mr-2"
                    />
                    <span>Marcar como recomendado</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <Input 
                    value={editingPartner.address} 
                    onChange={(e) => setEditingPartner({...editingPartner, address: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                    value={editingPartner.description} 
                    onChange={(e) => setEditingPartner({...editingPartner, description: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPartner(null)}>Cancelar</Button>
              <Button onClick={handleSavePartner}>Salvar alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Partner Detail Dialog */}
      {selectedPartner && (
        <Dialog open={!!selectedPartner} onOpenChange={handleClosePartner}>
          <DialogContent className="max-w-5xl">
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
                  <TabsTrigger value="details">Dados do Parceiro</TabsTrigger>
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
                  <TabsTriggerWithBadge 
                    value="history" 
                    badgeCount={selectedPartner.history ? selectedPartner.history.length : 0}
                  >
                    Histórico
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
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-base">{selectedPartner.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                          <p className="mt-1 text-base">{selectedPartner.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Website</h3>
                          <p className="mt-1 text-base">
                            <a href={`https://${selectedPartner.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedPartner.website}
                            </a>
                          </p>
                        </div>
                        <div className="col-span-3">
                          <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
                          <p className="mt-1 text-base">{selectedPartner.address}</p>
                        </div>
                        <div className="col-span-3">
                          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                          <p className="mt-1 text-base">{selectedPartner.description}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleEditPartner(selectedPartner)}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Editar Parceiro
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Contacts Tab */}
                <TabsContent value="contacts">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex justify-between items-center">
                        <span>Contatos</span>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedPartner.contacts && selectedPartner.contacts.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nome</TableHead>
                                  <TableHead>Cargo</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Telefone</TableHead>
                                  <TableHead>Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedPartner.contacts.map((contact) => (
                                  <TableRow key={contact.id}>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell>{contact.role}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.phone}</TableCell>
                                    <TableCell>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Trash className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja excluir o contato "{contact.name}"? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction 
                                              onClick={() => handleDeleteContact(contact.id)}
                                              className="bg-red-500 hover:bg-red-600"
                                            >
                                              Excluir
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-4 text-gray-500">
                            Nenhum contato cadastrado.
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-6 p-4 border rounded-md">
                        <h3 className="font-medium mb-4">Adicionar Novo Contato</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <Input 
                              value={newContactName} 
                              onChange={(e) => setNewContactName(e.target.value)} 
                              placeholder="Nome do contato" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                            <Input 
                              value={newContactRole} 
                              onChange={(e) => setNewContactRole(e.target.value)} 
                              placeholder="Cargo do contato" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input 
                              value={newContactEmail} 
                              onChange={(e) => setNewContactEmail(e.target.value)} 
                              placeholder="Email do contato" 
                              type="email" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                            <Input 
                              value={newContactPhone} 
                              onChange={(e) => setNewContactPhone(e.target.value)} 
                              placeholder="Telefone do contato" 
                            />
                          </div>
                        </div>
                        <Button className="mt-4" onClick={handleAddContact}>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Contato
                        </Button>
                      </div>
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
                              <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Responder
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 text-red-500">
                                    <Trash className="h-4 w-4 mr-1" />
                                    Excluir
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteComment(comment.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 pl-6 border-l-2 space-y-4">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="pt-2">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
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
                          <MessageSquare className="mr-2 h-4 w-4" />
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
                      <CardDescription>
                        Avaliação média: {calculateAverageRating(selectedPartner.ratings)}/5
                      </CardDescription>
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
                            <div className="mt-2 flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleLikeRating(rating.id)}>
                                <Star className="h-4 w-4 mr-1" />
                                {rating.likes} likes
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-500">
                                    <Trash className="h-4 w-4 mr-1" />
                                    Excluir
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteRating(rating.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}

                        {(!selectedPartner.ratings || selectedPartner.ratings.length === 0) && (
                          <p className="text-center py-4 text-gray-500">
                            Nenhuma avaliação disponível.
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-6 p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Adicionar avaliação</h3>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingValue(star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                className={`h-6 w-6 cursor-pointer ${star <= ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            </button>
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
                      <CardTitle className="text-xl flex justify-between items-center">
                        <span>Arquivos</span>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Arquivo
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPartner.files && selectedPartner.files.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Adicionado por</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedPartner.files.map((file) => (
                                <TableRow key={file.id}>
                                  <TableCell className="font-medium flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    {file.name}
                                  </TableCell>
                                  <TableCell>{file.size}</TableCell>
                                  <TableCell>{file.uploadedBy}</TableCell>
                                  <TableCell>{file.date}</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm">
                                        Ver
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Trash className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja excluir o arquivo "{file.name}"? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                              Excluir
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-center mb-4 text-gray-500">
                            Nenhum arquivo disponível.
                          </p>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Arquivo
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* History Tab (Admin only) */}
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Histórico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPartner.history && selectedPartner.history.length > 0 ? (
                        <div className="space-y-4">
                          {selectedPartner.history.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-3">
                              <div>
                                <div className="font-medium">{item.action}</div>
                                <div className="text-sm text-gray-500">Por: {item.user}</div>
                              </div>
                              <div className="text-sm text-gray-500">{item.date}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">
                          Nenhum histórico disponível.
                        </p>
                      )}
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
