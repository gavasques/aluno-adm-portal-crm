
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
  Trash2,
  AlertCircle,
  Building,
  Link,
  MapPin,
  Package,
  Users,
  MessageSquare,
  FileText,
  Paperclip
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
import { Textarea } from "@/components/ui/textarea";
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

// Import shared student data
import { 
  STUDENTS, 
  AVAILABLE_COURSES, 
  AVAILABLE_MENTORSHIPS, 
  AVAILABLE_BONUSES,
  BRAZILIAN_STATES,
  COMMUNICATION_CHANNELS
} from "@/data/students";

// Form schemas
const editStudentSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  status: z.string(),
  observations: z.string().optional(),
  // Novos campos
  company: z.string().optional(),
  amazonStoreLink: z.string().optional(),
  studentState: z.string().optional(),
  companyState: z.string().optional(),
  usesFBA: z.string().optional()
});

const addItemSchema = z.object({
  itemId: z.string().min(1, { message: "Selecione um item" })
});

const addPartnerSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  observations: z.string().optional()
});

const addCommunicationSchema = z.object({
  channel: z.string().min(1, { message: "Canal de comunicação é obrigatório" }),
  message: z.string().min(1, { message: "Mensagem é obrigatória" }),
  attachment: z.any().optional() // Para o anexo de arquivo
});

const addFileSchema = z.object({
  name: z.string().min(1, { message: "Nome do arquivo é obrigatório" }),
  file: z.any().refine(file => file && file instanceof File, { message: "Arquivo é obrigatório" })
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
  
  // Novos estados para os novos diálogos
  const [showAddPartnerDialog, setShowAddPartnerDialog] = useState(false);
  const [showAddCommunicationDialog, setShowAddCommunicationDialog] = useState(false);
  const [showAddFileDialog, setShowAddFileDialog] = useState(false);
  const [expandedCommunication, setExpandedCommunication] = useState(null);
  
  const editForm = useForm({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "",
      observations: "",
      company: "",
      amazonStoreLink: "",
      studentState: "",
      companyState: "",
      usesFBA: ""
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

  // Novos formulários para as novas funcionalidades
  const addPartnerForm = useForm({
    resolver: zodResolver(addPartnerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      observations: ""
    }
  });

  const addCommunicationForm = useForm({
    resolver: zodResolver(addCommunicationSchema),
    defaultValues: {
      channel: "",
      message: "",
      attachment: null
    }
  });

  const addFileForm = useForm({
    resolver: zodResolver(addFileSchema),
    defaultValues: {
      name: "",
      file: null
    }
  });

  useEffect(() => {
    console.log("Fetching student with ID:", id);
    // Simulate API fetch - ensuring we're comparing numbers with numbers
    const studentId = parseInt(id, 10);
    console.log("Parsed student ID:", studentId, "Type:", typeof studentId);
    
    const foundStudent = STUDENTS.find(s => s.id === studentId);
    console.log("Found student:", foundStudent);
    
    if (foundStudent) {
      setStudent(foundStudent);
      // Set form default values
      editForm.reset({
        name: foundStudent.name,
        email: foundStudent.email,
        phone: foundStudent.phone,
        status: foundStudent.status,
        observations: foundStudent.observations || "",
        company: foundStudent.company || "",
        amazonStoreLink: foundStudent.amazonStoreLink || "",
        studentState: foundStudent.studentState || "",
        companyState: foundStudent.companyState || "",
        usesFBA: foundStudent.usesFBA || ""
      });
    } else {
      toast({
        title: "Erro",
        description: `Aluno com ID ${id} não encontrado`,
        variant: "destructive"
      });
      // Give a short delay before navigating back
      setTimeout(() => {
        navigate("/admin/gestao-alunos");
      }, 1500);
    }
    
    setLoading(false);
  }, [id, navigate, editForm]);

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

  // Novas funções para manipulação de sócios, comunicações e arquivos
  const handleAddPartner = (data) => {
    if (student) {
      const newPartner = {
        id: student.partners.length > 0 ? Math.max(...student.partners.map(p => p.id)) + 1 : 1,
        ...data
      };
      
      const updatedStudent = {
        ...student,
        partners: [...student.partners, newPartner]
      };
      
      setStudent(updatedStudent);
      
      toast({
        title: "Sócio adicionado",
        description: `${data.name} foi adicionado como sócio com sucesso.`
      });
      
      setShowAddPartnerDialog(false);
      addPartnerForm.reset();
    }
  };

  const handleDeletePartner = (partnerId) => {
    if (student) {
      const updatedPartners = student.partners.filter(partner => partner.id !== partnerId);
      const updatedStudent = {
        ...student,
        partners: updatedPartners
      };
      
      setStudent(updatedStudent);
      
      toast({
        title: "Sócio removido",
        description: "O sócio foi removido com sucesso."
      });
    }
  };

  const handleAddCommunication = (data) => {
    if (student) {
      const today = new Date();
      const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      
      const newCommunication = {
        id: student.communications.length > 0 ? Math.max(...student.communications.map(c => c.id)) + 1 : 1,
        channel: data.channel,
        date: formattedDate,
        message: data.message,
        attachments: data.attachment ? [data.attachment.name] : []
      };
      
      const updatedStudent = {
        ...student,
        communications: [...student.communications, newCommunication]
      };
      
      setStudent(updatedStudent);
      
      toast({
        title: "Comunicação registrada",
        description: "A comunicação foi registrada com sucesso."
      });
      
      setShowAddCommunicationDialog(false);
      addCommunicationForm.reset();
    }
  };

  const handleDeleteCommunication = (communicationId) => {
    if (student) {
      const updatedCommunications = student.communications.filter(
        communication => communication.id !== communicationId
      );
      const updatedStudent = {
        ...student,
        communications: updatedCommunications
      };
      
      setStudent(updatedStudent);
      
      toast({
        title: "Comunicação removida",
        description: "A comunicação foi removida com sucesso."
      });
    }
  };

  const handleAddFile = (data) => {
    if (student) {
      const today = new Date();
      const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      
      const newFile = {
        id: student.files.length > 0 ? Math.max(...student.files.map(f => f.id)) + 1 : 1,
        name: data.name,
        file: data.file.name,
        uploadDate: formattedDate
      };
      
      const updatedStudent = {
        ...student,
        files: [...student.files, newFile]
      };
      
      setStudent(updatedStudent);
      
      toast({
        title: "Arquivo adicionado",
        description: `${data.name} foi adicionado com sucesso.`
      });
      
      setShowAddFileDialog(false);
      addFileForm.reset();
    }
  };

  const handleDeleteFile = (fileId) => {
    if (student) {
      const updatedFiles = student.files.filter(file => file.id !== fileId);
      const updatedStudent = {
        ...student,
        files: updatedFiles
      };
      
      setStudent(updatedStudent);
      
      toast({
        title: "Arquivo removido",
        description: "O arquivo foi removido com sucesso."
      });
    }
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
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Aluno não encontrado</h2>
              <p className="text-gray-500 mb-4">O aluno com ID {id} não existe ou foi removido.</p>
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
            <TabsList className="w-full grid grid-cols-7">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="courses">Cursos</TabsTrigger>
              <TabsTrigger value="mentorships">Mentorias</TabsTrigger>
              <TabsTrigger value="bonuses">Bônus</TabsTrigger>
              <TabsTrigger value="partners">Sócios</TabsTrigger>
              <TabsTrigger value="communications">Comunicações</TabsTrigger>
              <TabsTrigger value="files">Arquivos</TabsTrigger>
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

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Empresa</h3>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{student.company || "Não informado"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Link da Loja na Amazon</h3>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                      {student.amazonStoreLink ? (
                        <a href={student.amazonStoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {student.amazonStoreLink}
                        </a>
                      ) : (
                        <p>Não informado</p>
                      )}
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

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Estado do Aluno</h3>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{student.studentState || "Não informado"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Estado da Empresa</h3>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{student.companyState || "Não informado"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Trabalha com FBA</h3>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{student.usesFBA || "Não informado"}</p>
                    </div>
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

            {/* Partners Tab */}
            <TabsContent value="partners" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sócios</h3>
                <Button onClick={() => setShowAddPartnerDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar Sócio
                </Button>
              </div>
              
              {student.partners && student.partners.length > 0 ? (
                <div className="space-y-3">
                  {student.partners.map((partner) => (
                    <div key={partner.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                          <h4 className="font-medium">{partner.name}</h4>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Email:</p>
                          <p>{partner.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone:</p>
                          <p>{partner.phone}</p>
                        </div>
                      </div>
                      
                      {partner.observations && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">Observações:</p>
                          <p className="bg-gray-50 p-2 rounded-md mt-1">{partner.observations}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Nenhum sócio cadastrado.</p>
              )}
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Histórico de Comunicações</h3>
                <Button onClick={() => setShowAddCommunicationDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar Comunicação
                </Button>
              </div>
              
              {student.communications && student.communications.length > 0 ? (
                <div className="space-y-3">
                  {student.communications.map((communication) => (
                    <div 
                      key={communication.id} 
                      className="p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedCommunication(expandedCommunication === communication.id ? null : communication.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{communication.channel}</h4>
                            <p className="text-xs text-muted-foreground">{communication.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {communication.attachments && communication.attachments.length > 0 && (
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCommunication(communication.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className={expandedCommunication === communication.id ? "" : "line-clamp-1"}>
                          {communication.message}
                        </p>
                      </div>
                      
                      {communication.attachments && communication.attachments.length > 0 && expandedCommunication === communication.id && (
                        <div className="mt-3 border-t pt-2">
                          <p className="text-sm font-medium mb-1">Anexos:</p>
                          {communication.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center">
                              <FileText className="h-4 w-4 mr-1.5 text-muted-foreground" />
                              <span className="text-sm">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Nenhuma comunicação registrada.</p>
              )}
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Arquivos</h3>
                <Button onClick={() => setShowAddFileDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar Arquivo
                </Button>
              </div>
              
              {student.files && student.files.length > 0 ? (
                <div className="space-y-2">
                  {student.files.map((file) => (
                    <div key={file.id} className="p-3 border rounded-md flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">Adicionado em: {file.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => {
                            // Simulação de download
                            toast({
                              title: "Download iniciado",
                              description: `Baixando ${file.file}...`
                            });
                          }}
                        >
                          Baixar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Nenhum arquivo cadastrado.</p>
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

              {/* Novos campos */}
              <FormField
                control={editForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="amazonStoreLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da Loja na Amazon</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="studentState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado do Aluno</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="companyState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado da Empresa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="usesFBA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trabalha com FBA</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sim">Sim</SelectItem>
                        <SelectItem value="Não">Não</SelectItem>
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
                      <Textarea {...field} rows={3} />
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

      {/* Add Partner Dialog */}
      <Dialog open={showAddPartnerDialog} onOpenChange={setShowAddPartnerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Sócio</DialogTitle>
            <DialogDescription>
              Preencha os dados do sócio que deseja adicionar.
            </DialogDescription>
          </DialogHeader>

          <Form {...addPartnerForm}>
            <form onSubmit={addPartnerForm.handleSubmit(handleAddPartner)} className="space-y-4">
              <FormField
                control={addPartnerForm.control}
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
                control={addPartnerForm.control}
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
                control={addPartnerForm.control}
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
                control={addPartnerForm.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowAddPartnerDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar Sócio</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Communication Dialog */}
      <Dialog open={showAddCommunicationDialog} onOpenChange={setShowAddCommunicationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Comunicação</DialogTitle>
            <DialogDescription>
              Registre uma nova comunicação com o aluno.
            </DialogDescription>
          </DialogHeader>

          <Form {...addCommunicationForm}>
            <form onSubmit={addCommunicationForm.handleSubmit(handleAddCommunication)} className="space-y-4">
              <FormField
                control={addCommunicationForm.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canal de Comunicação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um canal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMMUNICATION_CHANNELS.map((channel) => (
                          <SelectItem key={channel} value={channel}>
                            {channel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addCommunicationForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addCommunicationForm.control}
                name="attachment"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Anexo (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        {...field} 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowAddCommunicationDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar Comunicação</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add File Dialog */}
      <Dialog open={showAddFileDialog} onOpenChange={setShowAddFileDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Arquivo</DialogTitle>
            <DialogDescription>
              Adicione um novo arquivo relacionado ao aluno.
            </DialogDescription>
          </DialogHeader>

          <Form {...addFileForm}>
            <form onSubmit={addFileForm.handleSubmit(handleAddFile)} className="space-y-4">
              <FormField
                control={addFileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Arquivo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addFileForm.control}
                name="file"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Arquivo</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        {...field} 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowAddFileDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar Arquivo</Button>
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

