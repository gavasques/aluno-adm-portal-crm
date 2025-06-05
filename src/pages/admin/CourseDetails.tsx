import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  DollarSign,
  Users,
  BookOpen,
  Globe,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CourseForm from '@/components/admin/CourseForm';
import { Course, CourseStatus } from '@/types/course.types';

// Função auxiliar para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Componente para exibir o status do curso com cores diferentes
const CourseStatusBadge = ({ status }: { status: CourseStatus }) => {
  const statusConfig = {
    active: { label: 'Ativo', variant: 'success' },
    inactive: { label: 'Inativo', variant: 'destructive' },
    coming_soon: { label: 'Em Breve', variant: 'warning' }
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant as any}>{config.label}</Badge>
  );
};

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simulação de carregamento de dados
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // Aqui seria uma chamada real à API
        // const response = await api.get(`/courses/${id}`);
        
        // Dados simulados para demonstração
        setTimeout(() => {
          const mockCourse: Course = {
            id: '1',
            courseId: id || 'CURSO001',
            name: 'Curso Completo de Marketing Digital',
            status: 'active',
            platform: 'Hotmart',
            platformLink: 'https://hotmart.com/curso-marketing',
            salesPageLink: 'https://meusite.com/curso-marketing',
            accessPeriod: 365,
            price: 497.00,
            createdAt: '2023-05-15T10:30:00Z'
          };
          
          setCourse(mockCourse);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Erro ao carregar os dados do curso.');
        setLoading(false);
        console.error('Erro ao buscar curso:', err);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = (data: Omit<Course, "id" | "createdAt" | "courseId">) => {
    // Aqui seria uma chamada real à API para atualizar o curso
    // await api.put(`/courses/${id}`, data);
    
    // Simulação de atualização
    setCourse(prev => {
      if (!prev) return null;
      return { ...prev, ...data };
    });
    
    setIsEditDialogOpen(false);
    toast.success('Curso atualizado com sucesso!');
  };

  const confirmDelete = () => {
    // Aqui seria uma chamada real à API para deletar o curso
    // await api.delete(`/courses/${id}`);
    
    setIsDeleteDialogOpen(false);
    toast.success('Curso excluído com sucesso!');
    navigate('/admin/cursos');
  };

  if (loading) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-500">Carregando informações do curso...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <p className="mt-4 text-gray-500">{error || 'Curso não encontrado'}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/admin/cursos')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para lista de cursos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/admin/cursos')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
            <p className="text-gray-600 mt-1">ID: {course.courseId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Detalhes do Curso */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Detalhes do Curso</CardTitle>
            <CourseStatusBadge status={course.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Informações Básicas</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-500">Nome do curso</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{course.platform}</p>
                    <p className="text-sm text-gray-500">Plataforma de hospedagem</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{course.accessPeriod} dias</p>
                    <p className="text-sm text-gray-500">Período de acesso</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Informações Comerciais</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{formatPrice(course.price)}</p>
                    <p className="text-sm text-gray-500">Preço do curso</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <ShoppingCart className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium flex items-center">
                      <a 
                        href={course.salesPageLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        Página de Vendas
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">Link para compra</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <ExternalLink className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium flex items-center">
                      <a 
                        href={course.platformLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        Acessar na Plataforma
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">Link direto para o curso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Estatísticas */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Estatísticas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Alunos Matriculados</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-2xl font-bold">
                      {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500">Data de Criação</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <BookOpen className="h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Módulos</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <DollarSign className="h-8 w-8 text-yellow-500 mb-2" />
                    <p className="text-2xl font-bold">R$ 0,00</p>
                    <p className="text-sm text-gray-500">Receita Total</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>
          <CourseForm 
            onSubmit={handleSaveEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            initialData={course}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Tem certeza que deseja excluir o curso <strong>{course.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetails;
