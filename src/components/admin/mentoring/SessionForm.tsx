
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

const sessionSchema = z.object({
  enrollmentId: z.string().min(1, 'Selecione uma inscrição'),
  type: z.enum(['individual', 'grupo'], { required_error: 'Tipo é obrigatório' }),
  title: z.string().min(1, 'Título é obrigatório'),
  scheduledDate: z.string().min(1, 'Data é obrigatória'),
  scheduledTime: z.string().min(1, 'Horário é obrigatório'),
  durationMinutes: z.coerce.number().min(15, 'Duração mínima de 15 minutos').max(240, 'Duração máxima de 240 minutos'),
  accessLink: z.string().url('Link deve ser uma URL válida').optional().or(z.literal(''))
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SessionFormData>;
  isLoading?: boolean;
}

const SessionForm = ({ onSubmit, onCancel, initialData, isLoading }: SessionFormProps) => {
  const { enrollments } = useMentoring();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      enrollmentId: initialData?.enrollmentId || '',
      type: initialData?.type || 'individual',
      title: initialData?.title || '',
      scheduledDate: initialData?.scheduledDate || '',
      scheduledTime: initialData?.scheduledTime || '',
      durationMinutes: initialData?.durationMinutes || 60,
      accessLink: initialData?.accessLink || ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="enrollmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma inscrição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {enrollments.map((enrollment) => (
                      <SelectItem key={enrollment.id} value={enrollment.id}>
                        {enrollment.mentoring.name} - Aluno {enrollment.studentId}
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Sessão</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="grupo">Grupo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Título da Sessão</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Fundamentos do E-commerce" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accessLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link de Acesso (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://meet.google.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Sessão'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SessionForm;
