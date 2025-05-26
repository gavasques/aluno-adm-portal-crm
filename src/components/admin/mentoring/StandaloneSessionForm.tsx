
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const sessionSchema = z.object({
  scheduledDate: z.string().min(1, 'Data é obrigatória'),
  scheduledTime: z.string().min(1, 'Horário é obrigatório'),
  durationMinutes: z.coerce.number().min(15, 'Duração mínima de 15 minutos').max(240, 'Duração máxima de 240 minutos'),
  meetingLink: z.string().url('Link deve ser uma URL válida').optional().or(z.literal(''))
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface StandaloneSessionFormProps {
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SessionFormData>;
  isLoading?: boolean;
}

const StandaloneSessionForm = ({ onSubmit, onCancel, initialData, isLoading }: StandaloneSessionFormProps) => {
  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      scheduledDate: initialData?.scheduledDate || '',
      scheduledTime: initialData?.scheduledTime || '',
      durationMinutes: initialData?.durationMinutes || 60,
      meetingLink: initialData?.meetingLink || ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="meetingLink"
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

export default StandaloneSessionForm;
