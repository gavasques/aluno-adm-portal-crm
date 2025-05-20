import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  CalendarDays, 
  Edit, 
  PlusCircle, 
  ArrowLeft, 
  Trash2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample students data (should be replaced with actual data fetching)
const STUDENTS = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    phone: "(11) 98765-4321",
    registrationDate: "15/03/2023",
    status: "Ativo",
    lastLogin: "Hoje, 10:45",
    courses: ["Curso Básico de E-commerce", "Mentoria Individual"],
    mentorships: ["Mentoria Individual", "Mentoria em Grupo"],
    bonuses: ["E-book de E-commerce", "Planilha de Controle"],
    observations: "Cliente interessado em expandir para marketplace."
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    phone: "(21) 97654-3210",
    registrationDate: "22/05/2023",
    status: "Ativo",
    lastLogin: "Ontem, 15:30",
    courses: ["Curso Avançado de E-commerce"],
    mentorships: [],
    bonuses: ["Planilha de Controle"],
    observations: ""
  },
  // ... other students
];

// Sample data for courses, mentorships, and bonuses
const AVAILABLE_COURSES = [
  { id: 1, name: "Curso Básico de E-commerce", price: "R$ 497,00" },
  { id: 2, name: "Curso Avançado de E-commerce", price: "R$ 997,00" },
  { id: 3, name: "Mentoria Individual", price: "R$ 1.997,00" },
  { id: 4, name: "Curso de Marketing Digital", price: "R$ 697,00" }
];

const AVAILABLE_MENTORSHIPS = [
  { id: 1, name: "Mentoria Individual", sessions: 4, price: "R$ 1.997,00" },
  { id: 2, name: "Mentoria em Grupo", sessions: 8, price: "R$ 997,00" },
  { id: 3, name: "Mentoria Avançada", sessions: 6, price: "R$ 2.497,00" }
];

const AVAILABLE_BONUSES = [
  { id: 1, name: "E-book de E-commerce", type: "Digital" },
  { id: 2, name: "Planilha de Controle", type: "Digital" },
  { id: 3, name: "Templates de E-commerce", type: "Digital" },
  { id: 4, name: "Acesso à Comunidade VIP", type: "Serviço" }
];

// Form schemas
const editStudentSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  status: z.string(),
  observations: z.string().optional()
});

const addItemSchema = z.object({
  itemId: z.string().min(1, { message: "Selecione um item" })
});

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
  const [showAddMentorshipDialog, setShowAddMentorshipDialog] = useState(false);
  const [showAddBonusDialog, setShowAddBonusDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const editForm = useForm({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "",
      observations: ""
    }
  });

  const addCourseForm = useForm({
    resolver: zodResolver(addItemSchema),
    defaultValues: { itemId: "" }
  });

  const addMentorshipForm = useForm({
    resolver: zodResolver(addItemSchema),
    defaultValues: { itemId: "" }
  });

  const addBonusForm = useForm({
    resolver: zodResolver(addItemSchema),
    defaultValues: { itemId: "" }
  });

  useEffect(() => {
    // Simulate API fetch
    const studentId = parseInt(id, 10);
    const foundStudent = STUDENTS.find(s => s.id === studentId);
    
    if (foundStudent) {
      setStudent(foundStudent);
      // Set form default values
      editForm.reset({
        name: foundStudent.name,
        email: foundStudent.email,
        phone: foundStudent.phone,
        status: foundStudent.status,
        observations: foundStudent.observations || ""
      });
    } else {
      toast({
        title: "Erro",
        description: "Aluno não encontrado",
        variant: "destructive"
      });
      navigate("/admin/gestao-alunos");
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleEditSubmit = (data) => {
    // Update student data
    if (student) {
      const updatedStudent = { ...student, ...data };
      setStudent(updatedStudent);
      
      toast({
        title: "Alterações salvas",
        description: "Os dados do aluno foram atualizados com sucesso."
      });
      
      setShowEditDialog(false);
    }
  };

  const handleAddCourse = (data) => {
    const courseId = parseInt(data.itemId, 10);
    const courseToAdd = AVAILABLE_COURSES.find(c => c.id === courseId);
    
    if (courseToAdd && student) {
      // Check if course already exists
      if (!student.courses.includes(courseToAdd.name)) {
        const updatedStudent = {
          ...student,
          courses: [...student.courses, courseToAdd.name]
        };
        setStudent(updatedStudent);
        
        toast({
          title: "Curso adicionado",
          description: `${courseToAdd.name} foi adicionado com sucesso.`
        });
      } else {
        toast({
          title: "Curso já existe",
          description: "Este curso já foi adicionado para este aluno.",
          variant: "destructive"
        });
      }
    }
    
    setShowAddCourseDialog(false);
    addCourseForm.reset();
  };

  const handleAddMentorship = (data) => {
    const mentorshipId = parseInt(data.itemId, 10);
    const mentorshipToAdd = AVAILABLE_MENTORSHIPS.find(m => m.id === mentorshipId);
    
    if (mentorshipToAdd && student) {
      // Check if mentorship already exists
      if (!student.mentorships.includes(mentorshipToAdd.name)) {
        const updatedStudent = {
          ...student,
          mentorships: [...student.mentorships, mentorshipToAdd.name]
        };
        setStudent(updatedStudent);
        
        toast({
          title: "Mentoria adicionada",
          description: `${mentorshipToAdd.name} foi adicionada com sucesso.`
        });
      } else {
        toast({
          title: "Mentoria já existe",
          description: "Esta mentoria já foi adicionada para este aluno.",
          variant: "destructive"
        });
      }
    }
    
    setShowAddMentorshipDialog(false);
    addMentorshipForm.reset();
  };

  const handleAddBonus = (data) => {
    const bonusId = parseInt(data.itemId, 10);
    const bonusToAdd = AVAILABLE_BONUSES.find(b => b.id === bonusId);
    
    if (bonusToAdd && student) {
      // Check if bonus already exists
      if (!student.bonuses.includes(bonusToAdd.name)) {
        const updatedStudent = {
          ...student,
          bonuses: [...student.bonuses, bonusToAdd.name]
        };
        setStudent(updatedStudent);
        
        toast({
          title: "Bônus adicionado",
          description: `${bonusToAdd.name} foi adicionado com sucesso.`
        });
      } else {
        toast({
          title: "Bônus já existe",
          description: "Este bônus já foi adicionado para este aluno.",
          variant: "destructive"
        });
      }
    }
    
    setShowAddBonusDialog(false);
    addBonusForm.reset();
  };

  const handleDeleteItem = (type, itemName) => {
    if (student) {
      let updatedItems;
      let itemType;
      
      switch(type) {
        case 'course':
          updatedItems = student.courses.filter(course => course !== itemName);
          itemType = "Curso";
          setStudent({ ...student, courses: updatedItems });
          break;
        case 'mentorship':
          updatedItems = student.mentorships.filter(mentorship => mentorship !== itemName);
          itemType = "Mentoria";
          setStudent({ ...student, mentorships: updatedItems });
          break;
        case 'bonus':
          updatedItems = student.bonuses.filter(bonus => bonus !== itemName);
          itemType = "Bônus";
          setStudent({ ...student, bonuses: updatedItems });
          break;
        default:
          return;
      }
      
      toast({
        title: `${itemType} removido`,
        description: `${itemName} foi removido com sucesso.`
      });
    }
  };

  const confirmDeleteStudent = () => {
    toast({
      title: "Aluno excluído",
      description: `O aluno ${student.name} foi excluído com sucesso.`
    });
    navigate("/admin/gestao-alunos");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Aluno não encontrado</h2>
              <p className="text-gray-500 mb-4">O aluno que você está procurando não existe.</p>
              <Button onClick={() => navigate("/admin/gestao-alunos")}>
                Voltar para a lista
              </Button>
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
          onClick={() => navigate("/admin/gestao-alunos")}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-portal-dark">Detalhes do Aluno</h1>
        <div className="ml-auto">
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir Aluno
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <User className="mr-2 h-5 w-5" /> 
            {student.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="courses">Cursos</TabsTrigger>
              <TabsTrigger value="mentorships">Mentorias</TabsTrigger>
              <TabsTrigger value="bonuses">Bônus</TabsTrigger>
            </TabsList>
            
            {/* Student Info Tab */}
            <TabsContent value="info" className="pt-4">
              <div className="flex justify-between items-start mb-4">
                <div className="text-lg font-semibold">Dados Pessoais</div>
                <Button onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Email</h3>
                    <p>{student.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Telefone</h3>
                    <p>{student.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Data de Registro</h3>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{student.registrationDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Status</h3>
                    <div className="flex items-center">
                      <Badge 
                        variant={student.status === "Ativo" ? "default" : student.status === "Pendente" ? "secondary" : "outline"}
                        className={
                          student.status === "Ativo" 
                            ? "bg-green-500" 
                            : student.status === "Pendente" 
                              ? "bg-yellow-500" 
                              : "bg-gray-500"
                        }
                      >
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Último Acesso</h3>
                    <p>{student.lastLogin}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Observações</h3>
                <div className="bg-gray-50 p-3 rounded-md min-h-[100px]">
                  {student.observations ? (
                    <p>{student.observations}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Sem observações.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Courses Tab */}
            <TabsContent value="courses" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cursos Adquiridos</h3>
                <Button onClick={() => setShowAddCourseDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar Curso
                </Button>
              </div>
              
              {student.courses && student.courses.length > 0 ? (
                <div className="space-y-2">
                  {student.courses.map((course, index) => {
                    const courseDetails = AVAILABLE_COURSES.find(c => c.name === course);
                    return (
                      <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{course}</p>
                          {courseDetails && (
                            <p className="text-sm text-muted-foreground">Valor: {courseDetails.price}</p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteItem("course", course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Nenhum curso adquirido.</p>
              )}
            </TabsContent>

            {/* Mentorships Tab */}
            <TabsContent value="mentorships" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Mentorias Vinculadas</h3>
                <Button onClick={() => setShowAddMentorshipDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar Mentoria
                </Button>
              </div>
              
              {student.mentorships && student.mentorships.length > 0 ? (
                <div className="space-y-2">
                  {student.mentorships.map((mentorship, index) => {
                    const mentorshipDetails = AVAILABLE_MENTORSHIPS.find(m => m.name === mentorship);
                    return (
                      <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{mentorship}</p>
                          {mentorshipDetails && (
                            <p className="text-sm text-muted-foreground">
                              {mentorshipDetails.sessions} sessões | Valor: {mentorshipDetails.price}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteItem("mentorship", mentorship)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Nenhuma mentoria vinculada.</p>
              )}
            </TabsContent>

            {/* Bonuses Tab */}
            <TabsContent value="bonuses" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Bônus Vinculados</h3>
                <Button onClick={() => setShowAddBonusDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar Bônus
                </Button>
              </div>
              
              {student.bonuses && student.bonuses.length > 0 ? (
                <div className="space-y-2">
                  {student.bonuses.map((bonus, index) => {
                    const bonusDetails = AVAILABLE_BONUSES.find(b => b.name === bonus);
                    return (
                      <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{bonus}</p>
                          {bonusDetails && (
                            <p className="text-sm text-muted-foreground">
                              Tipo: {bonusDetails.type}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteItem("bonus", bonus)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Nenhum bônus vinculado.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/admin/gestao-alunos")}>
            Voltar para a lista
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias e clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowEditDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={showAddCourseDialog} onOpenChange={setShowAddCourseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Curso</DialogTitle>
            <DialogDescription>
              Selecione um curso para adicionar ao aluno.
            </DialogDescription>
          </DialogHeader>

          <Form {...addCourseForm}>
            <form onSubmit={addCourseForm.handleSubmit(handleAddCourse)} className="space-y-4">
              <FormField
                control={addCourseForm.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um curso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_COURSES.map(course => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.name} ({course.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowAddCourseDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Mentorship Dialog */}
      <Dialog open={showAddMentorshipDialog} onOpenChange={setShowAddMentorshipDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Mentoria</DialogTitle>
            <DialogDescription>
              Selecione uma mentoria para adicionar ao aluno.
            </DialogDescription>
          </DialogHeader>

          <Form {...addMentorshipForm}>
            <form onSubmit={addMentorshipForm.handleSubmit(handleAddMentorship)} className="space-y-4">
              <FormField
                control={addMentorshipForm.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma mentoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_MENTORSHIPS.map(mentorship => (
                          <SelectItem key={mentorship.id} value={String(mentorship.id)}>
                            {mentorship.name} ({mentorship.sessions} sessões)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowAddMentorshipDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Bonus Dialog */}
      <Dialog open={showAddBonusDialog} onOpenChange={setShowAddBonusDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Bônus</DialogTitle>
            <DialogDescription>
              Selecione um bônus para adicionar ao aluno.
            </DialogDescription>
          </DialogHeader>

          <Form {...addBonusForm}>
            <form onSubmit={addBonusForm.handleSubmit(handleAddBonus)} className="space-y-4">
              <FormField
                control={addBonusForm.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bônus</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um bônus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_BONUSES.map(bonus => (
                          <SelectItem key={bonus.id} value={String(bonus.id)}>
                            {bonus.name} ({bonus.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowAddBonusDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <Trash2 className="mr-2 h-5 w-5" /> 
              Excluir Aluno
            </DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir este aluno?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 border-y">
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStudent}>
              Sim, excluir aluno
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDetail;
