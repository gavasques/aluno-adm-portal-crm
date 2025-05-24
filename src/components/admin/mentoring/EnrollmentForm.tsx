
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMentoring } from '@/hooks/useMentoring';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aluno</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user-1">João Silva</SelectItem>
                    <SelectItem value="user-2">Maria Santos</SelectItem>
                    <SelectItem value="user-3">Pedro Costa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mentoringId"
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
                    {catalogs.map((catalog) => (
                      <SelectItem key={catalog.id} value={catalog.id}>
                        {catalog.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
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
                <FormLabel>Data de Fim</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsibleMentor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mentor Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do mentor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnrollmentForm;
