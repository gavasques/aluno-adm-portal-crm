
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
import { Search, User, GraduationCap, Users, Calendar, Calculator, Plus, Clock, DollarSign } from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
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
  const { catalogs } = useMentoring();
  const { students, loading: studentsLoading, searchTerm, setSearchTerm } = useStudentsForEnrollment();
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedMentoring, setSelectedMentoring] = useState<any>(null);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);

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
    return catalogs.filter(catalog => catalog.active && catalog.type === 'Individual');
  }, [catalogs]);

  // Calcular duração total e data fim automaticamente
  useEffect(() => {
    const startDate = form.watch('startDate');
    const mentoringId = form.watch('mentoringId');
    
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basico" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger value="mentoria" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Mentoria
              </TabsTrigger>
              <TabsTrigger value="resumo" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Resumo
              </TabsTrigger>
            </TabsList>

            {/* Aba 1: Dados Básicos */}
            <TabsContent value="basico" className="space-y-6">
              <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    Informações do Aluno
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
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
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-md">
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
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
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
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                        onClick={() => handleStudentSelect(student)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {student.name.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-600">{student.email}</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
                                <div className="p-3 text-center text-gray-500 text-sm">
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
                          {mentors.length === 0 && !mentorsLoading && (
                            <p className="text-sm text-amber-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Nenhum mentor encontrado. Configure mentores na gestão de usuários.
                            </p>
                          )}
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba 2: Mentoria */}
            <TabsContent value="mentoria" className="space-y-6">
              <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    Seleção de Mentoria
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Mentoria */}
                  <FormField
                    control={form.control}
                    name="mentoringId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Mentoria Individual *</FormLabel>
                        <Select onValueChange={handleMentoringSelect} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-green-500">
                              <SelectValue placeholder="Selecione uma mentoria individual" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-80">
                            {activeCatalogs.length === 0 ? (
                              <div className="p-4 text-center text-gray-500 text-sm">
                                Nenhuma mentoria individual ativa encontrada
                              </div>
                            ) : (
                              activeCatalogs.map((catalog) => (
                                <SelectItem key={catalog.id} value={catalog.id} className="p-4">
                                  <div className="flex flex-col space-y-2 w-full">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-gray-900">{catalog.name}</span>
                                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                        {catalog.type}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {catalog.durationMonths} meses
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {catalog.frequency}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        {catalog.numberOfSessions} sessões
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        R$ {catalog.price.toFixed(2)}
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{catalog.description}</p>
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

                  {/* Extensões (se disponíveis) */}
                  {selectedMentoring && selectedMentoring.extensions && selectedMentoring.extensions.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Plus className="h-4 w-4 text-orange-600" />
                        <h3 className="font-medium text-gray-900">Extensões Disponíveis</h3>
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                          Opcional
                        </Badge>
                      </div>
                      <div className="grid gap-3">
                        {selectedMentoring.extensions.map((extension: any) => (
                          <Card
                            key={extension.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedExtensions.includes(extension.id)
                                ? 'border-orange-500 bg-orange-50 shadow-sm'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                            onClick={() => handleExtensionToggle(extension.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-gray-900">Extensão de {extension.months} meses</h4>
                                    <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                                      +{extension.totalSessions} sessões
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium text-green-600">R$ {extension.price.toFixed(2)}</span>
                                  </p>
                                  {extension.description && (
                                    <p className="text-xs text-gray-500">{extension.description}</p>
                                  )}
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  selectedExtensions.includes(extension.id)
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedExtensions.includes(extension.id) && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba 3: Resumo */}
            <TabsContent value="resumo" className="space-y-6">
              {selectedMentoring && (
                <Card className="border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calculator className="h-5 w-5 text-purple-600" />
                      Resumo da Inscrição
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Duração Total</p>
                        <p className="text-xl font-bold text-blue-700">
                          {selectedMentoring.durationMonths + selectedExtensions.reduce((acc, extId) => {
                            const ext = selectedMentoring.extensions?.find((e: any) => e.id === extId);
                            return acc + (ext?.months || 0);
                          }, 0)} meses
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Total de Sessões</p>
                        <p className="text-xl font-bold text-green-700">{calculateTotalSessions()} sessões</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                        <p className="text-xl font-bold text-purple-700">R$ {calculateTotalPrice().toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className="min-h-20 border-gray-200 focus:border-purple-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel} className="px-6">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || studentsLoading || mentorsLoading}
              className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLoading ? 'Salvando...' : 'Criar Inscrição'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentForm;
