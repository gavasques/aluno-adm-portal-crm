
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Building, 
  File, 
  MessageCircle, 
  Phone, 
  Star, 
  Tag, 
  Trash, 
  ThumbsUp, 
  Edit,
  Users 
} from "lucide-react";
import SupplierForm from "./SupplierForm";
import SupplierRatingForm from "./SupplierRatingForm";

// Dados de exemplo
const COMMENTS = [
  {
    id: 1,
    user: { id: 1, name: "João da Silva", initials: "JS" },
    text: "Fornecedor excelente! Produtos de qualidade e entrega rápida. Recomendo a todos.",
    date: "2 dias atrás",
    likes: 3,
    replies: []
  },
  {
    id: 2,
    user: { id: 2, name: "Maria Rodrigues", initials: "MR" },
    text: "Tive problema com um produto e o fornecedor resolveu rapidamente. Atendimento eficiente!",
    date: "1 semana atrás",
    likes: 1,
    replies: [
      {
        id: 3,
        user: { id: 3, name: "Carlos Mendes", initials: "CM" },
        text: "Também tive uma ótima experiência com o suporte deles.",
        date: "5 dias atrás",
        likes: 0
      }
    ]
  }
];

const RATINGS = [
  {
    id: 1,
    user: { id: 1, name: "João da Silva" },
    rating: 5,
    text: "Produtos de alta qualidade e preços competitivos.",
    date: "15 dias atrás"
  },
  {
    id: 2,
    user: { id: 2, name: "Maria Rodrigues" },
    rating: 4,
    text: "Boa relação custo-benefício, mas prazos de entrega podem melhorar.",
    date: "1 mês atrás"
  },
  {
    id: 3,
    user: { id: 3, name: "Carlos Mendes" },
    rating: 5,
    text: "Atendimento excelente e produtos conforme descrição.",
    date: "2 meses atrás"
  }
];

const FILES = [
  {
    id: 1,
    name: "Catálogo de Produtos.pdf",
    size: "2.3 MB",
    date: "15/04/2023",
    type: "pdf"
  },
  {
    id: 2,
    name: "Tabela de Preços.xlsx",
    size: "1.5 MB",
    date: "10/03/2023",
    type: "xlsx"
  }
];

const BRANCHES = [
  {
    id: 1,
    name: "Filial São Paulo",
    address: "Avenida Paulista, 1000 - São Paulo/SP",
    email: "contato@filial.com"
  },
  {
    id: 2,
    name: "Filial Rio de Janeiro",
    address: "Avenida Atlântica, 500 - Rio de Janeiro/RJ",
    email: "rio@filial.com"
  }
];

const BRANDS = [
  {
    id: 1,
    name: "Marca A",
    initials: "MA"
  },
  {
    id: 2,
    name: "Marca B",
    initials: "MB"
  }
];

const CONTACTS = [
  {
    id: 1,
    name: "Roberto Santos",
    role: "Gerente Comercial",
    email: "roberto@exemplo.com",
    phone: "(11) 99999-8888",
    initials: "RS"
  },
  {
    id: 2,
    name: "Ana Lima",
    role: "Atendimento ao Cliente",
    email: "ana@exemplo.com",
    phone: "(11) 99999-7777",
    initials: "AL"
  }
];

interface SupplierDetailProps {
  supplier: any;
  onBack: () => void;
  onUpdate: (updatedSupplier: any) => void;
  isAdmin: boolean;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ 
  supplier, 
  onBack, 
  onUpdate,
  isAdmin
}) => {
  const [comments, setComments] = useState(COMMENTS);
  const [ratings, setRatings] = useState(RATINGS);
  const [files, setFiles] = useState(FILES);
  const [branches, setBranches] = useState(BRANCHES);
  const [brands, setBrands] = useState(BRANDS);
  const [contacts, setContacts] = useState(CONTACTS);
  const [newComment, setNewComment] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      
      // Check if the like is for a reply
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === commentId) {
            return { ...reply, likes: reply.likes + 1 };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      
      return comment;
    }));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Math.max(...comments.map(c => c.id), 0) + 1,
        user: { id: 999, name: "Usuário Atual", initials: "UA" },
        text: newComment,
        date: "Agora",
        likes: 0,
        replies: []
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
      toast.success("Comentário adicionado com sucesso!");
    }
  };

  const handleReply = (commentId: number) => {
    if (replyText.trim()) {
      const newReply = {
        id: Math.max(...comments.flatMap(c => c.replies ? c.replies.map(r => r.id) : []), 0) + 1,
        user: { id: 999, name: "Usuário Atual", initials: "UA" },
        text: replyText,
        date: "Agora",
        likes: 0
      };
      
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return { 
            ...comment, 
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      }));
      
      setReplyText("");
      setReplyingTo(null);
      toast.success("Resposta adicionada com sucesso!");
    }
  };

  const handleUpdateSupplier = (updatedData: any) => {
    onUpdate(updatedData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteComment = (commentId: number, isReply = false, parentId?: number) => {
    if (isReply && parentId) {
      // Delete a reply
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== commentId)
          };
        }
        return comment;
      }));
    } else {
      // Delete a comment
      setComments(comments.filter(comment => comment.id !== commentId));
    }
    toast.success("Comentário excluído com sucesso!");
  };

  const handleAddRating = (ratingData: any) => {
    const newRating = {
      id: Math.max(...ratings.map(r => r.id), 0) + 1,
      user: { id: 999, name: "Usuário Atual" },
      rating: ratingData.rating,
      text: ratingData.comment,
      date: "Agora"
    };
    
    setRatings([...ratings, newRating]);
    
    // Recalculate average rating
    const newRatingsArray = [...ratings, newRating];
    const newAverage = newRatingsArray.reduce((acc, curr) => acc + curr.rating, 0) / newRatingsArray.length;
    
    // Update supplier with new rating
    onUpdate({
      ...supplier,
      rating: parseFloat(newAverage.toFixed(1)),
      comments: supplier.comments + 1
    });
    
    setIsRatingDialogOpen(false);
    toast.success("Avaliação adicionada com sucesso!");
  };

  const handleDeleteRating = (ratingId: number) => {
    const newRatings = ratings.filter(rating => rating.id !== ratingId);
    setRatings(newRatings);
    
    // Recalculate average rating
    const newAverage = newRatings.length > 0 
      ? newRatings.reduce((acc, curr) => acc + curr.rating, 0) / newRatings.length 
      : 0;
    
    // Update supplier with new rating
    onUpdate({
      ...supplier,
      rating: parseFloat(newAverage.toFixed(1)),
      comments: supplier.comments > 0 ? supplier.comments - 1 : 0
    });
    
    toast.success("Avaliação excluída com sucesso!");
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const fileExtension = file.name.split('.').pop() || "";
      
      const newFile = {
        id: Math.max(...files.map(f => f.id), 0) + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toLocaleDateString('pt-BR'),
        type: fileExtension
      };
      
      setFiles([...files, newFile]);
      toast.success("Arquivo adicionado com sucesso!");
    }
  };

  const handleDeleteFile = (fileId: number) => {
    setFiles(files.filter(file => file.id !== fileId));
    toast.success("Arquivo excluído com sucesso!");
  };

  // Calcular estatísticas de avaliação
  const calculateRatingStats = () => {
    const stats = [5, 4, 3, 2, 1].map(rating => {
      const count = ratings.filter(r => r.rating === rating).length;
      const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
      return { rating, count, percentage };
    });
    
    return stats;
  };
  
  const ratingStats = calculateRatingStats();

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onBack}>Voltar para lista</Button>
        <div className="flex items-center">
          <div className="flex items-center text-yellow-500 mr-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className="mr-0.5" 
                fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
              />
            ))}
            <span className="ml-1 text-gray-600">({supplier.rating})</span>
          </div>
          <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Star className="mr-1 h-4 w-4" /> Avaliar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Avaliar Fornecedor</DialogTitle>
              </DialogHeader>
              <SupplierRatingForm onSubmit={handleAddRating} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-portal-primary text-white flex items-center justify-center text-xl font-bold">
              {supplier.logo || supplier.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{supplier.name}</CardTitle>
              <p className="text-gray-500">{supplier.category}</p>
            </div>
            
            {isAdmin && (
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Edit className="mr-1 h-4 w-4" /> Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Fornecedor</DialogTitle>
                  </DialogHeader>
                  <SupplierForm supplier={supplier} onSubmit={handleUpdateSupplier} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="info">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="info" className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Dados
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center gap-1">
            <Building className="h-4 w-4" /> Filiais
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-1">
            <Tag className="h-4 w-4" /> Marcas
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Phone className="h-4 w-4" /> Contatos
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-1">
            <File className="h-4 w-4" /> Arquivos
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-1">
            <Star className="h-4 w-4" /> Avaliações
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> Comentários
          </TabsTrigger>
        </TabsList>
        
        {/* Aba Dados do Fornecedor */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Fornecedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nome</p>
                  <p className="font-medium">{supplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Categoria</p>
                  <p className="font-medium">{supplier.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">CNPJ</p>
                  <p className="font-medium">{supplier.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Endereço</p>
                  <p className="font-medium">{supplier.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Telefone</p>
                  <p className="font-medium">{supplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">E-mail</p>
                  <p className="font-medium">{supplier.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Website</p>
                  <p className="font-medium text-portal-primary">{supplier.website}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avaliação</p>
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className="mr-0.5" 
                          fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-gray-600">({supplier.rating})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Filiais */}
        <TabsContent value="branches">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Filiais</CardTitle>
              {isAdmin && (
                <Button size="sm" variant="outline">
                  Adicionar Filial
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {branches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma filial cadastrada para este fornecedor.
                </div>
              ) : (
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <Card key={branch.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{branch.name}</h3>
                            <p className="text-sm text-gray-500">{branch.address}</p>
                            <p className="text-sm text-gray-500">{branch.email}</p>
                          </div>
                          {isAdmin && (
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 text-gray-500" />
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
                                      Tem certeza que deseja excluir esta filial? Esta ação não pode ser desfeita.
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
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Marcas */}
        <TabsContent value="brands">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Marcas</CardTitle>
              {isAdmin && (
                <Button size="sm" variant="outline">
                  Adicionar Marca
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {brands.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma marca cadastrada para este fornecedor.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {brands.map((brand) => (
                    <Card key={brand.id} className="p-4">
                      <div className="text-center relative">
                        <div className="w-16 h-16 rounded bg-portal-light flex items-center justify-center mx-auto">
                          <span className="text-lg font-bold text-portal-primary">{brand.initials}</span>
                        </div>
                        <h3 className="mt-2 font-medium">{brand.name}</h3>
                        
                        {isAdmin && (
                          <div className="absolute top-0 right-0 flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3 text-gray-500" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Trash className="h-3 w-3 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir esta marca? Esta ação não pode ser desfeita.
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
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Contatos */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contatos</CardTitle>
              {isAdmin && (
                <Button size="sm" variant="outline">
                  Adicionar Contato
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum contato cadastrado para este fornecedor.
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center mr-3">
                              <span className="font-medium text-portal-primary">{contact.initials}</span>
                            </div>
                            <div>
                              <h3 className="font-medium">{contact.name}</h3>
                              <p className="text-sm text-gray-500">{contact.role}</p>
                              <p className="text-sm text-gray-500">{contact.email} | {contact.phone}</p>
                            </div>
                          </div>
                          
                          {isAdmin && (
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 text-gray-500" />
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
                                      Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
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
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Arquivos */}
        <TabsContent value="files">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Arquivos</CardTitle>
              {isAdmin && (
                <div>
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={uploadFile}
                  />
                  <label htmlFor="file-upload">
                    <Button size="sm" variant="outline" asChild>
                      <span className="cursor-pointer">Adicionar Arquivo</span>
                    </Button>
                  </label>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum arquivo disponível para este fornecedor.
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file) => (
                    <Card key={file.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-portal-light flex items-center justify-center mr-3">
                            <File className="h-5 w-5 text-portal-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{file.name}</h3>
                            <p className="text-sm text-gray-500">{file.size} • Adicionado em {file.date}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            {isAdmin && (
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
                                      Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteFile(file.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Avaliações */}
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 md:w-64 text-center mb-4 md:mb-0">
                  <div className="text-5xl font-bold text-portal-primary">{supplier.rating}</div>
                  <div className="flex items-center justify-center text-yellow-500 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className="mr-0.5" 
                        fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{ratings.length} avaliações</div>
                  
                  <Button 
                    onClick={() => setIsRatingDialogOpen(true)} 
                    className="mt-4 w-full"
                    size="sm"
                  >
                    Avaliar Fornecedor
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="mb-6">
                    {ratingStats.map(stat => (
                      <div key={stat.rating} className="flex items-center mb-1">
                        <span className="text-sm text-gray-500 w-4">{stat.rating}</span>
                        <Star size={14} className="text-yellow-500 mx-1" fill="currentColor" />
                        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-yellow-500 rounded-full"
                            style={{ width: `${stat.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {stat.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="font-medium mb-4">Avaliações dos Usuários</h3>
                
                {ratings.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Nenhuma avaliação para este fornecedor.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {ratings.map((rating) => (
                      <Card key={rating.id} className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium">{rating.user.name}</span>
                            <div className="flex items-center text-yellow-500 ml-3">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  className="mr-0.5" 
                                  fill={i < rating.rating ? "currentColor" : "none"} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{rating.date}</span>
                        </div>
                        
                        <p className="text-gray-700 text-sm">{rating.text}</p>
                        
                        {/* Apenas ADM ou o próprio usuário pode excluir avaliações */}
                        {(isAdmin || rating.user.id === 999) && (
                          <div className="flex justify-end mt-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-xs text-red-500">
                                  Excluir avaliação
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
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Comentários */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum comentário para este fornecedor. Seja o primeiro a comentar!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-portal-light text-portal-primary flex items-center justify-center font-medium">
                        {comment.user.initials}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">{comment.user.name}</h4>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                        <div className="flex items-center mt-2 ml-2 text-sm text-gray-600">
                          <button 
                            className="flex items-center hover:text-portal-primary transition-colors"
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            <span>{comment.likes} Curtidas</span>
                          </button>
                          <button 
                            className="flex items-center ml-4 hover:text-portal-primary transition-colors"
                            onClick={() => replyingTo === comment.id ? setReplyingTo(null) : setReplyingTo(comment.id)}
                          >
                            <MessageCircle className="mr-1 h-4 w-4" />
                            <span>Responder</span>
                          </button>
                          
                          {/* Opção de excluir apenas para ADM */}
                          {isAdmin && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="flex items-center ml-4 text-red-500 hover:text-red-600 transition-colors">
                                  <Trash className="mr-1 h-4 w-4" />
                                  <span>Excluir</span>
                                </button>
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
                          )}
                        </div>
                        
                        {/* Área de resposta */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 pl-4">
                            <textarea 
                              className="w-full border rounded-md p-2 text-sm"
                              placeholder="Escreva sua resposta..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                            ></textarea>
                            <div className="flex justify-end mt-2">
                              <Button 
                                size="sm"
                                variant="outline" 
                                onClick={() => setReplyingTo(null)}
                                className="mr-2"
                              >
                                Cancelar
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleReply(comment.id)}
                              >
                                Enviar Resposta
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* Respostas existentes */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 space-y-4 pl-6">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-portal-light text-portal-primary flex items-center justify-center text-sm font-medium">
                                  {reply.user.initials}
                                </div>
                                <div className="flex-1">
                                  <div className="bg-gray-100 rounded-lg p-3">
                                    <div className="flex justify-between mb-1">
                                      <h4 className="font-medium">{reply.user.name}</h4>
                                      <span className="text-xs text-gray-500">{reply.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{reply.text}</p>
                                  </div>
                                  <div className="flex items-center mt-2 ml-2 text-sm text-gray-600">
                                    <button 
                                      className="flex items-center hover:text-portal-primary transition-colors"
                                      onClick={() => handleLikeComment(reply.id)}
                                    >
                                      <ThumbsUp className="mr-1 h-3 w-3" />
                                      <span>{reply.likes} Curtidas</span>
                                    </button>
                                    
                                    {/* Opção de excluir apenas para ADM */}
                                    {isAdmin && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <button className="flex items-center ml-4 text-red-500 hover:text-red-600 transition-colors">
                                            <Trash className="mr-1 h-3 w-3" />
                                            <span>Excluir</span>
                                          </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja excluir esta resposta? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction 
                                              onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                              className="bg-red-500 hover:bg-red-600"
                                            >
                                              Excluir
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              <div className="mt-6 border-t pt-6">
                <h4 className="font-medium mb-2">Adicionar Comentário</h4>
                <textarea 
                  className="w-full border rounded-md p-3 min-h-[100px]"
                  placeholder="Escreva seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <Button onClick={handleAddComment}>Publicar Comentário</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetail;
