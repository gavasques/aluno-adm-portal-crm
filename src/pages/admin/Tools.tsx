
import React, { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings, Plus, Star, MessageSquare, ExternalLink, Search, Trash2, Filter, ArrowDown, ArrowUp, ThumbsUp, FileText, Image, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [softwareTypeFilter, setSoftwareTypeFilter] = useState("all");
  const [recommendationFilter, setRecommendationFilter] = useState("all");
  const [newComment, setNewComment] = useState("");
  
  // Mock data para ferramentas
  const [tools, setTools] = useState([
    { 
      id: 1, 
      name: "E-commerce Builder Pro", 
      category: "Plataforma", 
      provider: "Tech Solutions Inc.", 
      price: "R$ 199,90/mês",
      website: "www.ecombuilder.com",
      phone: "(11) 9999-8888",
      email: "contato@ecombuilder.com",
      status: "Ativo",
      coupons: "DESCONTO10 - 10% de desconto\nPROMO2025 - 3 meses grátis",
      recommended: true,
      notRecommended: false,
      description: "Plataforma completa para criação e gerenciamento de lojas virtuais.",
      features: [
        "Criação de loja sem conhecimento técnico",
        "Integração com marketplaces",
        "Painel administrativo intuitivo",
        "Relatórios detalhados de vendas",
        "Automação de marketing"
      ],
      contacts: [
        { id: 1, name: "João Silva", role: "Gestor de Contas", email: "joao@ecombuilder.com", phone: "(11) 97777-6666", notes: "Disponível para suporte técnico." },
        { id: 2, name: "Maria Oliveira", role: "Suporte", email: "maria@ecombuilder.com", phone: "(11) 96666-5555", notes: "Especialista em implementação." }
      ],
      ratings: [
        { id: 1, user: "João Silva", rating: 4, comment: "Muito boa plataforma, fácil de usar e com muitos recursos.", date: "15/05/2025", likes: 2 },
        { id: 2, user: "Maria Oliveira", rating: 5, comment: "Excelente ferramenta para iniciantes.", date: "10/05/2025", likes: 1 }
      ],
      comments: [
        { id: 1, user: "Carlos Mendes", text: "Vocês recomendam essa ferramenta para uma loja média com cerca de 500 produtos?", date: "15/05/2025", likes: 2, replies: [
          { id: 101, user: "Ana Costa", text: "Sim, utilizamos para uma loja com 600 produtos e funciona muito bem!", date: "16/05/2025", likes: 1 }
        ]},
        { id: 2, user: "Ana Carolina", text: "Alguém sabe se tem integração com o ERP XYZ?", date: "10/05/2025", likes: 1, replies: [] }
      ],
      files: [
        { id: 1, name: "Manual do Usuário.pdf", type: "application/pdf", size: "2.5 MB", date: "05/04/2025" },
        { id: 2, name: "Guia de Integração.pdf", type: "application/pdf", size: "1.8 MB", date: "02/04/2025" }
      ],
      images: [
        { id: 1, url: "https://placehold.co/600x400?text=Dashboard+Plataforma", alt: "Dashboard da Plataforma" },
        { id: 2, url: "https://placehold.co/600x400?text=Interface+Admin", alt: "Interface de Administração" }
      ],
      history: [
        { id: 1, user: "Admin", action: "Criou a ferramenta", date: "01/04/2025 14:30" },
        { id: 2, user: "João Silva", action: "Adicionou avaliação", date: "15/05/2025 10:15" },
        { id: 3, user: "Carlos Mendes", action: "Adicionou comentário", date: "15/05/2025 16:45" },
        { id: 4, user: "Admin", action: "Atualizou informações", date: "20/05/2025 09:00" },
      ]
    },
    { 
      id: 2, 
      name: "Marketing Automation", 
      category: "Marketing", 
      provider: "Digital Growth", 
      price: "R$ 149,00/mês",
      website: "www.marketingauto.com",
      phone: "(11) 8888-7777",
      email: "contato@marketingauto.com",
      status: "Ativo",
      coupons: "WELCOME20 - 20% de desconto no primeiro mês",
      recommended: false,
      notRecommended: true,
      description: "Ferramenta de automação de marketing para e-commerce.",
      features: [
        "Email marketing automatizado",
        "Segmentação avançada de clientes",
        "Campanhas personalizadas",
        "Recuperação de carrinhos abandonados",
        "Métricas de desempenho em tempo real"
      ],
      contacts: [
        { id: 1, name: "Ricardo Almeida", role: "Suporte Técnico", email: "ricardo@marketingauto.com", phone: "(11) 95555-4444", notes: "Especialista em integrações." }
      ],
      ratings: [
        { id: 1, user: "Pedro Santos", rating: 4, comment: "Ótimas funcionalidades de segmentação de clientes.", date: "08/05/2025", likes: 0 },
        { id: 2, user: "Amanda Costa", rating: 3, comment: "Boa ferramenta, mas poderia ter melhor interface.", date: "05/05/2025", likes: 1 }
      ],
      comments: [
        { id: 1, user: "Roberto Almeida", text: "É possível integrar com a plataforma de e-commerce XPTO?", date: "08/05/2025", likes: 0, replies: [] }
      ],
      files: [
        { id: 1, name: "Comparativo de Planos.pdf", type: "application/pdf", size: "1.2 MB", date: "15/03/2025" }
      ],
      images: [
        { id: 1, url: "https://placehold.co/600x400?text=Interface+Marketing", alt: "Interface de Marketing" }
      ],
      history: [
        { id: 1, user: "Admin", action: "Criou a ferramenta", date: "15/03/2025 11:20" },
        { id: 2, user: "Pedro Santos", action: "Adicionou avaliação", date: "08/05/2025 14:30" },
        { id: 3, user: "Admin", action: "Alterou status para 'Não Recomendado'", date: "10/05/2025 16:00" },
      ]
    },
    { 
      id: 3, 
      name: "Logistic Manager", 
      category: "Logística", 
      provider: "Supply Solutions", 
      price: "R$ 299,00/mês",
      website: "www.logisticmanager.com",
      phone: "(11) 7777-6666",
      email: "contato@logisticmanager.com",
      status: "Ativo",
      coupons: "FRETE10 - 10% de desconto em planos anuais",
      recommended: true,
      notRecommended: false,
      description: "Sistema completo para gestão logística de e-commerce.",
      features: [
        "Gestão de estoque em tempo real",
        "Integração com transportadoras",
        "Cálculo automático de frete",
        "Rastreamento de pedidos",
        "Gestão de notas fiscais"
      ],
      contacts: [
        { id: 1, name: "Ana Silva", role: "Consultora", email: "ana@logisticmanager.com", phone: "(11) 94444-3333", notes: "Especialista em implementação." },
        { id: 2, name: "Carlos Oliveira", role: "Gestor de Contas", email: "carlos@logisticmanager.com", phone: "(11) 93333-2222", notes: "Responsável por grandes contas." }
      ],
      ratings: [
        { id: 1, user: "Ana Silva", rating: 5, comment: "Transformou a logística da minha loja. Recomendo!", date: "05/05/2025", likes: 1 },
        { id: 2, user: "Carlos Oliveira", rating: 4, comment: "Excelente para gerenciar múltiplos centros de distribuição.", date: "03/05/2025", likes: 0 }
      ],
      comments: [
        { id: 1, user: "Marina Costa", text: "Funciona bem com pequenas empresas?", date: "05/05/2025", likes: 1, replies: [] }
      ],
      files: [
        { id: 1, name: "Manual Completo.pdf", type: "application/pdf", size: "3.5 MB", date: "20/03/2025" },
        { id: 2, name: "Guia de Integração.pdf", type: "application/pdf", size: "2.1 MB", date: "15/03/2025" }
      ],
      images: [
        { id: 1, url: "https://placehold.co/600x400?text=Dashboard+Logística", alt: "Dashboard de Logística" },
        { id: 2, url: "https://placehold.co/600x400?text=Mapa+de+Entregas", alt: "Mapa de Entregas" }
      ],
      history: [
        { id: 1, user: "Admin", action: "Criou a ferramenta", date: "10/03/2025 09:45" },
        { id: 2, user: "Ana Silva", action: "Adicionou avaliação", date: "05/05/2025 11:30" },
        { id: 3, user: "Admin", action: "Adicionou novos arquivos", date: "12/05/2025 14:15" },
      ]
    },
  ]);
  
  const handleOpenTool = (tool) => {
    setSelectedTool(tool);
  };
  
  const handleCloseTool = () => {
    setSelectedTool(null);
    setNewComment("");
  };
  
  const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  };
  
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleDeleteTool = (id) => {
    setTools(tools.filter(tool => tool.id !== id));
    toast.success("Ferramenta excluída com sucesso!");
  };

  const handleDeleteRating = (toolId, ratingId) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        return {
          ...tool,
          ratings: tool.ratings.filter(rating => rating.id !== ratingId)
        };
      }
      return tool;
    }));

    if (selectedTool && selectedTool.id === toolId) {
      setSelectedTool({
        ...selectedTool,
        ratings: selectedTool.ratings.filter(rating => rating.id !== ratingId)
      });
    }

    toast.success("Avaliação excluída com sucesso!");
  };

  const handleDeleteComment = (toolId, commentId) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        return {
          ...tool,
          comments: tool.comments.filter(comment => comment.id !== commentId)
        };
      }
      return tool;
    }));

    if (selectedTool && selectedTool.id === toolId) {
      setSelectedTool({
        ...selectedTool,
        comments: selectedTool.comments.filter(comment => comment.id !== commentId)
      });
    }

    toast.success("Comentário excluído com sucesso!");
  };
  
  const handleDeleteCommentReply = (toolId, commentId, replyId) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        return {
          ...tool,
          comments: tool.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== replyId)
              };
            }
            return comment;
          })
        };
      }
      return tool;
    }));

    if (selectedTool && selectedTool.id === toolId) {
      setSelectedTool({
        ...selectedTool,
        comments: selectedTool.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== replyId)
            };
          }
          return comment;
        })
      });
    }

    toast.success("Resposta excluída com sucesso!");
  };

  const handleDeleteContact = (toolId, contactId) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        return {
          ...tool,
          contacts: tool.contacts.filter(contact => contact.id !== contactId)
        };
      }
      return tool;
    }));

    if (selectedTool && selectedTool.id === toolId) {
      setSelectedTool({
        ...selectedTool,
        contacts: selectedTool.contacts.filter(contact => contact.id !== contactId)
      });
    }

    toast.success("Contato excluído com sucesso!");
  };

  const handleDeleteFile = (toolId, fileId) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        return {
          ...tool,
          files: tool.files.filter(file => file.id !== fileId)
        };
      }
      return tool;
    }));

    if (selectedTool && selectedTool.id === toolId) {
      setSelectedTool({
        ...selectedTool,
        files: selectedTool.files.filter(file => file.id !== fileId)
      });
    }

    toast.success("Arquivo excluído com sucesso!");
  };

  const handleDeleteImage = (toolId, imageId) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        return {
          ...tool,
          images: tool.images.filter(image => image.id !== imageId)
        };
      }
      return tool;
    }));

    if (selectedTool && selectedTool.id === toolId) {
      setSelectedTool({
        ...selectedTool,
        images: selectedTool.images.filter(image => image.id !== imageId)
      });
    }

    toast.success("Imagem excluída com sucesso!");
  };
  
  const handleAddComment = () => {
    if (newComment.trim() === "") {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    toast.success("Comentário adicionado com sucesso!");
    setNewComment("");
  };

  const filteredTools = useMemo(() => {
    return tools
      .filter(tool => {
        // Filtro de pesquisa
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.provider.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filtro por tipo
        const matchesType = softwareTypeFilter === "all" || tool.category === softwareTypeFilter;
        
        // Filtro por recomendação
        const matchesRecommendation = 
          recommendationFilter === "all" || 
          (recommendationFilter === "recommended" && tool.recommended) ||
          (recommendationFilter === "not-recommended" && tool.notRecommended);
        
        return matchesSearch && matchesType && matchesRecommendation;
      })
      .sort((a, b) => {
        let valA, valB;
        
        switch (sortField) {
          case "name":
            valA = a.name;
            valB = b.name;
            break;
          case "category":
            valA = a.category;
            valB = b.category;
            break;
          case "provider":
            valA = a.provider;
            valB = b.provider;
            break;
          case "rating":
            valA = calculateAverageRating(a.ratings);
            valB = calculateAverageRating(b.ratings);
            break;
          default:
            valA = a.name;
            valB = b.name;
        }
        
        if (sortDirection === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [tools, searchQuery, sortField, sortDirection, softwareTypeFilter, recommendationFilter]);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Ferramentas</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Ferramenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Ferramenta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Formulário seria implementado aqui */}
              <p>Formulário para adicionar uma nova ferramenta.</p>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Ferramentas</CardTitle>
          <CardDescription>
            Gerencie as ferramentas disponíveis para e-commerce.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar ferramentas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={softwareTypeFilter} onValueChange={setSoftwareTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Ferramenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Plataforma">Plataforma</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Recomendação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="recommended">Ferramentas Recomendadas</SelectItem>
                  <SelectItem value="not-recommended">Não Recomendadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    Nome
                    {sortField === "name" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    Categoria
                    {sortField === "category" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("provider")}>
                    Fornecedor
                    {sortField === "provider" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("rating")}>
                    Avaliação
                    {sortField === "rating" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">
                      {tool.name}
                      <div className="flex gap-2 mt-1">
                        {tool.recommended && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Recomendada
                          </Badge>
                        )}
                        {tool.notRecommended && (
                          <Badge variant="destructive">
                            Não Recomendado (Corre)
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{tool.provider}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {tool.price}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{calculateAverageRating(tool.ratings)}</span>
                        <span className="text-gray-400 ml-1">({tool.ratings.length})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenTool(tool)}>
                          Ver Detalhes
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Ferramenta</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a ferramenta "{tool.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteTool(tool.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTools.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhuma ferramenta encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para detalhes da ferramenta */}
      {selectedTool && (
        <Dialog open={!!selectedTool} onOpenChange={handleCloseTool}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Settings className="mr-2" />
                {selectedTool.name}
                <div className="flex gap-2 ml-4">
                  {selectedTool.recommended && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Recomendada
                    </Badge>
                  )}
                  {selectedTool.notRecommended && (
                    <Badge variant="destructive">
                      Não Recomendado (Corre)
                    </Badge>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Dados da Ferramenta</TabsTrigger>
                  <TabsTrigger value="contacts">Contatos</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                  <TabsTrigger value="ratings">Avaliações</TabsTrigger>
                  <TabsTrigger value="files">Arquivos</TabsTrigger>
                  <TabsTrigger value="images">Imagens</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                          <p className="mt-1 text-base">{selectedTool.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
                          <p className="mt-1 text-base">{selectedTool.category}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Fornecedor</h3>
                          <p className="mt-1 text-base">{selectedTool.provider}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Preço</h3>
                          <p className="mt-1 text-base">{selectedTool.price}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Website</h3>
                          <a href={`https://${selectedTool.website}`} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="mt-1 text-base flex items-center text-blue-600 hover:underline">
                            {selectedTool.website}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                          <p className="mt-1 text-base">{selectedTool.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-base">{selectedTool.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Status</h3>
                          <p className="mt-1 text-base">{selectedTool.status}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Avaliação</h3>
                          <div className="mt-1 flex items-center">
                            <span className="mr-2">{calculateAverageRating(selectedTool.ratings)}/5</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${
                                    star <= Math.round(calculateAverageRating(selectedTool.ratings)) 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                          <p className="mt-1 text-base">{selectedTool.description}</p>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Cupons e Descontos</h3>
                          <pre className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">{selectedTool.coupons}</pre>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Funcionalidades</h3>
                          <ul className="mt-1 list-disc pl-5">
                            {selectedTool.features.map((feature, index) => (
                              <li key={index} className="text-base">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <Button variant="outline">Editar Dados</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contacts">
                  <Card>
                    <CardContent className="py-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Contatos</h3>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Adicionar Contato
                        </Button>
                      </div>
                      
                      {selectedTool.contacts && selectedTool.contacts.length > 0 ? (
                        <div className="space-y-4">
                          {selectedTool.contacts.map((contact) => (
                            <div key={contact.id} className="border p-4 rounded-md">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-lg">{contact.name}</h4>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500 h-8">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir o contato {contact.name}? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteContact(selectedTool.id, contact.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div>
                                  <p className="text-sm text-gray-500">Função</p>
                                  <p>{contact.role}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p>{contact.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Telefone</p>
                                  <p>{contact.phone}</p>
                                </div>
                              </div>
                              {contact.notes && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">Observações</p>
                                  <p className="text-sm mt-1">{contact.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          Nenhum contato cadastrado.
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
                      {selectedTool.comments && selectedTool.comments.length > 0 ? (
                        <div className="space-y-6 mb-6">
                          {selectedTool.comments.map((comment) => (
                            <div key={comment.id} className="border rounded-lg p-4">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                    {comment.user.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{comment.user}</p>
                                    <p className="text-sm text-gray-500">{comment.date}</p>
                                  </div>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500 h-8">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Comentário</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteComment(selectedTool.id, comment.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                              <p className="mt-3">{comment.text}</p>
                              <div className="mt-3 flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="text-gray-500">
                                  <ThumbsUp className="h-4 w-4 mr-1" /> {comment.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500">
                                  <MessageSquare className="h-4 w-4 mr-1" /> Responder
                                </Button>
                              </div>
                              
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 ml-8 space-y-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="border-l-2 pl-4">
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                            {reply.user.charAt(0)}
                                          </div>
                                          <div>
                                            <p className="font-medium">{reply.user}</p>
                                            <p className="text-xs text-gray-500">{reply.date}</p>
                                          </div>
                                        </div>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-500 h-6">
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Excluir Resposta</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Tem certeza que deseja excluir esta resposta? Esta ação não pode ser desfeita.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                              <AlertDialogAction 
                                                onClick={() => handleDeleteCommentReply(selectedTool.id, comment.id, reply.id)}
                                                className="bg-red-500 hover:bg-red-600"
                                              >
                                                Excluir
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                      <p className="mt-2 text-sm">{reply.text}</p>
                                      <Button variant="ghost" size="sm" className="text-gray-500 text-xs mt-1">
                                        <ThumbsUp className="h-3 w-3 mr-1" /> {reply.likes}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 mb-6">
                          Nenhum comentário disponível.
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Adicionar comentário</h3>
                        <Textarea 
                          className="min-h-[100px]" 
                          placeholder="Digite seu comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button className="mt-2" onClick={handleAddComment}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Enviar Comentário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ratings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Avaliações</CardTitle>
                      <CardDescription>
                        Avaliação média: {calculateAverageRating(selectedTool.ratings)}/5
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedTool.ratings.map((rating) => (
                          <div key={rating.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  {rating.user.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{rating.user}</p>
                                  <p className="text-sm text-gray-500">{rating.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-4 w-4 ${star <= rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500 h-8">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Avaliação</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteRating(selectedTool.id, rating.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                            <p className="mt-2 text-gray-700">{rating.comment}</p>
                            <Button variant="ghost" size="sm" className="text-gray-500 mt-2">
                              <ThumbsUp className="h-4 w-4 mr-1" /> {rating.likes}
                            </Button>
                          </div>
                        ))}
                        {selectedTool.ratings.length === 0 && (
                          <div className="text-center py-6 text-gray-500">
                            Nenhuma avaliação disponível.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="files">
                  <Card>
                    <CardContent className="py-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Arquivos</h3>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Upload de Arquivo
                        </Button>
                      </div>
                      
                      {selectedTool.files && selectedTool.files.length > 0 ? (
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedTool.files.map((file) => (
                                <TableRow key={file.id}>
                                  <TableCell className="font-medium flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                    {file.name}
                                  </TableCell>
                                  <TableCell>{file.type.split('/')[1].toUpperCase()}</TableCell>
                                  <TableCell>{file.size}</TableCell>
                                  <TableCell>{file.date}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button variant="ghost" size="sm">Download</Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="icon" className="text-red-500 h-8">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir Arquivo</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja excluir o arquivo {file.name}? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction 
                                              onClick={() => handleDeleteFile(selectedTool.id, file.id)}
                                              className="bg-red-500 hover:bg-red-600"
                                            >
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
                        <div className="text-center py-10 text-gray-500">
                          Nenhum arquivo disponível.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="images">
                  <Card>
                    <CardContent className="py-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Imagens</h3>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Upload de Imagem
                        </Button>
                      </div>
                      
                      {selectedTool.images && selectedTool.images.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedTool.images.map((image) => (
                            <div key={image.id} className="border rounded-md overflow-hidden relative group">
                              <img 
                                src={image.url} 
                                alt={image.alt} 
                                className="w-full h-48 object-cover" 
                              />
                              <div className="p-2 flex justify-between items-center">
                                <p className="text-sm font-medium">{image.alt}</p>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500 h-8">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Imagem</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteImage(selectedTool.id, image.id)}
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
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          Nenhuma imagem disponível.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Histórico de Atividades</CardTitle>
                      <CardDescription>
                        Registro de todas as alterações realizadas nesta ferramenta.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedTool.history && selectedTool.history.map((item) => (
                          <div key={item.id} className="flex border-l-2 border-gray-200 pl-4 pb-4">
                            <div className="mr-4">
                              <div className="w-2 h-2 rounded-full bg-portal-primary mt-2 -ml-5"></div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{item.date}</p>
                              <p className="font-medium">{item.user} <span className="font-normal">{item.action}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseTool}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Tools;
