
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, IdCard } from "lucide-react";
import { toast } from "sonner";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CourseForm from "@/components/admin/CourseForm";

export type CourseStatus = "active" | "inactive" | "coming_soon";

export interface Course {
  id: string;
  courseId: string; // Campo ID único
  name: string;
  status: CourseStatus;
  platform: string;
  platformLink: string;
  salesPageLink: string;
  accessPeriod: number; // em dias
  createdAt: Date;
  price: number;
}

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      courseId: "CRS001",
      name: "Curso de E-commerce",
      status: "active",
      platform: "Hotmart",
      platformLink: "https://hotmart.com/curso-ecommerce",
      salesPageLink: "https://minhaloja.com/curso-ecommerce",
      accessPeriod: 365,
      createdAt: new Date(2023, 5, 15),
      price: 997
    },
    {
      id: "2",
      courseId: "CRS002",
      name: "Dropshipping Avançado",
      status: "inactive",
      platform: "Kiwify",
      platformLink: "https://kiwify.com/dropshipping-avancado",
      salesPageLink: "https://minhaloja.com/dropshipping-avancado",
      accessPeriod: 180,
      createdAt: new Date(2024, 1, 10),
      price: 1497
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Função para gerar IDs únicos para cursos
  const generateCourseId = () => {
    const prefix = "CRS";
    const existingIds = courses.map(course => course.courseId);
    let counter = existingIds.length + 1;
    let newId;
    
    do {
      newId = `${prefix}${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(newId));
    
    return newId;
  };

  // Filtrar cursos baseado na pesquisa
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = (newCourse: Omit<Course, "id" | "createdAt" | "courseId">) => {
    const course: Course = {
      ...newCourse,
      id: Date.now().toString(),
      courseId: generateCourseId(),
      createdAt: new Date(),
    };
    
    setCourses([...courses, course]);
    setIsAddDialogOpen(false);
    toast.success("Curso adicionado com sucesso!");
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    setCourseToDelete(null);
    toast.success("Curso removido com sucesso!");
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Cadastro de Cursos</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Cursos</CardTitle>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Adicionar Curso
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Pesquisar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><div className="flex items-center"><IdCard className="mr-1 h-4 w-4" /> ID</div></TableHead>
                  <TableHead>Nome do Curso</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Período de Acesso</TableHead>
                  <TableHead>Preço (R$)</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <TableRow 
                      key={course.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/admin/courses/${course.id}`)}
                    >
                      <TableCell className="font-medium">{course.courseId}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.platform}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(course.status)}`}>
                          {getStatusText(course.status)}
                        </span>
                      </TableCell>
                      <TableCell>{course.accessPeriod} dias</TableCell>
                      <TableCell>{course.price.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCourseToDelete(course.id);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:inline-flex">Excluir</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Nenhum curso encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de adicionar curso */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Curso</DialogTitle>
            <DialogDescription>
              Preencha as informações do curso abaixo.
            </DialogDescription>
          </DialogHeader>
          <CourseForm onSubmit={handleAddCourse} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
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
              onClick={() => setCourseToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => courseToDelete && handleDeleteCourse(courseToDelete)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
