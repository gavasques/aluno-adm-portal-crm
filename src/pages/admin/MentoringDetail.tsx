
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileText, MessageSquare, File, ArrowLeft, Trash2, Edit } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Mentoring {
  id: string;
  name: string;
  duration: string;
  type: string;
  registrationDate: string;
  periodicity: string;
  comments: Comment[];
  files: FileItem[];
}

interface Comment {
  id: string;
  text: string;
  date: string;
  author: string;
}

interface FileItem {
  id: string;
  title: string;
  fileName: string;
  uploadDate: string;
}

const MentoringDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewMentoring = id === "new";
  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(isNewMentoring);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Estado para mentoria
  const [mentoring, setMentoring] = useState<Mentoring>({
    id: id || "",
    name: "",
    duration: "",
    type: "Individual",
    registrationDate: new Date().toLocaleDateString("pt-BR"),
    periodicity: "Semanal",
    comments: [],
    files: []
  });

  // Estado para novo comentário
  const [newComment, setNewComment] = useState("");

  // Estado para novo arquivo
  const [newFileTitle, setNewFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Formulário para detalhes da mentoria
  const form = useForm({
    defaultValues: {
      name: "",
      duration: "",
      type: "Individual",
      periodicity: "Semanal",
    }
  });
  
  // Formulário para edição rápida
  const editForm = useForm({
    defaultValues: {
      name: mentoring.name,
      duration: mentoring.duration,
      type: mentoring.type,
      periodicity: mentoring.periodicity,
    }
  });
  
  // Carrega dados existentes para edição
  useEffect(() => {
    if (!isNewMentoring) {
      // Em um cenário real, aqui buscaríamos os dados da API
      // Simulando dados para este exemplo
      if (id === "1") {
        const mentoringData = {
          id: "1",
          name: "Mentoria de E-commerce",
          duration: "3 Meses",
          type: "Individual",
          registrationDate: "01/05/2025",
          periodicity: "Semanal",
          comments: [
            { id: "c1", text: "Primeira sessão agendada", date: "02/05/2025", author: "Admin" }
          ],
          files: [
            { id: "f1", title: "Material de apoio", fileName: "ecommerce_material.pdf", uploadDate: "01/05/2025" }
          ]
        };
        
        setMentoring(mentoringData);
        form.reset({
          name: mentoringData.name,
          duration: mentoringData.duration,
          type: mentoringData.type,
          periodicity: mentoringData.periodicity
        });
        
        editForm.reset({
          name: mentoringData.name,
          duration: mentoringData.duration,
          type: mentoringData.type,
          periodicity: mentoringData.periodicity
        });
      } else if (id === "2") {
        const mentoringData = {
          id: "2",
          name: "Mentoria de Marketing Digital",
          duration: "6 Meses",
          type: "Grupo",
          registrationDate: "15/04/2025",
          periodicity: "Quinzenal",
          comments: [],
          files: []
        };
        
        setMentoring(mentoringData);
        form.reset({
          name: mentoringData.name,
          duration: mentoringData.duration,
          type: mentoringData.type,
          periodicity: mentoringData.periodicity
        });
        
        editForm.reset({
          name: mentoringData.name,
          duration: mentoringData.duration,
          type: mentoringData.type,
          periodicity: mentoringData.periodicity
        });
      }
    }
  }, [id, isNewMentoring, form, editForm]);

  const onSubmit = (data: any) => {
    const updatedMentoring = {
      ...mentoring,
      name: data.name,
      duration: data.duration,
      type: data.type,
      periodicity: data.periodicity,
      id: isNewMentoring ? `${Date.now()}` : mentoring.id,
      registrationDate: isNewMentoring ? new Date().toLocaleDateString("pt-BR") : mentoring.registrationDate
    };
    
    setMentoring(updatedMentoring);
    setEditMode(false);
    
    // Em um cenário real, aqui salvaríamos os dados na API
    toast.success(isNewMentoring ? "Mentoria criada com sucesso!" : "Mentoria atualizada com sucesso!");
    
    if (isNewMentoring) {
      navigate("/admin/mentoring");
    }
  };
  
  const handleQuickEdit = (data: any) => {
    const updatedMentoring = {
      ...mentoring,
      name: data.name,
      duration: data.duration,
      type: data.type,
      periodicity: data.periodicity
    };
    
    setMentoring(updatedMentoring);
    form.reset({
      name: data.name,
      duration: data.duration,
      type: data.type,
      periodicity: data.periodicity
    });
    
    setEditDialogOpen(false);
    toast.success("Mentoria atualizada com sucesso!");
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `c${Date.now()}`,
        text: newComment,
        date: new Date().toLocaleDateString("pt-BR"),
        author: "Admin"
      };
      
      setMentoring({
        ...mentoring,
        comments: [...mentoring.comments, comment]
      });
      
      setNewComment("");
      toast.success("Comentário adicionado com sucesso!");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setMentoring({
      ...mentoring,
      comments: mentoring.comments.filter(comment => comment.id !== commentId)
    });
    toast.success("Comentário removido com sucesso!");
  };

  const handleAddFile = () => {
    if (newFileTitle.trim() && selectedFile) {
      const file = {
        id: `f${Date.now()}`,
        title: newFileTitle,
        fileName: selectedFile.name,
        uploadDate: new Date().toLocaleDateString("pt-BR")
      };
      
      setMentoring({
        ...mentoring,
        files: [...mentoring.files, file]
      });
      
      setNewFileTitle("");
      setSelectedFile(null);
      toast.success("Arquivo adicionado com sucesso!");
    } else {
      toast.error("Preencha o título e selecione um arquivo");
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setMentoring({
      ...mentoring,
      files: mentoring.files.filter(file => file.id !== fileId)
    });
    toast.success("Arquivo removido com sucesso!");
  };

  const openEditDialog = () => {
    editForm.reset({
      name: mentoring.name,
      duration: mentoring.duration,
      type: mentoring.type,
      periodicity: mentoring.periodicity
    });
    setEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/mentoring")}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        {!isNewMentoring && (
          <Button onClick={openEditDialog} variant="outline" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </div>
      
      <h1 className="text-2xl font-bold mb-4 text-portal-dark">
        {isNewMentoring ? "Nova Mentoria" : mentoring.name}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-200px)]">
        <TabsList className="mb-4 grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="details" className="flex items-center py-2">
            <FileText className="mr-2 h-4 w-4" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center py-2">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comentários
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center py-2">
            <File className="mr-2 h-4 w-4" />
            Arquivos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="overflow-auto h-[calc(100vh-270px)]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Dados da Mentoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Nome da mentoria é obrigatório" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Mentoria</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Mentoria de E-commerce" {...field} readOnly={!isNewMentoring} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      rules={{ required: "Duração é obrigatória" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração</FormLabel>
                          <FormControl>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange} 
                              disabled={!isNewMentoring}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a duração" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1 Mês">1 Mês</SelectItem>
                                <SelectItem value="3 Meses">3 Meses</SelectItem>
                                <SelectItem value="6 Meses">6 Meses</SelectItem>
                                <SelectItem value="1 Ano">1 Ano</SelectItem>
                                <SelectItem value="Vitalício">Vitalício</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <FormControl>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                              disabled={!isNewMentoring}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Grupo">Grupo</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="periodicity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Periodicidade</FormLabel>
                          <FormControl>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                              disabled={!isNewMentoring}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a periodicidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Semanal">Semanal</SelectItem>
                                <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                                <SelectItem value="Mensal">Mensal</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {!isNewMentoring && (
                    <div>
                      <Label>Data de Cadastro</Label>
                      <Input readOnly value={mentoring.registrationDate} className="bg-gray-50" />
                    </div>
                  )}
                  
                  {isNewMentoring && (
                    <div className="flex justify-end">
                      <Button type="submit">
                        Criar Mentoria
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="overflow-auto h-[calc(100vh-270px)]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Digite seu comentário aqui..." 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button onClick={handleAddComment} className="flex-shrink-0">Adicionar</Button>
                </div>
                
                {mentoring.comments.length > 0 ? (
                  <div className="space-y-2 mt-4">
                    {mentoring.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{comment.author} - {comment.date}</p>
                            <p className="mt-1 text-sm">{comment.text}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Nenhum comentário adicionado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files" className="overflow-auto h-[calc(100vh-270px)]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="fileTitle" className="text-sm">Título</Label>
                      <Input 
                        id="fileTitle"
                        placeholder="Ex: Material de apoio" 
                        value={newFileTitle} 
                        onChange={(e) => setNewFileTitle(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="file" className="text-sm">Arquivo</Label>
                      <Input 
                        id="file"
                        type="file" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="h-9"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddFile} size="sm" className="h-9">Adicionar</Button>
                    </div>
                  </div>
                </div>
                
                {mentoring.files.length > 0 ? (
                  <div className="mt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Título</th>
                          <th className="pb-2">Arquivo</th>
                          <th className="pb-2 w-24">Data</th>
                          <th className="pb-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {mentoring.files.map((file) => (
                          <tr key={file.id} className="border-t">
                            <td className="py-2">{file.title}</td>
                            <td className="py-2">{file.fileName}</td>
                            <td className="py-2 text-sm">{file.uploadDate}</td>
                            <td className="py-2 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Nenhum arquivo adicionado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog para edição rápida */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Mentoria</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleQuickEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                rules={{ required: "Nome da mentoria é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Mentoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Mentoria de E-commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                    
              <FormField
                control={editForm.control}
                name="duration"
                rules={{ required: "Duração é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração</FormLabel>
                    <FormControl>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 Mês">1 Mês</SelectItem>
                          <SelectItem value="3 Meses">3 Meses</SelectItem>
                          <SelectItem value="6 Meses">6 Meses</SelectItem>
                          <SelectItem value="1 Ano">1 Ano</SelectItem>
                          <SelectItem value="Vitalício">Vitalício</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  
              <FormField
                control={editForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Grupo">Grupo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                    
              <FormField
                control={editForm.control}
                name="periodicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodicidade</FormLabel>
                    <FormControl>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a periodicidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                          <SelectItem value="Mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentoringDetail;
