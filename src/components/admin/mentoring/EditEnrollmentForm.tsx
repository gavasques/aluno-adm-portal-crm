
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, Users, Calendar, AlertCircle } from 'lucide-react';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

const editEnrollmentSchema = z.object({
  responsibleMentor: z.string().min(1, 'Mentor responsável é obrigatório'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().min(1, 'Data de fim é obrigatória'),
  status: z.enum(['ativa', 'concluida', 'cancelada', 'pausada'], {
    required_error: 'Status é obrigatório'
  }),
  observations: z.string().optional()
});

type EditEnrollmentFormData = z.infer<typeof editEnrollmentSchema>;

interface EditEnrollmentFormProps {
  enrollment: StudentMentoringEnrollment;
  onSubmit: (data: EditEnrollmentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EditEnrollmentForm = ({ enrollment, onSubmit, onCancel, isLoading }: EditEnrollmentFormProps) => {
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();

  const form = useForm<EditEnrollmentFormData>({
    resolver: zodResolver(editEnrollmentSchema),
    defaultValues: {
      responsibleMentor: enrollment.responsibleMentor,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      status: enrollment.status,
      observations: enrollment.observations || ''
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações não editáveis */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-gray-900 mb-3">Informações da Inscrição</h3>
        
        {/* Aluno */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-sm">Bianca Mentora</span>
            </div>
            <p className="text-xs text-gray-500">bianca.c.arantes@gmail.com</p>
          </div>
          <Badge variant="outline" className="ml-auto">Não editável</Badge>
        </div>

        {/* Mentoria */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{enrollment.mentoring.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{enrollment.mentoring.type}</Badge>
              <span className="text-xs text-gray-500">{enrollment.mentoring.durationMonths} {enrollment.mentoring.durationMonths === 1 ? 'mês' : 'meses'}</span>
              <span className="text-xs text-gray-500">R$ {enrollment.mentoring.price.toFixed(2)}</span>
            </div>
          </div>
          <Badge variant="outline">Não editável</Badge>
        </div>
      </div>

      {/* Formulário editável */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informações Editáveis
            </h3>

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
                      <SelectTrigger className="bg-white">
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
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Status *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ativa">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Ativa
                        </div>
                      </SelectItem>
                      <SelectItem value="pausada">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          Pausada
                        </div>
                      </SelectItem>
                      <SelectItem value="concluida">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Concluída
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelada">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Cancelada
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-white" />
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
                      <Input type="date" {...field} className="bg-white" />
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
                      className="min-h-20 bg-white resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || mentorsLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditEnrollmentForm;
