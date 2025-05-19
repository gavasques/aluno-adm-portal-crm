
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  MessageSquare, 
  File, 
  Link, 
  Plus, 
  Trash2,
  Edit,
  LinkIcon
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Course, CourseStatus } from "@/pages/admin/Courses";
import CourseForm from "@/components/admin/CourseForm";
import CheckoutForm from "@/components/admin/CheckoutForm";

// Tipos para as abas
interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface CourseFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

interface Checkout {
  id: string;
  platform: string;
  link: string;
  price: number;
  priority: number;
}

interface UtmLink {
  id: string;
  name: string;
  link: string;
  createdAt: Date;
}

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  
  // Dados das abas
  const [comments, setComments] = useState<Comment[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [utmLinks, setUtmLinks] = useState<UtmLink[]>([]);

  // Estado para diálogos
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditCourseDialog, setShowEditCourseDialog] = useState(false);
  const [showAddCheckoutDialog, setShowAddCheckoutDialog] = useState(false);
  const [newComment, setNewComment] = useState("");
  
  // Estados para UTM Links
  const [newUtmLinkName, setNewUtmLinkName] = useState("");
  const [newUtmLink, setNewUtmLink] = useState("");
  
  // Simulando carregamento de dados
  useEffect(() => {
    // Em um cenário real, aqui você faria uma chamada à API
    setTimeout(() => {
      // Dados fictícios para o curso
      setCourse({
        id: id || "1",
        name: "Curso de E-commerce",
        status: "active" as CourseStatus,
        platform: "Hotmart",
        platformLink: "https://hotmart.com/curso-ecommerce",
        salesPageLink: "https://minhaloja.com/curso-ecommerce",
        accessPeriod: 365,
        createdAt: new Date(2023, 5, 15),
        price: 997
      });
      
      // Dados fictícios para comentários
      setComments([
        {
          id: "c1",
          content: "Material muito bom, estou impressionado com a qualidade!",
          author: "Admin",
          createdAt: new Date(2023, 6, 20)
        }
      ]);
      
      // Dados fictícios para arquivos
      setFiles([
        {
          id: "f1",
          name: "manual_do_aluno.pdf",
          type: "application/pdf",
          size: 2500000, // 2.5MB
          url: "#",
          uploadedAt: new Date(2023, 5, 16)
        }
      ]);
      
      // Dados fictícios para checkouts
      setCheckouts([
        {
          id: "ck1",
          platform: "Hotmart",
          link: "https://pay.hotmart.com/curso-ecommerce",
          price: 997,
          priority: 1
        }
      ]);
      
      // Dados fictícios para UTM links
      setUtmLinks([
        {
          id: "utm1",
          name: "Campanha Instagram",
          link: "https://pay.hotmart.com/curso-ecommerce?utm_source=instagram&utm_medium=social",
          createdAt: new Date(2023, 5, 20)
        }
      ]);
      
      setLoading(false);
    }, 500);
  }, [id]);

  const handleDeleteCourse = () => {
    // Em um cenário real, aqui você faria uma chamada à API para excluir o curso
    toast.success("Curso excluído com sucesso!");
    navigate("/admin/courses");
  };

  const handleEditCourse = (updatedCourseData: Omit<Course, "id" | "createdAt">) => {
    if (course) {
      setCourse({
        ...course,
        ...updatedCourseData
      });
      setShowEditCourseDialog(false);
      toast.success("Curso atualizado com sucesso!");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim().length === 0) {
      toast.error("O comentário não pode estar vazio");
      return;
    }
    
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: "Admin",
      createdAt: new Date(),
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    toast.success("Comentário adicionado com sucesso!");
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
    toast.success("Comentário removido com sucesso!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    // Simular upload de arquivo
    const file = fileList[0];
    const newFile: CourseFile = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    };
    
    setFiles([...files, newFile]);
    toast.success(`Arquivo "${file.name}" adicionado com sucesso!`);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    toast.success("Arquivo removido com sucesso!");
  };
  
  const handleAddCheckout = (checkoutData: Omit<Checkout, "id">) => {
    const newCheckout: Checkout = {
      id: Date.now().toString(),
      ...checkoutData
    };
    
    setCheckouts([...checkouts, newCheckout]);
    setShowAddCheckoutDialog(false);
    toast.success("Checkout adicionado com sucesso!");
  };
  
  const handleDeleteCheckout = (id: string) => {
    setCheckouts(checkouts.filter(checkout => checkout.id !== id));
    toast.success("Checkout removido com sucesso!");
  };
  
  const handleAddUtmLink = () => {
    // Validação para os campos de UTM
    if (newUtmLinkName.trim().length === 0) {
      toast.error("O nome do link é obrigatório");
      return;
    }
    
    if (newUtmLink.trim().length === 0) {
      toast.error("O link trackeado é obrigatório");
      return;
    }
    
    try {
      // Validar se é uma URL válida
      new URL(newUtmLink);
    } catch (e) {
      toast.error("Link inválido. Insira uma URL completa (ex: https://exemplo.com)");
      return;
    }
    
    const newLink: UtmLink = {
      id: Date.now().toString(),
      name: newUtmLinkName,
      link: newUtmLink,
      createdAt: new Date()
    };
    
    setUtmLinks([...utmLinks, newLink]);
    setNewUtmLinkName("");
    setNewUtmLink("");
    toast.success("Link UTM adicionado com sucesso!");
  };
  
  const handleDeleteUtmLink = (id: string) => {
    setUtmLinks(utmLinks.filter(link => link.id !== id));
    toast.success("Link UTM removido com sucesso!");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const getStatusBadgeClass = (status: CourseStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "coming_soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: CourseStatus) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "coming_soon":
        return "Em breve";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center">
          <p>Carregando detalhes do curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center">
          <p>Curso não encontrado</p>
          <Button onClick={() => navigate("/admin/courses")}>
            Voltar para lista de cursos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-portal-dark">{course.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(course.status)}`}>
              {getStatusText(course.status)}
            </span>
            <span className="text-sm text-gray-500">
              Cadastrado em {format(course.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/courses")}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Excluir Curso
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Detalhes do Curso</TabsTrigger>
          <TabsTrigger value="comments">
            Comentários <span className="ml-1 text-xs">({comments.length})</span>
          </TabsTrigger>
          <TabsTrigger value="files">
            Arquivos <span className="ml-1 text-xs">({files.length})</span>
          </TabsTrigger>
          <TabsTrigger value="checkouts">
            Páginas de Checkout <span className="ml-1 text-xs">({checkouts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="utmLinks">
            Links UTM <span className="ml-1 text-xs">({utmLinks.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba de Detalhes */}
        <TabsContent value="details">
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Informações do Curso</CardTitle>
              <Button onClick={() => setShowEditCourseDialog(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" /> Editar Informações
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Plataforma</h3>
                  <p>{course.platform}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p>{getStatusText(course.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Link da Plataforma</h3>
                  <a href={course.platformLink} target="_blank" rel="noopener noreferrer" className="text-portal-primary hover:underline flex items-center">
                    {course.platformLink} <Link className="h-4 w-4 ml-1" />
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Página de Vendas</h3>
                  <a href={course.salesPageLink} target="_blank" rel="noopener noreferrer" className="text-portal-primary hover:underline flex items-center">
                    {course.salesPageLink} <Link className="h-4 w-4 ml-1" />
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Período de Acesso</h3>
                  <p>{course.accessPeriod} dias</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Preço</h3>
                  <p>R$ {course.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Comentários */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Comentários</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex gap-2">
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Adicione um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Button onClick={handleAddComment}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Adicionar Comentário
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Nenhum comentário encontrado.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.author}</p>
                          <p className="text-xs text-gray-500">
                            {format(comment.createdAt, "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <p className="mt-2">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Arquivos */}
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Arquivos</span>
                <div>
                  <Button asChild>
                    <label>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Arquivo
                    </label>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhum arquivo encontrado.</p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left">Nome</th>
                        <th className="h-12 px-4 text-left">Tipo</th>
                        <th className="h-12 px-4 text-left">Tamanho</th>
                        <th className="h-12 px-4 text-left">Data de Upload</th>
                        <th className="h-12 px-4 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr key={file.id} className="border-b">
                          <td className="p-4">
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-portal-primary hover:underline flex items-center">
                              <File className="h-4 w-4 mr-2" /> {file.name}
                            </a>
                          </td>
                          <td className="p-4">{file.type}</td>
                          <td className="p-4">{formatFileSize(file.size)}</td>
                          <td className="p-4">{format(file.uploadedAt, "dd/MM/yyyy")}</td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Checkouts */}
        <TabsContent value="checkouts">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Páginas de Checkout</span>
                <Button onClick={() => setShowAddCheckoutDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Checkout
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {checkouts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma página de checkout encontrada.</p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left">Plataforma</th>
                        <th className="h-12 px-4 text-left">Link</th>
                        <th className="h-12 px-4 text-left">Preço</th>
                        <th className="h-12 px-4 text-left">Prioridade</th>
                        <th className="h-12 px-4 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkouts.map((checkout) => (
                        <tr key={checkout.id} className="border-b">
                          <td className="p-4">{checkout.platform}</td>
                          <td className="p-4">
                            <a href={checkout.link} target="_blank" rel="noopener noreferrer" className="text-portal-primary hover:underline flex items-center">
                              {checkout.link} <Link className="h-4 w-4 ml-1" />
                            </a>
                          </td>
                          <td className="p-4">R$ {checkout.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="p-4">{checkout.priority}</td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteCheckout(checkout.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba de Links UTM */}
        <TabsContent value="utmLinks">
          <Card>
            <CardHeader>
              <CardTitle>Links de Checkout UTM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Link
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Ex: Campanha Instagram"
                      value={newUtmLinkName}
                      onChange={(e) => setNewUtmLinkName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Trackeado
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="https://exemplo.com?utm_source=exemplo"
                      value={newUtmLink}
                      onChange={(e) => setNewUtmLink(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddUtmLink}>
                    <LinkIcon className="h-4 w-4 mr-2" /> Adicionar Link UTM
                  </Button>
                </div>
              </div>
              
              {utmLinks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhum link UTM cadastrado.</p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left">Nome</th>
                        <th className="h-12 px-4 text-left">Link</th>
                        <th className="h-12 px-4 text-left">Data de Cadastro</th>
                        <th className="h-12 px-4 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {utmLinks.map((utmLink) => (
                        <tr key={utmLink.id} className="border-b">
                          <td className="p-4">{utmLink.name}</td>
                          <td className="p-4">
                            <a href={utmLink.link} target="_blank" rel="noopener noreferrer" className="text-portal-primary hover:underline flex items-center">
                              {utmLink.link.length > 50 ? `${utmLink.link.substring(0, 50)}...` : utmLink.link} <Link className="h-4 w-4 ml-1" />
                            </a>
                          </td>
                          <td className="p-4">{format(utmLink.createdAt, "dd/MM/yyyy")}</td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteUtmLink(utmLink.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de edição do curso */}
      <Dialog open={showEditCourseDialog} onOpenChange={setShowEditCourseDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>
              Atualize as informações do curso conforme necessário.
            </DialogDescription>
          </DialogHeader>
          {course && (
            <CourseForm 
              onSubmit={handleEditCourse}
              onCancel={() => setShowEditCourseDialog(false)}
              initialData={course}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog de adição de checkout */}
      <Dialog open={showAddCheckoutDialog} onOpenChange={setShowAddCheckoutDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Página de Checkout</DialogTitle>
            <DialogDescription>
              Preencha as informações da página de checkout.
            </DialogDescription>
          </DialogHeader>
          <CheckoutForm 
            onSubmit={handleAddCheckout}
            onCancel={() => setShowAddCheckoutDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetails;
