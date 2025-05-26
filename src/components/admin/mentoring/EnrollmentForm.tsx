
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Search, User, GraduationCap, Users } from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { useStudentsForEnrollment } from '@/hooks/admin/useStudentsForEnrollment';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';

const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno'),
  mentoringId: z.string().min(1, 'Selecione uma mentoria'),
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

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: initialData?.studentId || '',
      mentoringId: initialData?.mentoringId || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      responsibleMentor: initialData?.responsibleMentor || '',
      observations: initialData?.observations || ''
    }
  });

  // Filtrar apenas mentorias ativas
  const activeCatalogs = useMemo(() => {
    return catalogs.filter(catalog => catalog.active);
  }, [catalogs]);

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    form.setValue('studentId', student.id);
    setShowStudentDropdown(false);
    setSearchTerm('');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Busca de Aluno */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Aluno *
              </FormLabel>
              <div className="relative">
                {selectedStudent ? (
                  <div className="flex items-center justify-between p-3 border rounded-md bg-blue-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {selectedStudent.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{selectedStudent.name}</p>
                        <p className="text-xs text-gray-600">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(null);
                        form.setValue('studentId', '');
                      }}
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
                        className="pl-10"
                      />
                    </div>
                    
                    {showStudentDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {studentsLoading ? (
                          <div className="p-3 text-center text-gray-500">
                            Carregando alunos...
                          </div>
                        ) : students.length === 0 ? (
                          <div className="p-3 text-center text-gray-500">
                            {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno disponível'}
                          </div>
                        ) : (
                          students.map((student) => (
                            <div
                              key={student.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleStudentSelect(student)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{student.name}</p>
                                  <p className="text-xs text-gray-600">{student.email}</p>
                                  <Badge variant="outline" className="text-xs mt-1">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mentoria */}
          <FormField
            control={form.control}
            name="mentoringId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Mentoria *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma mentoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activeCatalogs.length === 0 ? (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Nenhuma mentoria ativa encontrada
                      </div>
                    ) : (
                      activeCatalogs.map((catalog) => (
                        <SelectItem key={catalog.id} value={catalog.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{catalog.name}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Badge variant="outline" className="text-xs">
                                {catalog.type}
                              </Badge>
                              <span>{catalog.durationMonths} {catalog.durationMonths === 1 ? 'mês' : 'meses'}</span>
                              <span>R$ {catalog.price.toFixed(2)}</span>
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

          {/* Mentor Responsável */}
          <FormField
            control={form.control}
            name="responsibleMentor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Mentor Responsável *
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={mentorsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
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
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
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
                  <p className="text-sm text-amber-600">
                    Nenhum mentor encontrado. Marque usuários como mentores na gestão de usuários.
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Datas */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Fim *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Observações */}
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações sobre a inscrição..." 
                  className="min-h-20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || studentsLoading || mentorsLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnrollmentForm;
