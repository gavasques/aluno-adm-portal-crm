
import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, GraduationCap, Users, Calendar, Calculator, Plus, Clock, DollarSign, BookOpen } from 'lucide-react';
import { useMentoringReadQueries } from '@/features/mentoring/hooks/useMentoringReadQueries';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { calculateEndDate } from '@/utils/mentoringCalculations';

const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno'),
  mentoringId: z.string().min(1, 'Selecione uma mentoria'),
  selectedExtensions: z.array(z.string()).optional(),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().min(1, 'Data de fim é obrigatória'),
  responsibleMentor: z.string().min(1, 'Mentor responsável é obrigatório'),
  observations: z.string().optional()
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  onSubmit: (data: EnrollmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EnrollmentFormData>;
  isLoading?: boolean;
}

const EnrollmentForm = ({ onSubmit, onCancel, initialData, isLoading }: EnrollmentFormProps) => {
  const { useCatalogs } = useMentoringReadQueries();
  const { data: catalogs, isLoading: catalogsLoading, error: catalogsError } = useCatalogs();
  const { students, loading: studentsLoading, searchTerm, setSearchTerm } = useStudentsForEnrollment();
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();
  
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedMentoring, setSelectedMentoring] = useState<any>(null);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('student');

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: initialData?.studentId || '',
      mentoringId: initialData?.mentoringId || '',
      selectedExtensions: initialData?.selectedExtensions || [],
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      responsibleMentor: initialData?.responsibleMentor || '',
      observations: initialData?.observations || ''
    }
  });

  // Filtrar apenas mentorias ativas e individuais
  const activeCatalogs = useMemo(() => {
    if (!catalogs) return [];
    return catalogs.filter(catalog => catalog.active && catalog.type === 'Individual');
  }, [catalogs]);

  // Calcular duração total e data fim automaticamente
  useEffect(() => {
    const startDate = form.watch('startDate');
    
    if (startDate && selectedMentoring) {
      let totalMonths = selectedMentoring.durationMonths;
      
      // Adicionar meses das extensões selecionadas
      if (selectedExtensions.length > 0) {
        selectedExtensions.forEach(extensionId => {
          const extension = selectedMentoring.extensions?.find((ext: any) => ext.id === extensionId);
          if (extension) {
            totalMonths += extension.months;
          }
        });
      }
      
      const calculatedEndDate = calculateEndDate(startDate, totalMonths);
      if (calculatedEndDate) {
        form.setValue('endDate', calculatedEndDate);
      }
    }
  }, [form.watch('startDate'), selectedMentoring, selectedExtensions, form]);

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    form.setValue('studentId', student.id);
    setShowStudentDropdown(false);
    setSearchTerm('');
  };

  const handleMentoringSelect = (mentoringId: string) => {
    const mentoring = activeCatalogs.find(c => c.id === mentoringId);
    setSelectedMentoring(mentoring);
    setSelectedExtensions([]);
    form.setValue('mentoringId', mentoringId);
    form.setValue('selectedExtensions', []);
  };

  const handleExtensionToggle = (extensionId: string) => {
    const newSelections = selectedExtensions.includes(extensionId)
      ? selectedExtensions.filter(id => id !== extensionId)
      : [...selectedExtensions, extensionId];
    
    setSelectedExtensions(newSelections);
    form.setValue('selectedExtensions', newSelections);
  };

  const calculateTotalSessions = () => {
    if (!selectedMentoring) return 0;
    
    let total = selectedMentoring.numberOfSessions || 0;
    
    selectedExtensions.forEach(extensionId => {
      const extension = selectedMentoring.extensions?.find((ext: any) => ext.id === extensionId);
      if (extension) {
        total += extension.totalSessions || 0;
      }
    });
    
    return total;
  };

  const calculateTotalPrice = () => {
    if (!selectedMentoring) return 0;
    
    let total = selectedMentoring.price || 0;
    
    selectedExtensions.forEach(extensionId => {
      const extension = selectedMentoring.extensions?.find((ext: any) => ext.id === extensionId);
      if (extension) {
        total += extension.price || 0;
      }
    });
    
    return total;
  };

  const calculateTotalMonths = () => {
    if (!selectedMentoring) return 0;
    
    let total = selectedMentoring.durationMonths || 0;
    
    selectedExtensions.forEach(extensionId => {
      const extension = selectedMentoring.extensions?.find((ext: any) => ext.id === extensionId);
      if (extension) {
        total += extension.months || 0;
      }
    });
    
    return total;
  };

  const canProceedToNextTab = (currentTab: string) => {
    switch (currentTab) {
      case 'student':
        return selectedStudent && form.watch('responsibleMentor') && form.watch('startDate');
      case 'mentoring':
        return selectedMentoring;
      case 'extensions':
        return true; // Extensões são opcionais
      default:
        return true;
    }
  };

  if (catalogsError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erro ao carregar mentorias</p>
          <p className="text-sm text-gray-500">Tente recarregar a página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Aluno
              </TabsTrigger>
              <TabsTrigger value="mentoring" className="flex items-center gap-2" disabled={!canProceedToNextTab('student')}>
                <BookOpen className="h-4 w-4" />
                Mentoria
              </TabsTrigger>
              <TabsTrigger value="extensions" className="flex items-center gap-2" disabled={!canProceedToNextTab('mentoring')}>
                <Plus className="h-4 w-4" />
                Extensões
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2" disabled={!canProceedToNextTab('extensions')}>
                <Calculator className="h-4 w-4" />
                Resumo
              </TabsTrigger>
            </TabsList>

            {/* Aba: Informações do Aluno */}
            <TabsContent value="student" className="mt-6">
              <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    Informações do Aluno
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Busca de Aluno */}
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Aluno *</FormLabel>
                        <div className="relative">
                          {selectedStudent ? (
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {selectedStudent.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{selectedStudent.name}</p>
                                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudent(null);
                                  form.setValue('studentId', '');
                                }}
                                className="hover:bg-white"
                              >
                                Alterar
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                  placeholder="Buscar aluno por nome ou email..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  onFocus={() => setShowStudentDropdown(true)}
                                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              
                              {showStudentDropdown && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                  {studentsLoading ? (
                                    <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                      Carregando alunos...
                                    </div>
                                  ) : students.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                      {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno disponível'}
                                    </div>
                                  ) : (
                                    students.map((student) => (
                                      <div
                                        key={student.id}
                                        className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                        onClick={() => handleStudentSelect(student)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {student.name.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-600">{student.email}</p>
                                            <Badge variant="outline" className="text-xs mt-1 border-blue-200 text-blue-700">
                                              {student.status}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mentor Responsável */}
                    <FormField
                      control={form.control}
                      name="responsibleMentor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4" />
                            Mentor Responsável *
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={mentorsLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                                <SelectValue placeholder={mentorsLoading ? "Carregando mentores..." : "Selecione um mentor"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mentors.length === 0 ? (
                                <div className="p-3 text-center text-gray-500">
                                  {mentorsLoading ? 'Carregando...' : 'Nenhum mentor encontrado'}
                                </div>
                              ) : (
                                mentors.map((mentor) => (
                                  <SelectItem key={mentor.id} value={mentor.id}>
                                    <div className="flex items-center gap-3 py-1">
                                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                        {mentor.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <span className="font-medium">{mentor.name}</span>
                                        <span className="text-gray-600 text-sm ml-2">({mentor.email})</span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Data de Início */}
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="h-4 w-4" />
                            Data de Início *
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="h-12 border-gray-200 focus:border-blue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('mentoring')}
                      disabled={!canProceedToNextTab('student')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Próximo: Selecionar Mentoria
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba: Seleção de Mentoria */}
            <TabsContent value="mentoring" className="mt-6">
              <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    Seleção de Mentoria
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="mentoringId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Mentoria Individual *</FormLabel>
                        {catalogsLoading ? (
                          <div className="flex items-center justify-center p-8 border rounded-lg">
                            <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
                            <span className="text-gray-600">Carregando mentorias...</span>
                          </div>
                        ) : (
                          <div className="grid gap-4 max-h-96 overflow-y-auto">
                            {activeCatalogs.length === 0 ? (
                              <div className="p-8 text-center text-gray-500">
                                Nenhuma mentoria individual ativa encontrada
                              </div>
                            ) : (
                              activeCatalogs.map((catalog) => (
                                <Card
                                  key={catalog.id}
                                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                                    field.value === catalog.id
                                      ? 'border-green-500 bg-green-50 shadow-md'
                                      : 'border-gray-200 hover:border-green-300'
                                  }`}
                                  onClick={() => handleMentoringSelect(catalog.id)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="font-semibold text-gray-900 text-lg">{catalog.name}</span>
                                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                            {catalog.type}
                                          </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {catalog.durationMonths} meses
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <GraduationCap className="h-4 w-4" />
                                            {catalog.numberOfSessions} sessões
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            R$ {catalog.price?.toFixed(2)}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {catalog.instructor}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{catalog.description}</p>
                                      </div>
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ml-4 ${
                                        field.value === catalog.id
                                          ? 'border-green-500 bg-green-500'
                                          : 'border-gray-300'
                                      }`}>
                                        {field.value === catalog.id && (
                                          <div className="w-3 h-3 rounded-full bg-white" />
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab('student')}
                    >
                      Voltar
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('extensions')}
                      disabled={!canProceedToNextTab('mentoring')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Próximo: Extensões
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba: Extensões */}
            <TabsContent value="extensions" className="mt-6">
              <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Plus className="h-5 w-5 text-orange-600" />
                    Extensões Disponíveis
                    <Badge variant="outline" className="border-orange-200 text-orange-700">
                      Opcional
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {selectedMentoring && selectedMentoring.extensions && selectedMentoring.extensions.length > 0 ? (
                    <div className="grid gap-4 max-h-80 overflow-y-auto">
                      {selectedMentoring.extensions.map((extension: any) => (
                        <Card
                          key={extension.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                            selectedExtensions.includes(extension.id)
                              ? 'border-orange-500 bg-orange-50 shadow-md'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => handleExtensionToggle(extension.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">Extensão de {extension.months} meses</h4>
                                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                                    +{extension.totalSessions} sessões
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <span className="font-medium text-green-600">R$ {extension.price?.toFixed(2)}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {extension.months} meses extras
                                  </span>
                                </div>
                                {extension.description && (
                                  <p className="text-sm text-gray-500">{extension.description}</p>
                                )}
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ml-4 ${
                                selectedExtensions.includes(extension.id)
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedExtensions.includes(extension.id) && (
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {selectedMentoring ? 
                        'Esta mentoria não possui extensões disponíveis' : 
                        'Selecione uma mentoria para ver as extensões disponíveis'
                      }
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab('mentoring')}
                    >
                      Voltar
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('summary')}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Próximo: Resumo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba: Resumo */}
            <TabsContent value="summary" className="mt-6">
              <Card className="border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    Resumo da Inscrição
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {selectedMentoring && (
                    <>
                      {/* Estatísticas */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Duração Total</p>
                          <p className="text-2xl font-bold text-blue-700">{calculateTotalMonths()} meses</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Total de Sessões</p>
                          <p className="text-2xl font-bold text-green-700">{calculateTotalSessions()} sessões</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                          <p className="text-2xl font-bold text-purple-700">R$ {calculateTotalPrice().toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Data de Fim (calculada automaticamente) */}
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <Calculator className="h-4 w-4" />
                                Data de Fim (Calculada)
                              </FormLabel>
                              <FormControl>
                                <Input {...field} disabled className="bg-gray-50 h-12 border-gray-200" />
                              </FormControl>
                              <p className="text-xs text-blue-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Calculada automaticamente com base na duração e extensões
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Observações */}
                        <FormField
                          control={form.control}
                          name="observations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Observações</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Observações sobre a inscrição..." 
                                  className="min-h-20 border-gray-200 focus:border-purple-500 resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab('extensions')}
                        >
                          Voltar
                        </Button>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isLoading || studentsLoading || mentorsLoading || catalogsLoading}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                          >
                            {isLoading ? 'Salvando...' : 'Criar Inscrição'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentForm;
