
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, MessageSquare, FileText, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bonus, BonusType, AccessPeriod } from "@/types/bonus.types";

// Interface para comentários
interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: Date;
  likes: number;
  userLiked: boolean;
}

// Interface para arquivos
interface BonusFile {
  id: string;
  name: string;
  size: number;
  type: string;
  description: string;
  uploadedAt: Date;
}

const BonusDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<BonusType>("Outros");
  const [description, setDescription] = useState("");
  const [accessPeriod, setAccessPeriod] = useState<AccessPeriod>("30 dias");
  const [observations, setObservations] = useState("");
  
  // Comentários
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  
  // Arquivos
  const [files, setFiles] = useState<BonusFile[]>([]);
  const [newFileDescription, setNewFileDescription] = useState("");

  useEffect(() => {
    // Simulating API call to fetch bonus details
    const fetchBonus = () => {
      setIsLoading(true);
      
      // In a real application, this would be an API call
      // For now, we'll use localStorage to simulate a database
      const storedBonuses = localStorage.getItem("bonuses");
      const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
      
      const foundBonus = bonuses.find(b => b.id === id);
      
      if (foundBonus) {
        setBonus(foundBonus);
        // Initialize form fields
        setName(foundBonus.name);
        setType(foundBonus.type);
        setDescription(foundBonus.description);
        setAccessPeriod(foundBonus.access_period);
        setObservations(foundBonus.observations || "");
        
        // Load comments from localStorage if available
        const storedComments = localStorage.getItem(`bonus_${id}_comments`);
        if (storedComments) {
          setComments(JSON.parse(storedComments).map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          })));
        }
        
        // Load files from localStorage if available
        const storedFiles = localStorage.getItem(`bonus_${id}_files`);
        if (storedFiles) {
          setFiles(JSON.parse(storedFiles).map((file: any) => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt)
          })));
        }
      } else {
        toast.error("Bônus não encontrado");
        navigate("/admin/bonus");
      }
      
      setIsLoading(false);
    };
    
    fetchBonus();
  }, [id, navigate]);

  const handleSave = () => {
    if (!bonus) return;
    
    const updatedBonus: Bonus = {
      ...bonus,
      name,
      type,
      description,
      access_period: accessPeriod,
      observations
    };
    
    // Update in localStorage (in a real app, this would be an API call)
    const storedBonuses = localStorage.getItem("bonuses");
    const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
    
    const updatedBonuses = bonuses.map(b => 
      b.id === id ? updatedBonus : b
    );
    
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    setBonus(updatedBonus);
    setIsEditing(false);
    toast.success("Bônus atualizado com sucesso!");
  };
  
  const handleDelete = () => {
    if (!bonus) return;
    
    // Remove from localStorage (in a real app, this would be an API call)
    const storedBonuses = localStorage.getItem("bonuses");
    const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
    
    const updatedBonuses = bonuses.filter(b => b.id !== id);
    
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    // Also remove comments and files
    localStorage.removeItem(`bonus_${id}_comments`);
    localStorage.removeItem(`bonus_${id}_files`);
    
    toast.success("Bônus removido com sucesso!");
    navigate("/admin/bonus");
  };

  // Handle comments
  const addComment = () => {
    if (!newComment.trim() || !bonus) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      authorName: "Administrador", // In a real app, get from authenticated user
      createdAt: new Date(),
      likes: 0,
      userLiked: false
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`bonus_${id}_comments`, JSON.stringify(updatedComments));
    setNewComment("");
    toast.success("Comentário adicionado!");
  };
  
  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const userLiked = !comment.userLiked;
        return {
          ...comment,
          likes: userLiked ? comment.likes + 1 : comment.likes - 1,
          userLiked
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    localStorage.setItem(`bonus_${id}_comments`, JSON.stringify(updatedComments));
  };
  
  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`bonus_${id}_comments`, JSON.stringify(updatedComments));
    toast.success("Comentário removido!");
  };

  // Handle files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !bonus) return;
    
    const file = e.target.files[0];
    const newFile: BonusFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      description: newFileDescription,
      uploadedAt: new Date()
    };
    
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    localStorage.setItem(`bonus_${id}_files`, JSON.stringify(updatedFiles));
    setNewFileDescription("");
    
    // Clear file input
    e.target.value = '';
    
    toast.success("Arquivo adicionado!");
  };
  
  const deleteFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    localStorage.setItem(`bonus_${id}_files`, JSON.stringify(updatedFiles));
    toast.success("Arquivo removido!");
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bonus) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Bônus não encontrado</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/bonus")} 
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhes do Bônus</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{bonus.bonus_id}</CardTitle>
              <CardDescription>
                Visualize e edite os detalhes do bônus
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" /> Salvar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Excluir
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dados" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Dados
              </TabsTrigger>
              <TabsTrigger value="comentarios" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" /> Comentários
              </TabsTrigger>
              <TabsTrigger value="arquivos" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" /> Arquivos
              </TabsTrigger>
            </TabsList>
            
            {/* Aba Dados */}
            <TabsContent value="dados" className="space-y-4">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Nome</label>
                  {isEditing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="max-w-md"
                    />
                  ) : (
                    <p className="text-base">{bonus.name}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Tipo</label>
                    {isEditing ? (
                      <Select value={type} onValueChange={(value) => setType(value as BonusType)}>
                        <SelectTrigger className="max-w-xs">
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Software">Software</SelectItem>
                          <SelectItem value="Sistema">Sistema</SelectItem>
                          <SelectItem value="IA">IA</SelectItem>
                          <SelectItem value="Ebook">Ebook</SelectItem>
                          <SelectItem value="Lista">Lista</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-base">{bonus.type}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Tempo de Acesso</label>
                    {isEditing ? (
                      <Select value={accessPeriod} onValueChange={(value) => setAccessPeriod(value as AccessPeriod)}>
                        <SelectTrigger className="max-w-xs">
                          <SelectValue placeholder="Selecione um período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7 dias">7 dias</SelectItem>
                          <SelectItem value="15 dias">15 dias</SelectItem>
                          <SelectItem value="30 dias">30 dias</SelectItem>
                          <SelectItem value="2 Meses">2 Meses</SelectItem>
                          <SelectItem value="3 Meses">3 Meses</SelectItem>
                          <SelectItem value="6 Meses">6 Meses</SelectItem>
                          <SelectItem value="1 Ano">1 Ano</SelectItem>
                          <SelectItem value="Vitalício">Vitalício</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-base">{bonus.access_period}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Descrição</label>
                  {isEditing ? (
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-base whitespace-pre-wrap">{bonus.description}</p>
                  )}
                </div>
                
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Observações</label>
                  {isEditing ? (
                    <Textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      rows={3}
                      placeholder="Observações opcionais"
                    />
                  ) : (
                    <p className="text-base whitespace-pre-wrap">{bonus.observations || "Nenhuma observação"}</p>
                  )}
                </div>
                
                <div className="grid gap-3">
                  <label className="text-sm font-medium">ID do Bônus</label>
                  <p className="text-base">{bonus.bonus_id}</p>
                </div>
                
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Data de Criação</label>
                  <p className="text-base">
                    {new Date(bonus.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Aba Comentários */}
            <TabsContent value="comentarios" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Adicionar um comentário..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button onClick={addComment} className="self-start">
                    Adicionar
                  </Button>
                </div>
                
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{comment.authorName}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <p className="text-base mb-4">{comment.text}</p>
                          <div className="flex justify-between">
                            <Button 
                              variant={comment.userLiked ? "default" : "outline"} 
                              size="sm"
                              onClick={() => handleLikeComment(comment.id)}
                            >
                              {comment.likes} {comment.likes === 1 ? "Curtida" : "Curtidas"}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-1">Excluir</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Aba Arquivos */}
            <TabsContent value="arquivos" className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Adicionar Arquivo</h3>
                    <div className="space-y-2">
                      <Input 
                        type="file" 
                        id="file" 
                        onChange={handleFileUpload}
                      />
                      
                      <Textarea 
                        placeholder="Descrição do arquivo (opcional)" 
                        value={newFileDescription}
                        onChange={(e) => setNewFileDescription(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
                
                {files.length > 0 ? (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <Card key={file.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium mb-1">{file.name}</div>
                              <div className="text-sm text-gray-500 mb-1">
                                {formatFileSize(file.size)} &bull; {new Date(file.uploadedAt).toLocaleDateString()}
                              </div>
                              {file.description && (
                                <p className="text-sm mt-1">{file.description}</p>
                              )}
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteFile(file.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-1">Remover</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Nenhum arquivo adicionado.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusDetail;
