
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  Edit, 
  User as UserIcon,
  MessageSquare,
  FileText 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock de usuários administradores
const adminUsers = [
  { id: 1, name: "Ana Carolina" },
  { id: 2, name: "Pedro Santos" },
  { id: 3, name: "Roberto Silva" },
  { id: 4, name: "Juliana Costa" },
];

// Mock de comentários
const initialComments = [
  { id: 1, user: "Ana Carolina", date: "24/05/2025", text: "Preparei os slides para a apresentação" },
  { id: 2, user: "Pedro Santos", date: "24/05/2025", text: "Vou revisar o material amanhã pela manhã" },
];

// Mock de tarefas para o exemplo
const mockTasks = [
  { 
    id: 1, 
    title: "Reunião com fornecedor", 
    date: "25/05/2025", 
    time: "11:00", 
    priority: "Alta", 
    completed: false, 
    description: "Discutir novos termos de contrato com o fornecedor ABC. Precisamos revisar as cláusulas de entrega e pagamento. Também devemos negociar descontos para pedidos em grande volume.",
    assignedTo: "Ana Carolina",
    location: "Sala de Reuniões 3",
    users: ["Ana Carolina", "Roberto Silva"]
  },
  { 
    id: 2, 
    title: "Revisar propostas", 
    date: "25/05/2025", 
    time: "14:30", 
    priority: "Média", 
    completed: false,
    description: "Revisar propostas comerciais para novos clientes. Verificar se os valores estão de acordo com nossa tabela de preços atual e se as condições de pagamento estão corretas.",
    assignedTo: "Pedro Santos",
    location: "Escritório",
    users: ["Pedro Santos"]
  },
  { 
    id: 3, 
    title: "Call com parceiro", 
    date: "25/05/2025", 
    time: "16:00", 
    priority: "Alta", 
    completed: false,
    description: "Discutir parceria para novo curso. Apresentar nossa proposta de colaboração e ouvir as expectativas do parceiro. Definir próximos passos.",
    assignedTo: "Ana Carolina",
    location: "Videoconferência",
    users: ["Ana Carolina", "Juliana Costa"]
  },
  { 
    id: 4, 
    title: "Preparar material", 
    date: "26/05/2025", 
    time: "09:30", 
    priority: "Baixa", 
    completed: false,
    description: "Preparar material para mentoria em grupo de amanhã. Incluir estudos de caso relevantes e exercícios práticos para os participantes.",
    assignedTo: "Pedro Santos",
    location: "Home Office",
    users: ["Pedro Santos"]
  },
  { 
    id: 5, 
    title: "Revisar feedback dos alunos", 
    date: "26/05/2025", 
    time: "13:00", 
    priority: "Média", 
    completed: true,
    description: "Analisar feedback do último curso para implementar melhorias. Compilar principais pontos de melhoria e apresentar na próxima reunião de equipe.",
    assignedTo: "Ana Carolina",
    location: "Sala de Estudos",
    users: ["Ana Carolina"]
  }
];

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const taskId = parseInt(id);
  
  // Estados
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  
  // Buscar dados da tarefa
  useEffect(() => {
    const foundTask = mockTasks.find(t => t.id === taskId);
    
    if (foundTask) {
      setTask(foundTask);
      setEditedTask({...foundTask});
      setSelectedUsers(foundTask.users || []);
      
      // Filtrar usuários disponíveis (não selecionados)
      updateAvailableUsers(foundTask.users || []);
    } else {
      // Redirecionar se a tarefa não for encontrada
      navigate("/admin/tasks");
    }
  }, [taskId, navigate]);
  
  // Atualizar lista de usuários disponíveis
  const updateAvailableUsers = (selectedUsersList) => {
    const filtered = adminUsers.filter(user => !selectedUsersList.includes(user.name));
    setAvailableUsers(filtered);
  };
  
  // Salvar alterações da tarefa
  const saveTaskChanges = () => {
    setTask({...editedTask, users: selectedUsers});
    setIsEditing(false);
  };
  
  // Adicionar comentário
  const addComment = () => {
    if (newComment.trim() === "") return;
    
    const newCommentObj = {
      id: comments.length + 1,
      user: "Você",
      date: new Date().toLocaleDateString("pt-BR"),
      text: newComment
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment("");
  };
  
  // Adicionar usuário
  const addUser = (userName) => {
    if (!selectedUsers.includes(userName)) {
      const newSelectedUsers = [...selectedUsers, userName];
      setSelectedUsers(newSelectedUsers);
      updateAvailableUsers(newSelectedUsers);
    }
  };
  
  // Remover usuário
  const removeUser = (userName) => {
    const newSelectedUsers = selectedUsers.filter(name => name !== userName);
    setSelectedUsers(newSelectedUsers);
    updateAvailableUsers(newSelectedUsers);
  };
  
  if (!task) {
    return (
      <div className="container mx-auto py-6">
        <p>Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/tasks")}
          >
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-portal-dark">{task.title}</h1>
        </div>
      </div>
      
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="data">
            <FileText className="h-4 w-4 mr-2" /> Dados
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" /> Comentários
          </TabsTrigger>
          <TabsTrigger value="users">
            <UserIcon className="h-4 w-4 mr-2" /> Usuários
          </TabsTrigger>
        </TabsList>
        
        {/* Aba de Dados */}
        <TabsContent value="data">
          <Card>
            <CardHeader className="flex-row justify-between items-center">
              <CardTitle>Detalhes da Tarefa</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={saveTaskChanges}>
                    Salvar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-1">Título</h3>
                    <p className="text-lg">{task.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Local</h3>
                    <p className="text-lg">{task.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Data</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <p className="text-lg">{task.date}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Horário</h3>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <p className="text-lg">{task.time}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Prioridade</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      task.priority === "Alta" ? "bg-red-100 text-red-800" :
                      task.priority === "Média" ? "bg-amber-100 text-amber-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Responsável</h3>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <p className="text-lg">{task.assignedTo}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <h3 className="font-medium mb-1">Descrição</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <Input 
                      value={editedTask.title} 
                      onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Local</label>
                    <Input 
                      value={editedTask.location} 
                      onChange={(e) => setEditedTask({...editedTask, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data</label>
                    <Input 
                      value={editedTask.date} 
                      onChange={(e) => setEditedTask({...editedTask, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Horário</label>
                    <Input 
                      value={editedTask.time} 
                      onChange={(e) => setEditedTask({...editedTask, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prioridade</label>
                    <Select 
                      value={editedTask.priority} 
                      onValueChange={(value) => setEditedTask({...editedTask, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Responsável</label>
                    <Select 
                      value={editedTask.assignedTo} 
                      onValueChange={(value) => setEditedTask({...editedTask, assignedTo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {adminUsers.map(user => (
                          <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Textarea 
                      className="min-h-[150px]"
                      value={editedTask.description} 
                      onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba de Comentários */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Textarea 
                  placeholder="Adicione um comentário..." 
                  className="min-h-[100px] mb-2"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={addComment}>Adicionar Comentário</Button>
              </div>
              
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium flex items-center">
                        <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {comment.user}
                      </div>
                      <div className="text-sm text-gray-500">
                        {comment.date}
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba de Usuários */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Vinculados</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Adicionar novo usuário */}
              <div className="mb-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Adicionar Usuário</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Usuário</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Select onValueChange={addUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.map(user => (
                            <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>Fechar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Lista de usuários */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedUsers.length > 0 ? (
                      selectedUsers.map(user => (
                        <TableRow key={user}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {user}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeUser(user)}
                            >
                              Remover
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                          Nenhum usuário vinculado a esta tarefa.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetail;
