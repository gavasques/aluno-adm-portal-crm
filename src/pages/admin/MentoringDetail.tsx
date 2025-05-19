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
import { FileText, MessageSquare, File, ArrowLeft, Trash2 } from "lucide-react";

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
  
  // Carrega dados existentes para edição
  useEffect(() => {
    if (!isNewMentoring) {
      // Em um cenário real, aqui buscaríamos os dados da API
      // Simulando dados para este exemplo
      if (id === "1") {
        const mentoringData = {
          id: "1",
          name: "Mentoria de E-commerce",
          duration: "3 meses",
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
      } else if (id === "2") {
        const mentoringData = {
          id: "2",
          name: "Mentoria de Marketing Digital",
          duration: "6 meses",
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
      }
    }
  }, [id, isNewMentoring, form]);

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
    
    // Em um cenário real, aqui salvaríamos os dados na API
    toast.success(isNewMentoring ? "Mentoria criada com sucesso!" : "Mentoria atualizada com sucesso!");
    
    if (isNewMentoring) {
      navigate("/admin/mentoring");
    }
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

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/admin/mentoring")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para listagem
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">
        {isNewMentoring ? "Nova Mentoria" : mentoring.name}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid w-full grid-cols-3 h-auto">
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
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Mentoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="duration"
                    rules={{ required: "Duração é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 3 meses" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="Individual">Individual</option>
                            <option value="Grupo">Grupo</option>
                          </select>
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
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="Semanal">Semanal</option>
                            <option value="Quinzenal">Quinzenal</option>
                            <option value="Mensal">Mensal</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!isNewMentoring && (
                    <div className="space-y-2">
                      <Label>Data de Cadastro</Label>
                      <Input readOnly value={mentoring.registrationDate} />
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      {isNewMentoring ? "Criar Mentoria" : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Digite seu comentário aqui..." 
                      value={newComment} 
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddComment}>Adicionar</Button>
                </div>
                
                {mentoring.comments.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    {mentoring.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{comment.author} - {comment.date}</p>
                            <p className="mt-1">{comment.text}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum comentário adicionado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="fileTitle">Título do Arquivo</Label>
                      <Input 
                        id="fileTitle"
                        placeholder="Ex: Material de apoio" 
                        value={newFileTitle} 
                        onChange={(e) => setNewFileTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="file">Arquivo</Label>
                      <Input 
                        id="file"
                        type="file" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddFile}>Adicionar Arquivo</Button>
                  </div>
                </div>
                
                {mentoring.files.length > 0 ? (
                  <div className="mt-6">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Título</th>
                          <th className="pb-2">Arquivo</th>
                          <th className="pb-2">Data de Upload</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {mentoring.files.map((file) => (
                          <tr key={file.id} className="border-t">
                            <td className="py-3">{file.title}</td>
                            <td className="py-3">{file.fileName}</td>
                            <td className="py-3">{file.uploadDate}</td>
                            <td className="py-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-500 hover:text-red-700"
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
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum arquivo adicionado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentoringDetail;
